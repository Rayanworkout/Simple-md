const notebookContent = {};

document.addEventListener('DOMContentLoaded', (_) => {

    const notebook = document.querySelector('.notebook');

    // If user types Ctrl + Enter, send the content of the textarea to the server
    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();

            // We add the content of the textarea to the notebookContent object
            notebookContent[event.target.id] = event.target.value;

            // We issue a POST request to the server
            htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target })

            // We create a new cell
            createNewCell(notebook);

            // Add event listnener to all cells "md-html" class
            // if user double clicks, we retrieve the value in markdown format
            const cells = document.querySelectorAll('.md-html');
            cells.forEach((cell) => {
                console.log(cell);
                cell.addEventListener('click', (event) => {
                    const cellId = event.target.id;
                    const markdownContent = notebookContent[cellId];
                    console.log(markdownContent);
                })
            });
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

    // Assign a random id to the new textarea
    randomId = Math.floor(Math.random() * 10000) + 1;
    newtextArea.id = `cell-${randomId}`;

    notebook.appendChild(newtextArea);
    newtextArea.focus();

    // Dynamically resize textarea
    newtextArea.addEventListener('input', () => {
        newtextArea.style.height = 'auto';
        newtextArea.style.height = newtextArea.scrollHeight + 'px';
    });

}
