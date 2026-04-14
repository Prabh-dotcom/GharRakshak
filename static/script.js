function sendMessage() {
    const input = document.getElementById("messageInput");
    const msg = input.value;

    console.log("Message:", msg);

    input.value = "";
}