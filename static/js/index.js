const notebookContent = {};
let currentId = 0;

document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');

    // If user types Ctrl + Enter, send the content of the textarea to the server
    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();

            // We create a new cell
            if (event.target.id === currentId.toString() && event.target.value !== '') {
                createNewCell(notebook);

                // We issue a POST request to the server
                htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target });
            } else if (event.target.id !== currentId.toString() && event.target.value !== '') {
                htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target });
            }


            setTimeout(() => {
                const cells = document.querySelectorAll('.md-html');
                let counter = 0;
                cells.forEach((cell) => {
                    // We assign an id to each cell depending on the order they were created
                    cell.id = counter;
                    counter++;
                });
            }, 500);

            notebook.addEventListener('dblclick', (event) => {
                // Add event listener to all cells "md-html" class
                // if user double clicks, we retrieve the value in markdown format
                if (event.target.classList.contains('md-html')) {
                    const id = event.target.id;
                    const markdown = notebookContent[id];

                    // Make the cell a textarea again
                    const textarea = document.createElement('textarea');
                    textarea.classList.add('cell');
                    textarea.name = 'markdown-content';
                    textarea.id = id;
                    textarea.maxLength = 2500;
                    textarea.value = markdown;
                    textarea.style.marginTop = '10px';
                    textarea.style.marginBottom = '10px';

                    event.target.replaceWith(textarea);
                }
            });

        }
    });

    // Modify the notebookContent object when the user types in a cell, using debouncing
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

    newtextArea.id = currentId + 1;
    currentId++;

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
