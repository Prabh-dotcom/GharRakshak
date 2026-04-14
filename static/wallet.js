function openAddMoney() {
    document.getElementById("addMoneyPopup").style.display = "flex";
}

function closeAddMoney() {
    document.getElementById("addMoneyPopup").style.display = "none";
}

function addMoney() {
    const amount = document.getElementById("amount").value;

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    alert("Redirecting to payment... ₹" + amount);

    // 🔥 Razorpay integrate here later
}