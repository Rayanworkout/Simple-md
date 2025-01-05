
// Function to create a new editable cell
// and add it at the end of the notebook
// notebook parameter is the notebook div
const createNewCell = (notebook) => {
    const newtextArea = document.createElement('textarea');
    newtextArea.classList.add('cell');
    newtextArea.name = 'markdown-content';

    newtextArea.id = "cell-" + currentId.toString();

    newtextArea.maxLength = 2500;
    if (currentId == 1) {
        newtextArea.placeholder = 'Nice ! you can also edit or delete a rendered cell using the 2 buttons at its top right 😇\n\nBe careful, because the delete button of a cell won\'t ask twice before deleting it ...';
    }

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

    // Delete the cell from the notebookContent object
    delete notebookContent[id];
}

/// Toggle button to save either on server or in browser
const toggleSaveButton = (e) => {
    const toggleSwitch = e.target;
    const toggleText = document.getElementById('toggleText');

    if (toggleSwitch.checked) {
        // Switch to "Save on server"
        toggleText.textContent = 'Save on server';
    } else {
        // Switch to "Save in browser"
        toggleText.textContent = 'Save in browser';
    }
};

/// Function to make a POST request to the server with the markdown content
const sendToServerForDownload = (content, filename) => {
    // Send the content to the server via an HTTP POST request
    fetch('/save-markdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, filename }),
    })
    .then(response => {
        if (response.ok) {
            alert('File successfully saved on the server.');
        } else {
            alert('Could not save file on the server.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving content to the server.');
    });
}


const updateCounter = (notebookContent) => {

    const values = Object.values(notebookContent); // array with all values
    const wordCount = values.map((text) => text.split(' ').length); // An array with the number of words in each text
    const reducedWordCount = wordCount.reduce((count, next) => count + next, 0); // The sum of all words in the object
    const valuesLength = values.map((text) => text.length); // An array with the length of each text
    const sumOfLength = valuesLength.reduce((count, next) => count + next, 0); // The sum of all chars in the object

    const counterDiv = document.querySelector('.counter');
    const newCounter = document.createElement('div');
    newCounter.classList.add('counter', 'text-end');

    newCounter.textContent = `Characters: ${sumOfLength} | Words: ${reducedWordCount}`;
    counterDiv.replaceWith(newCounter);
};

const refresh = () => {
    if (confirm("You're gonna lose all your work. Are you sure?")) {
        location.reload();
    }
}