/* ========================================
   VMC NEXUS JAVASCRIPT SYSTEM
======================================== */

/* DEFAULT SAMPLE BOOKS DATA */
const defaultBooks = [
    {
        id: 1,
        title: "Introduction to Information Systems",
        category: "Information Technology",
        location: "Shelf A1",
        author: "James A. O'Brien",
        isbn: "978-0073376776",
        year: "2021",
        status: "Available (4 copies left)",
        description: "Provides an overview of information systems, foundational technologies, e-business applications, and strategic implementation within modern organizations."
    },
    {
        id: 2,
        title: "Web Development Basics",
        category: "Programming",
        location: "Shelf A2",
        author: "Jon Duckett",
        isbn: "978-1118871645",
        year: "2022",
        status: "Available (2 copies left)",
        description: "An introductory guide covering standard web technology principles including structured layout design, responsive styling, and client-side interactions."
    },
    {
        id: 3,
        title: "Database Management",
        category: "Information Systems",
        location: "Shelf B1",
        author: "Carlos Coronel & Steven Morris",
        isbn: "978-1337558822",
        year: "2020",
        status: "Available (5 copies left)",
        description: "Covers database design, implementation, and management concepts including relational models, normalization, SQL querying, and database administration."
    },
    {
        id: 4,
        title: "Computer Programming",
        category: "Programming",
        location: "Shelf B2",
        author: "Tony Gaddis",
        isbn: "978-0134801131",
        year: "2023",
        status: "Available (3 copies left)",
        description: "A comprehensive guide to fundamental logic, control structures, array manipulation, object-oriented concepts, and algorithm development."
    }
];

/* RENDER LIBRARY BOOKS ON PAGE */
function displayBooks() {
    const container = document.getElementById("bookList");
    if (!container) return;

    container.innerHTML = "";
    defaultBooks.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.style.cursor = "pointer";
        card.onclick = function () { openBookModal(index); };

        card.innerHTML = `
            <h3>${escapeHtml(book.title)}</h3>
            <p>Category: ${escapeHtml(book.category)}</p>
            <strong style="color: #38bdf8; display: block; margin-top: 10px;">Location: ${escapeHtml(book.location)}</strong>
            <span style="color: #4da3ff; font-size: 12px; display: inline-block; margin-top: 10px;">Click for book details →</span>
        `;
        container.appendChild(card);
    });
}

/* SEARCH BOOKS FUNCTION */
function searchBooks() {
    const searchInput = document.getElementById("bookSearch");
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const books = document.querySelectorAll(".book-card");

    books.forEach(function (bookCard) {
        const text = bookCard.innerText.toLowerCase();
        if (text.includes(query)) {
            bookCard.style.display = "flex";
        } else {
            bookCard.style.display = "none";
        }
    });
}

/* BOOK MODAL HANDLERS */
function openBookModal(index) {
    const book = defaultBooks[index];
    if (!book) return;

    document.getElementById("modalBookTitle").innerText = book.title;
    document.getElementById("modalBookCategory").innerText = book.category;
    document.getElementById("modalBookLocation").innerText = book.location;
    document.getElementById("modalBookAuthor").innerText = book.author;
    document.getElementById("modalBookIsbn").innerText = book.isbn;
    document.getElementById("modalBookYear").innerText = book.year;
    document.getElementById("modalBookStatus").innerText = book.status;
    document.getElementById("modalBookDescription").innerText = book.description;

    const modal = document.getElementById("bookModal");
    if (modal) modal.style.display = "flex";
}

function closeBookModal() {
    const modal = document.getElementById("bookModal");
    if (modal) modal.style.display = "none";
}

/* DEFAULT SAMPLE ANNOUNCEMENTS */
const defaultAnnouncements = [
    {
        title: "Enrollment Updates",
        date: "September 2026",
        content: "Students are reminded to check their enrollment information and complete any required documents.\n\nPlease visit the Registrar's Office or submit missing credentials through the student portal before September 30, 2026."
    },
    {
        title: "Student Activities",
        date: "September 2026",
        content: "Upcoming student club orientations and campus activities will take place next week at the Student Center Auditorium.\n\nAll organizations are requested to submit their activity proposals to the Student Affairs Office."
    },
    {
        title: "Library Schedule Extension",
        date: "August 2026",
        content: "The campus library will now be open until 8:00 PM during weekdays to accommodate review sessions and group study.\n\nPlease present your valid student ID upon entering."
    }
];

/* INITIALIZE ANNOUNCEMENTS DATA */
function initAnnouncements() {
    let stored = localStorage.getItem("vmcAnnouncements");
    if (!stored) {
        localStorage.setItem("vmcAnnouncements", JSON.stringify(defaultAnnouncements));
    }
}

/* RENDER ANNOUNCEMENTS ON PUBLIC PAGE */
function displayAnnouncements() {
    const container = document.getElementById("announcementList");
    if (!container) return;

    let list = JSON.parse(localStorage.getItem("vmcAnnouncements")) || [];

    if (list.length === 0) {
        container.innerHTML = "<p style='color: #64748b; text-align: center;'>No announcements published yet.</p>";
        return;
    }

    container.innerHTML = "";
    list.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "announcement-card";
        card.style.cursor = "pointer";
        card.onclick = function () { openAnnouncementModal(index); };

        const previewText = item.content.length > 120 ? item.content.substring(0, 120) + "..." : item.content;

        card.innerHTML = `
            <small>${escapeHtml(item.date)}</small>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(previewText)}</p>
            <span style="color: #4da3ff; font-size: 12px; display: inline-block; margin-top: 10px;">Click to view details →</span>
        `;
        container.appendChild(card);
    });
}

/* ANNOUNCEMENT MODAL HANDLERS */
function openAnnouncementModal(index) {
    let list = JSON.parse(localStorage.getItem("vmcAnnouncements")) || [];
    const item = list[index];
    if (!item) return;

    document.getElementById("modalDate").innerText = item.date;
    document.getElementById("modalTitle").innerText = item.title;
    document.getElementById("modalBody").innerText = item.content;

    const modal = document.getElementById("announcementModal");
    if (modal) modal.style.display = "flex";
}

function closeAnnouncementModal() {
    const modal = document.getElementById("announcementModal");
    if (modal) modal.style.display = "none";
}

/* REGISTER ACCOUNT */
function register(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById("regName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const message = document.getElementById("register-message");

    if (!nameInput || !emailInput || !passwordInput) return false;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!email.includes("@vmc.com")) {
        if (message) {
            message.style.color = "#ef4444";
            message.innerText = "Email must end with @vmc.com (e.g., bhet@vmc.com)";
        }
        return false;
    }

    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        if (message) {
            message.style.color = "#ef4444";
            message.innerText = "An account with this email already exists!";
        }
        return false;
    }

    const newUser = { name: name, email: email, password: password };
    users.push(newUser);
    localStorage.setItem("vmcRegisteredUsers", JSON.stringify(users));

    localStorage.setItem("vmcUser", name);

    if (message) {
        message.style.color = "#10b981";
        message.innerText = "Registration successful! Redirecting...";
    }

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
    return false;
}

/* LOGIN */
function login(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("login-message");

    if (!emailInput || !passwordInput) return false;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!email.includes("@vmc.com")) {
        if (message) {
            message.style.color = "#ef4444";
            message.innerText = "Email must contain @vmc.com (e.g., bhet@vmc.com)";
        }
        return false;
    }

    if (email === "admin@vmc.com" && password === "admin123") {
        localStorage.setItem("vmcUser", "Administrator");
        window.location.href = "admin.html";
        return false;
    }

    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
        localStorage.setItem("vmcUser", foundUser.name);
        window.location.href = "index.html";
        return false;
    }

    if (password.length > 0) {
        const userName = email.split("@")[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        localStorage.setItem("vmcUser", formattedName);
        window.location.href = "index.html";
        return false;
    }

    if (message) {
        message.style.color = "#ef4444";
        message.innerText = "Invalid email or password.";
    }
    return false;
}

/* SHOW / HIDE PASSWORDS */
function showPassword() {
    const password = document.getElementById("password");
    const button = document.getElementById("showButton");
    if (!password || !button) return;

    if (password.type === "password") {
        password.type = "text";
        button.innerText = "HIDE";
    } else {
        password.type = "password";
        button.innerText = "SHOW";
    }
}

function showRegPassword() {
    const password = document.getElementById("regPassword");
    const button = document.getElementById("regShowButton");
    if (!password || !button) return;

    if (password.type === "password") {
        password.type = "text";
        button.innerText = "HIDE";
    } else {
        password.type = "password";
        button.innerText = "SHOW";
    }
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("vmcUser");
    window.location.href = "index.html";
}

/* AUTHENTICATION & NAVBAR CHECK */
function checkUserAuth() {
    const user = localStorage.getItem("vmcUser");

    if (user) {
        const navLoginBtn = document.querySelector(".navbar nav .login-btn");
        if (navLoginBtn) {
            navLoginBtn.outerHTML = `<button onclick="logout()" class="logout-btn">Logout</button>`;
        }

        const studentNameInput = document.getElementById("studentName");
        if (studentNameInput) studentNameInput.value = user;

        const wallNameInput = document.getElementById("wallName");
        if (wallNameInput) wallNameInput.value = user;
    }
}

/* CONCERNS FORM */
function submitConcern(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("studentName").value;
    const category = document.getElementById("category").value;
    const subject = document.getElementById("concernSubject").value;
    const message = document.getElementById("concernMessage").value;

    const concern = {
        name: name,
        category: category,
        subject: subject,
        message: message,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
    concerns.push(concern);
    localStorage.setItem("concerns", JSON.stringify(concerns));

    alert("Your concern has been submitted successfully!");
    event.target.reset();

    const user = localStorage.getItem("vmcUser");
    if (user) document.getElementById("studentName").value = user;

    displayConcerns();
    return false;
}

function displayConcerns() {
    const list = document.getElementById("concernList");
    if (!list) return;

    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];

    if (concerns.length === 0) {
        list.innerHTML = "<p style='color: #64748b;'>No concerns submitted yet.</p>";
        return;
    }

    list.innerHTML = "";
    concerns.forEach(function (concern) {
        const item = document.createElement("div");
        item.className = "wall-post";
        item.style.marginBottom = "15px";

        item.innerHTML = `
            <h3 style="color:#4da3ff; margin-bottom:5px;">${escapeHtml(concern.subject)}</h3>
            <p><strong>Student:</strong> ${escapeHtml(concern.name)} | <strong>Category:</strong> ${escapeHtml(concern.category)}</p>
            <p style="margin: 8px 0;">${escapeHtml(concern.message)}</p>
            <span style="color:#f39c12; font-weight:600;">Status: ${escapeHtml(concern.status)}</span>
            <small style="color:#64748b;">${escapeHtml(concern.date)}</small>
        `;
        list.appendChild(item);
    });
}

/* FREEDOM WALL FORM */
function postMessage(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("wallName").value;
    const message = document.getElementById("wallMessage").value;

    const post = {
        name: name,
        message: message,
        date: new Date().toLocaleString()
    };

    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
    posts.unshift(post);
    localStorage.setItem("wallPosts", JSON.stringify(posts));

    alert("Your message has been posted!");
    event.target.reset();

    const user = localStorage.getItem("vmcUser");
    if (user) document.getElementById("wallName").value = user;

    displayWallPosts();
    return false;
}

function displayWallPosts() {
    const container = document.getElementById("wallPosts");
    if (!container) return;

    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];

    if (posts.length === 0) {
        container.innerHTML = "<p style='color: #64748b;'>No messages yet.</p>";
        return;
    }

    container.innerHTML = "";
    posts.forEach(function (post) {
        const div = document.createElement("div");
        div.className = "wall-post";

        div.innerHTML = `
            <h3>${escapeHtml(post.name)}</h3>
            <p>${escapeHtml(post.message)}</p>
            <small>${escapeHtml(post.date)}</small>
        `;
        container.appendChild(div);
    });
}

/* SCHOLARSHIP ALERT */
function showScholarship(name) {
    alert(
        name +
        "\n\nPlease contact the school administration for requirements, application dates, and complete scholarship information."
    );
}

/* HTML SANITIZER HELPER */
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, '&#039;');
}

/* GLOBAL DOM INITIALIZATION */
document.addEventListener("DOMContentLoaded", function () {
    checkUserAuth();
    initAnnouncements();
    displayAnnouncements();
    displayBooks();
    displayConcerns();
    displayWallPosts();
    console.log("VMC Nexus System Loaded Successfully.");
});
