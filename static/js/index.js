document.addEventListener('DOMContentLoaded', (_) => {
    const notebook = document.getElementById('notebook');

    notebook.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            event.target.classList.add('hidden')
            createNewCell();
        }
    });

    function createNewCell() {
        const newCell = document.createElement('div');
        newCell.classList.add('cell');
        newCell.contentEditable = 'true';
        notebook.appendChild(newCell);
        newCell.focus();
    }
});
