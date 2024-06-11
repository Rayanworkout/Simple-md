const notebookContent = {};
let currentId = 0;

document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');

    // If user types Ctrl + Enter, send the content of the textarea to the server
    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();

            // We create a new cell
            if (event.target.value.trim() !== '') {
                if (event.target.id === "cell-" + currentId.toString()) {
                    // We issue a POST request to the server
                    htmx.ajax('POST', `/convert/new/${currentId}`, { target: event.target, swap: 'outerHTML', source: event.target });
                    currentId++;

                    // And create a new cell underneath
                    createNewCell(notebook);

                } else if (event.target.id !== "cell-" + currentId.toString()) {
                    bareId = event.target.id.split('-')[1];
                    htmx.ajax('POST', `/convert/old/${bareId}`, { target: event.target, swap: 'outerHTML', source: event.target });

                    // Show the edit button
                    const editButton = document.querySelector(`#${event.target.id}.edit`);
                    editButton.style.display = 'block';
                }
            }
        }
    });

    // Modify the notebookContent object when the user types in a cell
    notebook.addEventListener('input', (event) => {
        const id = event.target.id;
        notebookContent[id] = event.target.value;

        // Showing the user the number of characters in the textarea and in the whole notebook
        updateCounter(notebookContent);
    });

    // Dynamically resize first textarea
    textarea = document.querySelector('.cell');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    // Allow user to download the notebook content in a md file
    const downloadButton = document.querySelector('.bi-download');
    downloadButton.addEventListener('click', () => {
        const content = Object.values(notebookContent).join('\n\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notebook.md';
        a.click();
        URL.revokeObjectURL(url);
    });
});