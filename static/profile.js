function enableEdit() {
    document.querySelectorAll("input, textarea").forEach(el => {
        el.disabled = false;
    });
}

function saveProfile() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    document.getElementById("userName").innerText = name;
    document.getElementById("userPhone").innerText = "+91 " + phone;

    document.querySelectorAll("input, textarea").forEach(el => {
        el.disabled = true;
    });

    alert("Profile Updated ✅");

    // 🔥 later: send to backend using fetch()
}