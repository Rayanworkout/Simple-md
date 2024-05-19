const notebookContent = {};
let currentId = 0;

// reset, download html, download markdown
// char counter, delete cell

document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');

    // If user types Ctrl + Enter, send the content of the textarea to the server
    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();

            // We create a new cell
            if (event.target.value !== '') {
                if (event.target.id === "cell-" + currentId.toString()) {
                    // We issue a POST request to the server
                    htmx.ajax('POST', `/convert/new/${currentId}`, { target: event.target, swap: 'outerHTML', source: event.target });
                    currentId++;

                    // And create a new cell underneath
                    createNewCell(notebook);

                } else if (event.target.id !== "cell-" + currentId.toString()) {
                    bareId = event.target.id.split('-')[1];
                    htmx.ajax('POST', `/convert/old/${bareId}`, { target: event.target, swap: 'outerHTML', source: event.target });
                }
            }
        }
    });

    // Modify the notebookContent object when the user types in a cell
    notebook.addEventListener('input', (event) => {
        const id = event.target.id;
        notebookContent[id] = event.target.value;
    });

    // Dynamically resize first textarea
    textarea = document.querySelector('.cell');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
});


const createNewCell = (notebook) => {
    const newtextArea = document.createElement('textarea');
    newtextArea.classList.add('cell');
    newtextArea.name = 'markdown-content';

    newtextArea.id = "cell-" + currentId.toString();

    newtextArea.maxLength = 2500;
    newtextArea.placeholder = 'Type here...';

    notebook.appendChild(newtextArea);
    newtextArea.focus();

    // Dynamically resize textarea
    newtextArea.addEventListener('input', () => {
        newtextArea.style.height = 'auto';
        newtextArea.style.height = newtextArea.scrollHeight + 'px';
    });
}

const editCell = (id) => {
    // Make the cell a textarea again
    const fullId = `cell-${id}`;
    const markdown = notebookContent[fullId];
    const textarea = document.createElement('textarea');

    textarea.classList.add('cell');
    textarea.name = 'markdown-content';
    textarea.id = fullId;
    textarea.maxLength = 2500;
    textarea.value = markdown;
    textarea.style.marginTop = '10px';
    textarea.style.marginBottom = '10px';

    const cell = document.querySelector(`#${fullId}.cell`);
    cell.replaceWith(textarea);
    textarea.focus();
};