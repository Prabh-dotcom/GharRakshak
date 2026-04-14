let cart = {};

// FILTER CATEGORY
function filterService(category) {
    document.querySelectorAll(".service-group").forEach(group => {
        group.style.display =
            group.dataset.category === category ? "block" : "none";
    });
}

// DEFAULT LOAD
window.onload = () => filterService("switch");

// ADD + DIRECT PAY
function addAndPay(name, price) {
    if (!cart[name]) {
        cart[name] = { price: price, qty: 1 };
    }

    document.getElementById("control-" + name).classList.add("active");
    document.getElementById("qty-" + name).innerText = 1;

    updateCart();

    payNow(); // 🔥 instant payment
}

// CHANGE QTY
function changeQty(name, change) {
    if (!cart[name]) return;

    cart[name].qty += change;

    if (cart[name].qty <= 0) {
        delete cart[name];
        document.getElementById("control-" + name).classList.remove("active");
    }

    updateCart();
}

// UPDATE CART UI
function updateCart() {
    const cartList = document.getElementById("cart-items");
    const totalEl = document.querySelector(".total");

    cartList.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        let li = document.createElement("li");
        li.innerText = `${item} x${cart[item].qty}`;
        cartList.appendChild(li);

        document.getElementById("qty-" + item).innerText = cart[item].qty;

        total += cart[item].price * cart[item].qty;
    }

    totalEl.innerText = "Total: ₹" + total;
}

// PAYMENT
function payNow() {
    fetch("/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart)
    })
    .then(res => res.json())
    .then(data => {
        const options = {
            key: "YOUR_RAZORPAY_KEY",
            amount: data.amount,
            currency: "INR",
            name: "GharRakshak",
            description: "Service Payment",
            order_id: data.id,
            handler: function () {
                alert("Payment Successful 🎉");
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    });
}

function goToCheckout() {
    if (Object.keys(cart).length === 0) {
        alert("Cart is empty!");
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/checkout";
}