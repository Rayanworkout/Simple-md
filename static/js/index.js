document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('.notebook');

    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            htmx.ajax('POST', '/convert', { target: event.target, swap: 'outerHTML', source: event.target })
            createNewCell(notebook);
        }
    });

    const textarea = document.querySelector('#markdown-content');

    // Dynamically resize textarea
    textarea.addEventListener('input', function () {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
});


function createNewCell(notebook) {
    const newtextArea = document.createElement('textarea');
    newtextArea.classList.add('cell');
    newtextArea.name = 'markdown-content';
    newtextArea.maxLength = 2500;
    notebook.appendChild(newtextArea);
    newtextArea.focus();
}

