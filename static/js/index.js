document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');

    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target })
            createNewCell(notebook);
        }
    });

    const textarea = document.querySelector('.cell');

    // Dynamically resize first textarea
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
    notebook.appendChild(newtextArea);
    newtextArea.focus();

    // Dynamically resize textarea
    newtextArea.addEventListener('input', () => {
        newtextArea.style.height = 'auto';
        newtextArea.style.height = newtextArea.scrollHeight + 'px';
    });
}

