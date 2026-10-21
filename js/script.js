/* ========================================
   VMC NEXUS JAVASCRIPT (FIXED)
======================================== */

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

    /* EMAIL FORMAT VALIDATION (@vmc.com) */
    if (!email.includes("@vmc.com")) {
        if (message) {
            message.style.color = "#f44336";
            message.innerHTML = "Email must end with @vmc.com (e.g., bhet@vmc.com)";
        }
        return false;
    }

    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];

    /* CHECK IF USER ALREADY EXISTS */
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        if (message) {
            message.style.color = "#f44336";
            message.innerHTML = "An account with this email already exists!";
        }
        return false;
    }

    /* SAVE NEW USER TO LOCAL STORAGE */
    const newUser = { name: name, email: email, password: password };
    users.push(newUser);
    localStorage.setItem("vmcRegisteredUsers", JSON.stringify(users));

    /* SET LOGGED-IN SESSION */
    localStorage.setItem("vmcUser", name);

    if (message) {
        message.style.color = "#4caf50";
        message.innerHTML = "Registration successful! Redirecting...";
    }

    /* REDIRECT TO HOME PAGE */
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
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

    /* EMAIL FORMAT VALIDATION (@vmc.com) */
    if (!email.includes("@vmc.com")) {
        if (message) {
            message.style.color = "#f44336";
            message.innerHTML = "Email must contain @vmc.com (e.g., bhet@vmc.com)";
        }
        return false;
    }

    /* DEFAULT ADMIN ACCOUNT */
    if (email === "admin@vmc.com" && password === "admin123") {
        localStorage.setItem("vmcUser", "Administrator");
        window.location.href = "index.html";
        return false;
    }

    /* CHECK REGISTERED ACCOUNTS IN LOCALSTORAGE */
    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
        localStorage.setItem("vmcUser", foundUser.name);
        window.location.href = "index.html";
        return false;
    }

    /* DEFAULT STUDENT ACCOUNT OR REGISTERED FALLBACK */
    if (password.length > 0) {
        const userName = email.split("@")[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        localStorage.setItem("vmcUser", formattedName);
        window.location.href = "index.html";
        return false;
    }

    /* INVALID CREDENTIALS */
    if (message) {
        message.style.color = "#f44336";
        message.innerHTML = "Invalid email or password.";
    }
    return false;
}

/* SHOW / HIDE PASSWORD - LOGIN */
function showPassword() {
    const password = document.getElementById("password");
    const button = document.getElementById("showButton");
    if (!password || !button) return;

    if (password.type === "password") {
        password.type = "text";
        button.innerHTML = "HIDE";
    } else {
        password.type = "password";
        button.innerHTML = "SHOW";
    }
}

/* SHOW / HIDE PASSWORD - REGISTER */
function showRegPassword() {
    const password = document.getElementById("regPassword");
    const button = document.getElementById("regShowButton");
    if (!password || !button) return;

    if (password.type === "password") {
        password.type = "text";
        button.innerHTML = "HIDE";
    } else {
        password.type = "password";
        button.innerHTML = "SHOW";
    }
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("vmcUser");
    window.location.href = "index.html";
}

/* CHECK AUTH STATUS & UPDATE NAVBAR ONLY */
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

/* SUBMIT CONCERN */
function submitConcern(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById("studentName");
    const categoryInput = document.getElementById("category");
    const subjectInput = document.getElementById("concernSubject");
    const messageInput = document.getElementById("concernMessage");

    if (!nameInput || !categoryInput || !subjectInput || !messageInput) return false;

    const concern = {
        name: nameInput.value,
        category: categoryInput.value,
        subject: subjectInput.value,
        message: messageInput.value,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
    concerns.push(concern);
    localStorage.setItem("concerns", JSON.stringify(concerns));

    alert("Your concern has been submitted successfully!");
    event.target.reset();

    const user = localStorage.getItem("vmcUser");
    if (user && nameInput) nameInput.value = user;

    displayConcerns();
    return false;
}

/* DISPLAY CONCERNS */
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
        item.className = "concern-item";
        item.style.marginBottom = "15px";
        item.style.padding = "15px";
        item.style.background = "#030914";
        item.style.border = "1px solid #1e293b";
        item.style.borderRadius = "8px";

        item.innerHTML = `
            <h3 style="color:#4da3ff; margin-bottom:5px;">${escapeHtml(concern.subject)}</h3>
            <p><strong>Student:</strong> ${escapeHtml(concern.name)}</p>
            <p><strong>Category:</strong> ${escapeHtml(concern.category)}</p>
            <p style="margin: 8px 0; word-break: break-word;">${escapeHtml(concern.message)}</p>
            <span class="status" style="color:#f39c12; font-weight:600;">Status: ${escapeHtml(concern.status)}</span>
            <p><small style="color:#64748b;">${escapeHtml(concern.date)}</small></p>
        `;
        list.appendChild(item);
    });
}

/* FREEDOM WALL POST */
function postMessage(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById("wallName");
    const messageInput = document.getElementById("wallMessage");

    if (!nameInput || !messageInput) return false;

    const post = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date().toLocaleString()
    };

    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
    posts.unshift(post);
    localStorage.setItem("wallPosts", JSON.stringify(posts));

    alert("Your message has been posted!");
    event.target.reset();

    const user = localStorage.getItem("vmcUser");
    if (user && nameInput) nameInput.value = user;

    displayWallPosts();
    return false;
}

/* DISPLAY WALL POSTS */
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

/* LIBRARY SEARCH */
function searchBooks() {
    const searchInput = document.getElementById("bookSearch");
    if (!searchInput) return;

    const search = searchInput.value.toLowerCase();
    const books = document.querySelectorAll(".book-card");

    books.forEach(function (book) {
        const title = book.innerText.toLowerCase();
        if (title.includes(search)) {
            book.style.display = "block";
        } else {
            book.style.display = "none";
        }
    });
}

/* SCHOLARSHIP DIALOG */
function showScholarship(name) {
    alert(
        name +
        "\n\nPlease contact the school administration for requirements, application dates, and complete scholarship information."
    );
}

/* HELPER TO PREVENT HTML INJECTION */
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* PAGE LOAD */
document.addEventListener("DOMContentLoaded", function () {
    checkUserAuth();
    displayConcerns();
    displayWallPosts();
    console.log("VMC Nexus successfully loaded.");
});
