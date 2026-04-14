function toggleOptions(id) {
    const current = document.getElementById(id);

    document.querySelectorAll('.sub-options').forEach(el => {
        if (el !== current) {
            el.classList.remove('active');
        }
    });

    current.classList.toggle('active');
}