/* ========================================
   VMC NEXUS JAVASCRIPT
======================================== */

/* REGISTER ACCOUNT */
function register(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById("regName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const message = document.getElementById("register-message");

    if (!nameInput || !emailInput || !passwordInput) return;

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

    const userExists = users.some(u => u.email === email);
    if (userExists) {
        if (message) {
            message.style.color = "#f44336";
            message.innerHTML = "An account with this email already exists!";
        }
        return false;
    }

    const newUser = { name: name, email: email, password: password };
    users.push(newUser);
    localStorage.setItem("vmcRegisteredUsers", JSON.stringify(users));
    localStorage.setItem("vmcUser", name);

    if (message) {
        message.style.color = "#4caf50";
        message.innerHTML = "Registration successful! Redirecting...";
    }

    window.location.href = "index.html";
    return false;
}

/* LOGIN */
function login(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("login-message");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!email.includes("@vmc.com")) {
        if (message) {
            message.style.color = "#f44336";
            message.innerHTML = "Email must contain @vmc.com (e.g., bhet@vmc.com)";
        }
        return false;
    }

    if (email === "admin@vmc.com" && password === "admin123") {
        localStorage.setItem("vmcUser", "Administrator");
        window.location.href = "index.html";
        return false;
    }

    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
        localStorage.setItem("vmcUser", foundUser.name);
        window.location.href = "index.html";
        return false;
    }

    if (password === "12345" || password.length > 0) {
        const userName = email.split("@")[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        localStorage.setItem("vmcUser", formattedName);
        window.location.href = "index.html";
        return false;
    }

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

/* DISPLAY CONCERNS */
function displayConcerns() {
    const list = document.getElementById("concernList");
    if (!list) return;

    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];

    if (concerns.length === 0) {
        list.innerHTML = "<p>No concerns submitted yet.</p>";
        return;
    }

    list.innerHTML = "";
    concerns.forEach(function (concern) {
        const item = document.createElement("div");
        item.className = "concern-item";
        item.style.marginBottom = "15px";
        item.style.padding = "15px";
        item.style.background = "#081120";
        item.style.borderRadius = "8px";

        item.innerHTML = `
            <h3 style="color:#4da3ff; margin-bottom:5px;">${concern.subject}</h3>
            <p><strong>Student:</strong> ${concern.name}</p>
            <p><strong>Category:</strong> ${concern.category}</p>
            <p style="margin: 8px 0;">${concern.message}</p>
            <span class="status" style="color:#f39c12;">Status: ${concern.status}</span>
            <p><small style="color:#64748b;">${concern.date}</small></p>
        `;
        list.appendChild(item);
    });
}

/* FREEDOM WALL POST */
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

/* DISPLAY WALL POSTS */
function displayWallPosts() {
    const container = document.getElementById("wallPosts");
    if (!container) return;

    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];

    if (posts.length === 0) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    container.innerHTML = "";
    posts.forEach(function (post) {
        const div = document.createElement("div");
        div.className = "wall-post";

        div.innerHTML = `
            <h3>${post.name}</h3>
            <p>${post.message}</p>
            <small>${post.date}</small>
        `;
        container.appendChild(div);
    });
}

/* LIBRARY SEARCH */
function searchBooks() {
    const search = document.getElementById("bookSearch").value.toLowerCase();
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

/* PAGE LOAD */
document.addEventListener("DOMContentLoaded", function () {
    checkUserAuth();
    displayConcerns();
    displayWallPosts();
    console.log("VMC Nexus successfully loaded.");
});
