// ===== IMPORTS =====
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: "rzp_test_SZRNUQ3b5xvTQN",
    key_secret: "y4L5magQEsAEV0iphwrtv8w0"
});

// ===== APP INIT =====
const app = express();
const PORT = 8000;


// ===== DATABASE CONNECTION (FIXED) =====
mongoose.connect('mongodb://127.0.0.1:27017/homeService')
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static folder (IMPORTANT)
app.use('/static', express.static(path.join('static')));

// ===== VIEW ENGINE =====
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ===== FILE UPLOAD (MULTER) =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'statics/images/');
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

// ===== ROUTES =====

// 🏠 Home
app.get('/', (req, res) => {
    res.render('index', { title: "Home" });
});

// 📤 Upload Work Page
app.get('/worker', (req, res) => {
    res.render('worker', { title: "Post Your Work" });
});

// 📤 About Page
app.get('/about', (req, res) => {
    res.render('about', { title: "About Us" });
});

// 📋 Show All Jobs (for service providers)
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.render('jobs', { title: "Available Jobs", jobs });
    } catch (err) {
        res.send("Error fetching jobs");
    }
});

// 📥 Handle Form Submission (WITH IMAGE)
app.post('/submit', upload.single('image'), async (req, res) => {
    try {
        const newJob = new Job({
            name: req.body.name,
            email: req.body.email,
            description: req.body.description,
            budget: req.body.budget,
            serviceType: req.body.serviceType,
            image: req.file ? req.file.filename : null
        });

        await newJob.save();

        console.log("✅ Job Saved");
        res.redirect('/jobs');
    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).send("Server Error");
    }
});

// 💬 Chat Page (UI only for now)
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

// CHECKOUT PAGE
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

app.get('/plumber', (req, res) => {
    res.render('plumber');
});

app.get('/carpenter', (req, res) => {
    res.render('carpenter');
});

app.get('/gardener', (req, res) => {
    res.render('gardener');
});

app.get('/painter', (req, res) => {
    res.render('painter');
});

app.get('/interior', (req, res) => {
    res.render('interior');
}); 

app.get('/pvc', (req, res) => {
    res.render('pvc');
}); 

app.get('/wallpaper', (req, res) => {
    res.render('wallpaper');
}); 



// ===== SERVER START =====
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});