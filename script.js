let myLibrary = [];

function Book (title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

function addBookToLibrary2(title, author, pages, read) {
    let newBook = new Book (title, author, pages, read);
    myLibrary.push(newBook);
}

//All inputs
let title = document.getElementById('title-input');
let author = document.getElementById('author-input');
let pages = document.getElementById('pages-input');
let read = document.getElementById('read-input');

//Get books from form

inputBtn = document.querySelector('#form-input');

inputBtn.addEventListener('click', e => {
    e.preventDefault();
    let titleValue = title.value;
    let authorValue = author.value;
    let pagesValue = pages.value;
    let readValue = read.checked;
    validateInputs()
    if ((titleValue != "") && (authorValue != "") && (pagesValue != "")) {
        addBookToLibrary(titleValue, authorValue, pagesValue, readValue);
        clearValue();
        updateDisplay();
    }
})

//Clear inputs of user input
function clearValue() {
    title.value = "";
    author.value = "";
    pages.value = "";
    read.checked = false;
    clearInnerText(title);
    clearInnerText(author);
    clearInnerText(pages);
}

function clearInnerText(element){
    let inputControl = element.parentElement;
    let errorDisplay = inputControl.querySelector('.input-error');
    errorDisplay.innerText = "";
}

//Validate that inputs have values
function validateInputs() {
    let titleValue = title.value.trim();
    let authorValue = author.value.trim();
    let pagesValue = pages.value.trim();

    if (titleValue === "") {
        setError(title, "Input is required");
    } else {
        setSuccess(title);
    }
    if (authorValue === "") {
        setError(author, "Input is required");
    } else {
        setSuccess(author);
    }
    if (pagesValue === "") {
        setError(pages, "Input is required");
    } else {
        setSuccess(pages);
    }
}

function setError(element, message) {
    let inputControl = element.parentElement;
    let errorDisplay = inputControl.querySelector('.input-error');
    errorDisplay.innerText = message;
    errorDisplay.style.color = "red";
}

function setSuccess(element) {
    let inputControl = element.parentElement;
    let errorDisplay = inputControl.querySelector('.input-error');
    errorDisplay.innerText = "✓";
    errorDisplay.style.color = "green";
}


//Example books
addBookToLibrary("Adventures of Huckleberry Finn", "Mark Twain", 188, true);
addBookToLibrary("Dracula", "Bram Stroker", 418, false);
addBookToLibrary("Stalingrad", "Anthony Beevor", 494, false);

const arrayTable = document.querySelector('#array-table');

//Cycle through array and display contents on screen.
function updateDisplay() {
    //Remove all existing array elements so that they do not repeat.
    removeAllChildNodes(arrayTable);
    for (let i = 0; i < myLibrary.length; i++) {
        //Create a div for array element and add text content.
        let tr = document.createElement('tr');
        tr.classList.add('arrayRow');
        tr.setAttribute('data-arrayPos', `${i}`);
        // div.textContent = `${myLibrary[i].title}, ${myLibrary[i].author}, ${myLibrary[i].pages}, ${myLibrary[i].read}`
        let name = document.createElement('td');
        name.classList.add('nameRw');
        name.textContent = myLibrary[i].title;
        tr.appendChild(name);
        let author = document.createElement('td');
        author.classList.add('authorRw');
        author.textContent = myLibrary[i].author;
        tr.appendChild(author);
        let pages = document.createElement('td');
        pages.classList.add('pagesRw');
        pages.textContent = myLibrary[i].pages;
        tr.appendChild(pages);
        let read = document.createElement('td');
        read.classList.add('readRw');
        tr.appendChild(read);
        //Create a status Btn
        let statusBtn = document.createElement('button');
        statusBtn.classList.add('statusBtn');
        myLibrary[i].read ? statusBtn.textContent = "Read" : statusBtn.textContent = "Not Read";
        read.appendChild(statusBtn);
        //Create cell for delete btn
        let deleteCell = document.createElement('td');
        deleteCell.classList.add('deleteRw');
        tr.appendChild(deleteCell)
        //Add delete button image
        let deleteImg = document.createElement('img');
        deleteImg.classList.add('deleteImg');
        deleteImg.setAttribute('src', 'img/trash.svg');
        deleteImg.setAttribute('alt', 'Delete button with picture of trash can.');
        deleteCell.appendChild(deleteImg);
        //Append tr.
        arrayTable.appendChild(tr);
        }
    let totals = document.createElement('tr');
    let bookTotal = document.createElement('td');
    bookTotal.textContent = `Total number of books: ${myLibrary.length}`;
    bookTotal.setAttribute('colspan', '2');
    totals.appendChild(bookTotal);
    let readTotal = document.createElement('td');
    let readCount = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].read == true) {
            readCount++;
        }
    }
    readTotal.textContent = `Total number of books read: ${readCount}`
    readTotal.setAttribute('colspan', '2');
    totals.appendChild(readTotal);
    arrayTable.appendChild(totals);
}

updateDisplay();

// function removeAllChildNodes(parent) {
//     while (parent.firstChild) {
//         parent.removeChild(parent.firstChild);
//     }
// }

//Removes all nodes except first header row - I don't know why it needs to be 3 in length?
function removeAllChildNodes(parent) {
    while (parent.childNodes.length >= 3) {
        parent.removeChild(parent.lastChild);
    }
}



//Deletes button in DOM but figure out how to do so from array
arrayTable.addEventListener('click', e =>{
    let arrPos = e.target.parentNode.parentNode.getAttribute('data-arrayPos');
    if (e.target.className == 'deleteImg') {
        myLibrary.splice(arrPos, 1);
        updateDisplay();
    } else if (e.target.className == 'statusBtn') {
        myLibrary[arrPos].read ? myLibrary[arrPos].read = false : myLibrary[arrPos].read = true;
        updateDisplay();
    }
})

