// ===== IMPORTS =====
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const Razorpay = require("razorpay");
const bodyParser = require('body-parser');

const razorpay = new Razorpay({
    key_id: "rzp_test_SZRNUQ3b5xvTQN",
    key_secret: "y4L5magQEsAEV0iphwrtv8w0"
});

// ===== APP INIT =====
const app = express();
const PORT = 8000;

// ===== DATABASE CONNECTION =====
mongoose.connect('mongodb://127.0.0.1:27017/homeService')
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static folder
app.use('/static', express.static(path.join('static')));

// ===== VIEW ENGINE =====
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ===== FILE UPLOAD (MULTER) =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/workers/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ===== MONGOOSE SCHEMA =====
const jobSchema = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    budget: String,
    image: String,
    serviceType: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model('Job', jobSchema);


const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    profilePic: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);



const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/profile/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadProfile = multer({ storage: profileStorage });

// ===== ROUTES =====

// 🏠 Home
app.get('/', (req, res) => {
    res.render('index', { title: "Home" });
});



// 📤 About Page
app.get('/about', (req, res) => {
    res.render('about', { title: "About Us" });
});

// 📤 Jobs Page
app.get('/jobs', (req, res) => {
    res.render('jobs', { title: "Available Jobs" });
});

// ✅ ===== FIXED ROUTE =====
app.post('/partner-submit', upload.single('idProof'), async (req, res) => {
    try {
        const newJob = new Job({
            name: req.body.name,
            email: req.body.phone, // mapped (since schema me email hi hai)
            description: req.body.city,
            budget: req.body.experience,
            serviceType: req.body.service,
            image: req.file ? req.file.filename : null
        });

        await newJob.save();

        console.log("✅ Partner Data Saved");
        res.redirect('/jobs');
    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ ===== PROFILE ROUTE ===== 
app.post('/save-profile', uploadProfile.single('profilePic'), async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            // update existing user
            user.name = req.body.name;
            user.phone = req.body.phone;
            user.address = req.body.address;

            if (req.file) {
                user.profilePic = req.file.filename;
            }

            await user.save();
        } else {
            // create new user
            user = new User({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                profilePic: req.file ? req.file.filename : null
            });

            await user.save();
        }

        res.json({ success: true, user });

    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.get('/get-profile', async (req, res) => {
    try {
        const user = await User.findOne().sort({ createdAt: -1 }); 
        res.json(user);
    } catch (err) {
        res.json(null);
    }
});

// बाकी code same...
// (maine niche kuch change nahi kiya)

// 💬 Chat Page
app.get('/chat', (req, res) => {
    res.render('chat', { title: "Chat" });
});

app.get('/wallet', (req, res) => {
    res.render('wallet', { title: "Wallet" });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: "Profile" });
});

app.get('/electrician', (req, res) => {
    res.render('electrician');
});

app.post("/create-order", async (req, res) => {
    let total = 0;

    for (let item in req.body) {
        total += req.body[item].price * req.body[item].qty;
    }

    const order = await razorpay.orders.create({
        amount: total * 100,
        currency: "INR"
    });

    res.json(order);
});

// CHECKOUT
app.get('/checkout', (req, res) => {
    res.render('checkout');
});

// FINAL BOOKING
app.post('/final-booking', async (req, res) => {
    try {
        const booking = new Booking({
            cart: req.body.cart,
            address: req.body.address,
            time: req.body.time
        });

        await booking.save();

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

//  SAVE ADDRESS FROM CHECKOUT
app.post('/save-address', async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        let user = await User.findOne().sort({ createdAt: -1 });

        if (user) {
            user.name = name;
            user.phone = phone;
            user.address = address;

            await user.save();
        } else {
            user = new User({
                name,
                phone,
                address
            });

            await user.save();
        }

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});
app.get('/plumber', (req, res) => res.render('plumber'));
app.get('/carpenter', (req, res) => res.render('carpenter'));
app.get('/gardener', (req, res) => res.render('gardener'));
app.get('/painter', (req, res) => res.render('painter'));
app.get('/interior', (req, res) => res.render('interior'));
app.get('/pvc', (req, res) => res.render('pvc'));
app.get('/wallpaper', (req, res) => res.render('wallpaper'));

// ===== SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});