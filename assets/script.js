document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = "render-book";

function checkBook() {
  const checkButton = document.getElementById("checkbox");

  if (checkButton.checked) {
    return true;
  } else {
    return false;
  }
}
function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  const checked = checkBook();
  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    Number(year),
    checked
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const belumSelesai = document.getElementById("belum_selesai");
  belumSelesai.innerHTML = "";

  const title1 = document.createElement("div");
  title1.classList.add("title");
  belumSelesai.append(title1);

  const p = document.createElement("p");
  p.innerText = "Belum selesai dibaca";
  title1.appendChild(p);

  const selesai = document.getElementById("selesai");
  selesai.innerHTML = "";

  const title2 = document.createElement("div");
  title2.classList.add("title");
  selesai.append(title2);

  const p2 = document.createElement("p");
  p2.innerText = "Selesai dibaca";
  title2.appendChild(p2);

  const container = document.getElementById("container");
  container.append(selesai);

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      belumSelesai.append(bookElement);
    } else {
      selesai.append(bookElement);
    }
  }
});

function makeBook(bookItem) {
  const box = document.createElement("div");
  box.classList.add("box");
  box.setAttribute("id", `book-${bookItem.id}`);

  const judul = document.createElement("h3");
  judul.classList.add("judul");
  judul.setAttribute("id", "judul");
  judul.innerText = bookItem.title;
  box.append(judul);

  const spanPenulis = document.createElement("span");
  spanPenulis.classList.add("penulis");
  spanPenulis.innerText = "Penulis : ";
  box.append(spanPenulis);

  const penulis = document.createElement("h4");
  penulis.setAttribute("id", "penulis");
  penulis.innerText = bookItem.author;
  spanPenulis.appendChild(penulis);

  const spanTahun = document.createElement("span");
  spanTahun.classList.add("tahun");
  spanTahun.innerText = "Tahun : ";
  box.append(spanTahun);

  const tahun = document.createElement("h4");
  tahun.setAttribute("id", "tahun");
  tahun.innerText = bookItem.year;
  spanTahun.appendChild(tahun);

  const undoRedoButton = document.createElement("button");
  undoRedoButton.classList.add("green");

  const trashButton = document.createElement("button");
  trashButton.classList.add("red");

  if (bookItem.isCompleted) {
    const div = document.createElement("div");
    div.classList.add("action");

    undoRedoButton.innerText = "Belum selesai dibaca";
    div.append(undoRedoButton);

    undoRedoButton.addEventListener("click", function () {
      undoBook(bookItem.id);
    });

    trashButton.innerText = "Hapus buku";
    div.append(trashButton);

    trashButton.addEventListener("click", function () {
      let yakin = confirm("yakin?");
      if (yakin) {
        return removeBook(bookItem.id);
      }
    });

    box.append(div);
  } else {
    const div = document.createElement("div");
    div.classList.add("action");

    undoRedoButton.innerText = "Selesai dibaca";
    div.append(undoRedoButton);

    undoRedoButton.addEventListener("click", function () {
      redoBook(bookItem.id);
    });

    trashButton.innerText = "Hapus buku";
    div.append(trashButton);

    trashButton.addEventListener("click", function () {
      let yakin = confirm("yakin?");
      if (yakin) {
        return removeBook(bookItem.id);
      }
    });

    box.append(div);
  }

  return box;
}

function redoBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved_book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /*Boolean*/ {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
