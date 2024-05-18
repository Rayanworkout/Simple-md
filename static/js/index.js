document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.querySelector('#notebook');

    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            createNewCell(notebook);
        }
    });
});


function createNewCell(notebook) {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    newCell.contentEditable = 'true';
    notebook.appendChild(newCell);
    newCell.focus();
}
