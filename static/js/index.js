
const preview = document.querySelector('#preview');
const inputField = document.querySelector('#editor');

// These functions are not used since we use HTMX

// inputField.addEventListener('input', () => {
//     debounceInput(2000);
// });

const convertMarkdown = async (data) => {
    try {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ markdown: data })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.text();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    };
}

const updatePreview = async () => {
    try {

        const html = await convertMarkdown(inputField.value);
        preview.innerHTML = html;
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

let debounceTimer;

const debounceInput = (delay) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        updatePreview();

    }, delay);
};