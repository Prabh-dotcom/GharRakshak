function enableEdit() {
    document.querySelectorAll("input, textarea").forEach(el => {
        el.disabled = false;
    });
}

function saveProfile() {
    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("address", document.getElementById("address").value);

    const fileInput = document.getElementById("profilePicInput");
    if (fileInput.files[0]) {
        formData.append("profilePic", fileInput.files[0]);
    }

    fetch("/save-profile", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert("Profile Saved ✅");
        loadProfile();
    });
}

function loadProfile() {
    fetch("/get-profile")
    .then(res => res.json())
    .then(user => {
        if (!user) return;

        document.getElementById("name").value = user.name;
        document.getElementById("phone").value = user.phone;
        document.getElementById("email").value = user.email;
        document.getElementById("address").value = user.address;

        document.getElementById("userName").innerText = user.name;
        document.getElementById("userPhone").innerText = "+91 " + user.phone;

        if (user.profilePic) {
            document.getElementById("profileImg").src = "/static/profile/" + user.profilePic;
        }
    });
}

// page load pe call
window.onload = loadProfile;s