let myLibrary = [];

function Book (title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

//Add inputs to array
function addBookToLibrary(title, author, pages, read) {
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

//All inputs
let title = document.getElementById('title-input');
let author = document.getElementById('author-input');
let pages = document.getElementById('pages-input');
let read = document.getElementById('read-input');

//Get books from form to add to array and display if there is user input.
inputBtn = document.querySelector('#form-input');
inputBtn.addEventListener('click', e => {
    e.preventDefault();
    validateInputs()
    if ((title.value != "") && (author.value != "") && (pages.value != "")) {
        addBookToLibrary(title.value, author.value, pages.value, read.value);
        clearValue();
        updateDisplay();
    }
})

//Clear inputs of user input and any inner text below inputs
function clearValue() {
    title.value = "";
    author.value = "";
    pages.value = "";
    read.checked = false;
    clearInnerText(title);
    clearInnerText(author);
    clearInnerText(pages);
}

//Helper function for clearValue() for inner text
function clearInnerText(element){
    let inputControl = element.parentElement;
    let errorDisplay = inputControl.querySelector('.input-error');
    errorDisplay.innerText = "";
}

//Validate that inputs have values and run function to set necessary inner text
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
//Sets error and creates inner text for validateInputs()
function setError(element, message) {
    let inputControl = element.parentElement;
    let errorDisplay = inputControl.querySelector('.input-error');
    errorDisplay.innerText = message;
    errorDisplay.style.color = "red";
}
//Sets success and creates inner text for validateInputs()
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
    //Loop to cycle through array and add dom elements
    for (let i = 0; i < myLibrary.length; i++) {
        //Create a div for array element and add text content.
        let tr = document.createElement('tr');
        tr.classList.add('arrayRow');
        tr.setAttribute('data-arrayPos', `${i}`);
        //Create name cell
        let name = document.createElement('td');
        name.classList.add('nameRw');
        name.textContent = myLibrary[i].title;
        tr.appendChild(name);
        //Create author cell
        let author = document.createElement('td');
        author.classList.add('authorRw');
        author.textContent = myLibrary[i].author;
        tr.appendChild(author);
        //Create pages cell
        let pages = document.createElement('td');
        pages.classList.add('pagesRw');
        pages.textContent = myLibrary[i].pages;
        tr.appendChild(pages);
        let read = document.createElement('td');
        //Create read status cell
        read.classList.add('readRw');
        tr.appendChild(read);
        //Create a status Btn inside status cell
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
        //Append the row for each book
        arrayTable.appendChild(tr);
        }
    //Create a bottom row to display totals for book number and pages read
    let totals = document.createElement('tr');
    //Book total cell
    let bookTotal = document.createElement('td');
    bookTotal.textContent = `Total number of books: ${myLibrary.length}`;
    bookTotal.setAttribute('colspan', '2');
    totals.appendChild(bookTotal);
    //Pages read total cell
    let readTotal = document.createElement('td');
    let pageCount = 0;
    //Cycle through array to determine number of pages read
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].read == true) {
            pageCount += myLibrary[i].pages;
        }
    }
    readTotal.textContent = `Total number of pages read: ${pageCount}`
    readTotal.setAttribute('colspan', '2');
    totals.appendChild(readTotal);
    //Append the table
    arrayTable.appendChild(totals);
}

//Run update when page is initially loaded
updateDisplay();


//Removes all nodes except first header row - I don't know why it needs to be 3 in length?
function removeAllChildNodes(parent) {
    while (parent.childNodes.length >= 3) {
        parent.removeChild(parent.lastChild);
    }
}


//Add event listeners and functions to the delete btn and status btn in each row
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

