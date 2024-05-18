const notebookContent = {};

document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');
    let currentId = 0;

    // If user types Ctrl + Enter, send the content of the textarea to the server
    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();

            // We add the content of the textarea to the notebookContent object
            notebookContent[currentId + 1] = event.target.value;
            currentId++;

            // We issue a POST request to the server
            htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target });

            // We create a new cell
            createNewCell(notebook);

            // Add event listener to all cells "md-html" class
            // if user double clicks, we retrieve the value in markdown format
            setTimeout(() => {
                const cells = document.querySelectorAll('.md-html');
                console.log(notebookContent);
                let counter = 1;
                cells.forEach((cell) => {
                    // We assign an id to each cell depending on the order they were created
                    cell.id = counter;
                    cell.addEventListener('click', (event) => {
                        const markdownContent = notebookContent[counter];
                        console.log(markdownContent);
                    });
                    counter++;
                });
            }, 500);

        }
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
