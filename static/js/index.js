
const preview = document.querySelector('#preview');
const inputField = document.querySelector('#editor');


let debounceTimer;

const debounceInput = (value, delay) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        // Make your POST request here
        fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ markdown: value })
        })
        .then(response => response.text())
        .then(html => {
            preview.innerHTML = html;
        });
    }, delay);
};

inputField.addEventListener('input', () => {
    const value = inputField.textContent;
    debounceInput(value, 2500);
});