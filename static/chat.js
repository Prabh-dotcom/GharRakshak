// SEND MESSAGE
function sendMessage() {
    const input = document.getElementById("messageInput");
    const msg = input.value.trim();

    if (msg === "") return;

    const chatBox = document.getElementById("chat-messages");

    const row = document.createElement("div");
    row.classList.add("message-row", "right");

    const div = document.createElement("div");
    div.classList.add("message", "sent");
    div.innerText = msg;

    row.appendChild(div);
    chatBox.appendChild(row);

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔥 ENTER PRESS FOR MESSAGE
function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// OPEN CHAT
function openChat(event, name) {
    document.getElementById("chat-name").innerText = name;

    document.querySelectorAll(".chat-user").forEach(user => {
        user.classList.remove("active");
    });

    event.currentTarget.classList.add("active");
}

// 🔥 SEARCH + ENTER FUNCTION
function handleSearch(event) {
    if (event.key !== "Enter") return;

    const searchValue = event.target.value.toLowerCase();
    const users = document.querySelectorAll(".chat-user");

    let foundUser = null;

    users.forEach(user => {
        const name = user.querySelector(".name").innerText.toLowerCase();

        if (name.includes(searchValue)) {
            foundUser = user;
        }
    });

    if (foundUser) {
        // 🔥 move to top
        const parent = foundUser.parentNode;
        parent.insertBefore(foundUser, parent.children[1]); // after search box

        // 🔥 trigger click
        foundUser.click();
    } else {
        alert("User not found");
    }

    event.target.value = "";
}