
function toggleFAQ(element) {
    const item = element.parentElement;

    item.classList.toggle("active");
}

function toggleFAQ(el) {
    const answer = el.nextElementSibling;

    if (answer.style.display === "block") {
        answer.style.display = "none";
    } else {
        answer.style.display = "block";
    }
}