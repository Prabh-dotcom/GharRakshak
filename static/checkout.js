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
}

// 🔥 ENABLE EDIT
function enableAddressEdit() {
    document.getElementById("addressView").style.display = "none";
    document.getElementById("addressForm").style.display = "block";

    // pre-fill existing data
    document.getElementById("editName").value =
        document.getElementById("addrName").innerText;

    document.getElementById("editPhone").value =
        document.getElementById("addrPhone").innerText.replace("+91 ", "");

    document.getElementById("editAddress").value =
        document.getElementById("addrAddress").innerText;
}

// 🔥 SAVE ADDRESS
function saveAddress() {
    const name = document.getElementById("editName").value;
    const phone = document.getElementById("editPhone").value;
    const address = document.getElementById("editAddress").value;

    if (!name || !phone || !address) {
        alert("Fill all fields");
        return;
    }

    // update UI
    document.getElementById("addrName").innerText = name;
    document.getElementById("addrPhone").innerText = "+91 " + phone;
    document.getElementById("addrAddress").innerText = address;

    // switch back
    document.getElementById("addressView").style.display = "block";
    document.getElementById("addressForm").style.display = "none";

    alert("Address Updated ✅");
}

// 🔥 LOAD ADDRESS FROM DATABASE
function loadAddress() {
    fetch("/get-profile")
    .then(res => res.json())
    .then(user => {
        if (!user) return;

        document.getElementById("addrName").innerText = user.name || "No Name";
        document.getElementById("addrPhone").innerText = "+91 " + (user.phone || "0000000000");
        document.getElementById("addrAddress").innerText = user.address || "No Address";
    });
}

// page load
window.onload = loadAddress;

function saveAddress() {
    const name = document.getElementById("editName").value;
    const phone = document.getElementById("editPhone").value;
    const address = document.getElementById("editAddress").value;

    if (!name || !phone || !address) {
        alert("Fill all fields");
        return;
    }

    fetch("/save-address", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, address })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // update UI
            document.getElementById("addrName").innerText = name;
            document.getElementById("addrPhone").innerText = "+91 " + phone;
            document.getElementById("addrAddress").innerText = address;

            document.getElementById("addressView").style.display = "block";
            document.getElementById("addressForm").style.display = "none";

            alert("Address Saved in DB ✅");
        } else {
            alert("Error saving address ❌");
        }
    });
}