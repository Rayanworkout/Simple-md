
// Function to create a new editable cell
// and add it at the end of the notebook
// notebook parameter is the notebook div
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

// Function to make an html cell editable again
// Both editables cells and the rendered markdown cells have the same id
// id parameter is the id of the cell to edit
// We then replace the cell with a textarea
const editCell = (id) => {
    // Hide the edit button
    const editButton = document.querySelector(`#${id}.edit`);
    editButton.style.display = 'none';
    // Make the cell a textarea again
    const markdown = notebookContent[id];
    const textarea = document.createElement('textarea');

    textarea.classList.add('cell');
    textarea.name = 'markdown-content';
    textarea.id = id;
    textarea.maxLength = 2500;
    textarea.value = markdown;
    textarea.style.marginTop = '10px';
    textarea.style.marginBottom = '10px';

    const cell = document.querySelector(`#${id}.cell`);
    cell.replaceWith(textarea);
    textarea.focus();
};

// Function to delete a cell
// id parameter is the id of the cell to delete
const deleteCell = (id) => {
    const cellAndButtons = document.querySelectorAll(`#${id}`);
    cellAndButtons.forEach((element) => {
        element.remove();
    });
}

const updateCounter = (notebookContent) => {

    const values = Object.values(notebookContent); // array with all values
    const wordCount = values.map((text) => text.split(' ').length); // An array with the number of words in each text
    const valuesLength = values.map((text) => text.length); // An array with the length of each text
    const sumOfLength = valuesLength.reduce((count, next) => count + next, 0); // The sum of all chars in the object

    const counterDiv = document.querySelector('.counter');
    const newCounter = document.createElement('div');
    newCounter.classList.add('counter', 'text-end');

    newCounter.textContent = `Characters: ${sumOfLength} | Words: ${wordCount}`;
    counterDiv.replaceWith(newCounter);
};