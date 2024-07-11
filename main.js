document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookFormTitle = document.getElementById("bookFormTitle");
    const bookFormAuthor = document.getElementById("bookFormAuthor");
    const bookFormYear = document.getElementById("bookFormYear");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const bookFormIsComplete = document.getElementById("bookFormIsComplete");
    const completeBookList = document.getElementById("completeBookList");
    const searchBookTitle = document.getElementById("searchBookTitle");
    
  
    function loadBooks() {
      const storedBooks = localStorage.getItem("books");
      return storedBooks ? JSON.parse(storedBooks) : [];
    }
  
    function saveBooks(books) {
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    function renderBooks(filteredBooks) {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.dataset.testid = "bookItem";
        bookItem.className = "book-item";
        bookItem.innerHTML = `
          <div data-bookid="${book.id}" data-testid="bookItem">
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun Penerbit: ${book.year}</p>
          <button data-testid="bookItemEditButton" class="edit" onclick="bookItemEditButton(${book.id})">Edit</button>
          <button data-testid="bookItemDeleteButton" class="delete" onclick="bookItemDeleteButton(${book.id})">Hapus</button>
          <button data-testid="bookItemIsCompleteButton" class="complete" onclick="bookItemIsCompleteButton(${book.id})">
            ${book.isComplete ? "Belum Dibaca" : "Selesai Dibaca"}
          </button>
          </div>
        `;
  
        if (book.isComplete) {
            completeBookList.appendChild(bookItem);
        } else {
            incompleteBookList.appendChild(bookItem);
        }
      });
    }
  
    function filterBooks(query) {
      const books = loadBooks();
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      renderBooks(filteredBooks);
    }
  
    window.bookItemEditButton = function (bookId) {
      const books = loadBooks();
      const book = books.find((b) => b.id === bookId);
      if (book) {
        bookFormTitle.value = book.title;
        bookFormAuthor.value = book.author;
        bookFormYear.value = book.year;
        bookFormIsComplete.checked = book.isComplete;
  
        bookForm.dataset.editing = bookId;
      }
      saveBooks(books);
      filterBooks(searchBookTitle.value);
    };
  
    window.bookItemDeleteButton = function (bookId) {
      let books = loadBooks();
      books = books.filter((b) => b.id !== bookId);
      saveBooks(books);
      filterBooks(searchBookTitle.value);
    };
  
    window.bookItemIsCompleteButton = function (bookId) {
      let books = loadBooks();
      const book = books.find((b) => b.id === bookId);
      if (book) {
        book.isComplete = !book.isComplete;
        saveBooks(books);
        filterBooks(searchBookTitle.value);
      }
    };
  
    bookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const bookId = bookForm.dataset.editing;
      const yearValue = Number(bookFormYear.value);
      if (isNaN(yearValue)) {
        alert("Tahun penerbit harus berupa angka.");
        return;
      }
  
      let books = loadBooks();
  
      if (bookId) {
        const book = books.find((b) => b.id === Number(bookId));
        if (book) {
          book.title = bookFormTitle.value;
          book.author = bookFormAuthor.value;
          book.year = yearValue; // Menggunakan nilai tahun yang sudah divalidasi
          book.isComplete = bookFormIsComplete.checked;
          bookForm.removeAttribute("data-editing");
        }
      } else {
        const newBook = {
          id: books.length ? books[books.length - 1].id + 1 : 1,
          title:  bookFormTitle.value,
          author:  bookFormAuthor.value,
          year: yearValue,
          isComplete: bookFormIsComplete.checked,
        };
        books.push(newBook);
      }
  
      saveBooks(books);
      bookFormTitle.value = "";
      bookFormAuthor.value = "";
      bookFormYear.value = "";
      bookFormIsComplete.checked = false;
  
      filterBooks(searchBookTitle.value);
    });
  
    searchBookTitle.addEventListener("input", (event) => {
      filterBooks(event.target.value);
    });
  
    filterBooks("");
  });
  