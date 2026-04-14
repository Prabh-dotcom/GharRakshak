function openPayment() {
    document.getElementById("paymentBox").style.display = "block";
}

function payNow() {
    const method = document.querySelector('input[name="pay"]:checked');

    if (!method) {
        alert("Select payment method");
        return;
    }

    alert("Processing Payment... 💳");

    // 🔥 Razorpay / Stripe integration here later
}
