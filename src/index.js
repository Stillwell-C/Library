import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import trash from "./img/trash.svg";
import "./style.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFMZx4SAtCBPoWLy5o_HPpO7vJ8Eyj-b0",
  authDomain: "library-88935.firebaseapp.com",
  projectId: "library-88935",
  storageBucket: "library-88935.appspot.com",
  messagingSenderId: "714489833260",
  appId: "1:714489833260:web:2f368024dcfc51b1a5ae89",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//user login or signup
onAuthStateChanged(auth, (user) => {
  console.log("user status changed", user);

  const overlay = document.querySelector("#overlay");

  if (!user) {
    signupModal.classList.add("active");
    overlay.classList.add("active");
  } else {
    signupModal.classList.remove("active");
    loginModal.classList.remove("active");
    overlay.classList.remove("active");
  }
});

//real time collection
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userNameDisplay = document.querySelector(".user-name-display");
    userNameDisplay.textContent = user.email;
    console.log(user);
    const colRef = collection(db, user.uid);
    const queriedBooks = query(colRef, orderBy("createdAt"));
    onSnapshot(queriedBooks, (snapshot) => {
      myLibrary = [];
      snapshot.docs.forEach((doc) => {
        //TODO just make this call update
        myLibrary.push({ ...doc.data(), id: doc.id });
      });
      console.log(myLibrary);
      updateDisplay();
    });
  } else {
    console.log("Sign in to see collection");
  }
});

//Delete books
const deleteBookFromLibrary = (id) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(db, user.uid, id);
      deleteDoc(docRef).catch((err) => {
        console.log(err.message);
      });
    } else {
      console.log("Please sign in to delete books from library");
    }
  });
};

//Edit book status
const editBookStatus = (id, currentStatus) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(db, user.uid, id);
      updateDoc(docRef, {
        read: !currentStatus,
      });
    } else {
      console.log("Please log in to edit book");
    }
  });
};

let myLibrary = [];

//Add inputs to the database
const addBookForm = document.getElementById("book-input-form");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  validateInputs();
  if (title.validity.valid && author.validity.valid && pages.validity.valid) {
    onAuthStateChanged(auth, (user) => {
      const colRef = collection(db, user.uid);
      addDoc(colRef, {
        title: addBookForm.titleInput.value,
        author: addBookForm.authorInput.value,
        pages: addBookForm.pagesInput.value,
        read: addBookForm.readInput.checked,
        createdAt: serverTimestamp(),
      })
        .then(() => {
          addBookForm.reset();
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  }
});

//All inputs
let title = document.getElementById("title-input");
let author = document.getElementById("author-input");
let pages = document.getElementById("pages-input");

function validateTitle() {
  let errorDiv = title.parentElement.querySelector(".input-error");
  if (title.validity.valid) {
    errorDiv.textContent = "";
    title.classList.remove("failure");
    title.classList.add("success");
  } else if (title.validity.valueMissing) {
    title.parentElement.querySelector(".input-error").textContent =
      "Please enter the title of the book";
    title.classList.remove("success");
    title.classList.add("failure");
  } else if (title.validity.patternMismatch) {
    title.parentElement.querySelector(".input-error").textContent =
      "Not a valid entry";
    title.classList.remove("success");
    title.classList.add("failure");
  }
}

function validateAuthor() {
  let errorDiv = author.parentElement.querySelector(".input-error");
  if (author.validity.valid) {
    errorDiv.textContent = "";
    author.classList.remove("failure");
    author.classList.add("success");
  } else if (author.validity.valueMissing) {
    author.parentElement.querySelector(".input-error").textContent =
      "Please enter the author of the book";
    author.classList.add("failure");
    author.classList.remove("success");
  } else if (author.validity.patternMismatch) {
    author.parentElement.querySelector(".input-error").textContent =
      "Not a valid entry";
    author.classList.add("failure");
    author.classList.remove("success");
  }
}

function validatePages() {
  let errorDiv = pages.parentElement.querySelector(".input-error");
  if (pages.validity.valid) {
    errorDiv.textContent = "";
    pages.classList.remove("failure");
    pages.classList.add("success");
  } else if (pages.validity.valueMissing) {
    pages.parentElement.querySelector(".input-error").textContent =
      "Please enter the number of pages";
    pages.classList.add("failure");
    pages.classList.remove("success");
  } else if (pages.validity.rangeUnderflow) {
    pages.parentElement.querySelector(".input-error").textContent =
      "The book must have at least 1 page";
    pages.classList.add("failure");
    pages.classList.remove("success");
  }
}

function validateInputs() {
  validateTitle();
  validateAuthor();
  validatePages();
  console.log("function run");
}

const arrayTable = document.querySelector("#array-table");

//Cycle through array and display contents on screen.
function updateDisplay() {
  //Remove all existing array elements so that they do not repeat.
  removeAllChildNodes(arrayTable);
  //Loop to cycle through array and add dom elements
  for (let i = 0; i < myLibrary.length; i++) {
    //Create a div for array element and add text content.
    let tr = document.createElement("div");
    tr.classList.add("array-row");
    tr.setAttribute("role", "rowgroup");
    //Create name cell
    let name = document.createElement("div");
    name.classList.add("nameRw");
    name.classList.add("cell");
    name.textContent = myLibrary[i].title;
    name.setAttribute("role", "cell");
    tr.appendChild(name);
    //Create author cell
    let author = document.createElement("div");
    author.classList.add("authorRw");
    author.classList.add("cell");
    author.textContent = myLibrary[i].author;
    author.setAttribute("role", "cell");
    tr.appendChild(author);
    //Create pages cell
    let pages = document.createElement("div");
    pages.classList.add("pagesRw");
    pages.classList.add("cell");
    pages.textContent = myLibrary[i].pages;
    pages.setAttribute("role", "cell");
    tr.appendChild(pages);
    let read = document.createElement("div");
    //Create read status cell
    read.classList.add("readRw");
    read.classList.add("cell");
    read.setAttribute("role", "cell");
    tr.appendChild(read);
    //Create a status Btn inside status cell
    let statusBtn = document.createElement("button");
    statusBtn.classList.add("statusBtn");
    myLibrary[i].read
      ? (statusBtn.textContent = "Read")
      : (statusBtn.textContent = "Not Read");
    statusBtn.addEventListener("click", () => {
      editBookStatus(myLibrary[i].id, myLibrary[i].read);
    });
    read.appendChild(statusBtn);
    //Create cell for delete btn
    let deleteCell = document.createElement("div");
    deleteCell.classList.add("deleteRw");
    deleteCell.classList.add("cell");
    deleteCell.setAttribute("role", "cell");
    tr.appendChild(deleteCell);
    //Add delete button image
    let deleteImg = document.createElement("img");
    deleteImg.classList.add("deleteImg");
    deleteImg.setAttribute("src", trash);
    deleteImg.setAttribute("alt", "Delete button.");
    deleteImg.addEventListener("click", () => {
      deleteBookFromLibrary(myLibrary[i].id);
    });
    deleteCell.appendChild(deleteImg);
    //Append the row for each book
    arrayTable.appendChild(tr);
  }
  //Create a bottom row to display totals for book number and pages read
  let totals = document.createElement("div");
  totals.classList.add("table-footer");
  totals.classList.add("array-row");
  totals.setAttribute("role", "rowgroup");
  //Book total cell
  let bookTotal = document.createElement("div");
  bookTotal.textContent = `Total number of books: ${myLibrary.length}`;
  bookTotal.classList.add("cell");
  bookTotal.setAttribute("role", "cell");
  totals.appendChild(bookTotal);
  //Pages read total cell
  let readTotal = document.createElement("div");
  //Cycle through array to determine number of pages read
  let pageCount = myLibrary
    .filter((book) => book.read == true)
    .reduce((sum, book) => sum + parseInt(book.pages), 0);
  readTotal.textContent = `Total number of pages read: ${pageCount}`;
  readTotal.setAttribute("role", "cell");
  readTotal.classList.add("cell");
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

//sign up new users
const signupForm = document.querySelector(".signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.signupEmail.value;
  const password = signupForm.signupPassword.value;
  const passwordCheck = signupForm.signupPasswordConfirm.value;
  const errorDiv = document.querySelector(".signup-modal-error");
  if (password === passwordCheck) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        errorDiv.textContent = "";
        console.log("user created:", cred.user);
        signupForm.reset();
      })
      .catch((err) => (errorDiv.textContent = err.message));
  } else {
    errorDiv.textContent = "Your passwords do not match";
  }
});

//Event listeners to toggle between login and sign up modals
const signupModal = document.querySelector("#signup-modal");
const loginModal = document.querySelector("#login-modal");
const loginFormLink = document.querySelector(".signup-modal-login-button");
loginFormLink.addEventListener("click", () => {
  signupModal.classList.remove("active");
  loginModal.classList.add("active");
});
const signupFormLink = document.querySelector(".login-modal-sign-button");
signupFormLink.addEventListener("click", () => {
  signupModal.classList.add("active");
  loginModal.classList.remove("active");
});

//log in users
const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.loginEmail.value;
  const password = loginForm.loginPassword.value;
  const errorDiv = document.querySelector(".login-modal-error");
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      errorDiv.textContent = "";
      console.log("user login complete", cred);
    })
    .catch((err) => (errorDiv.textContent = err.message));
});

//log out users
const logoutButton = document.querySelector("#log-out-button");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      myLibrary = [];
      updateDisplay();
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});
