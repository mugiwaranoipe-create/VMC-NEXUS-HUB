/* ========================================
   VMC NEXUS JAVASCRIPT
======================================== */

/* LOGIN */
function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("login-message");

    /* STUDENT ACCOUNT */
    if (email === "student@vmc.com" && password === "12345") {
        localStorage.setItem("vmcUser", "Student");
        message.style.color = "#4caf50";
        message.innerHTML = "Login successful! Redirecting...";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);

        return;
    }

    /* ADMIN ACCOUNT */
    if (email === "admin@vmc.com" && password === "admin123") {
        localStorage.setItem("vmcUser", "Administrator");
        message.style.color = "#4caf50";
        message.innerHTML = "Admin login successful! Redirecting...";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);

        return;
    }

    /* WRONG LOGIN */
    message.style.color = "#f44336";
    message.innerHTML = "Invalid email or password.";
}

/* SHOW / HIDE PASSWORD */
function showPassword() {
    const password = document.getElementById("password");
    const button = document.getElementById("showButton");

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

/* SUBMIT CONCERN */
function submitConcern(event) {
    event.preventDefault();

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
    displayConcerns();
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
    event.preventDefault();

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
    displayWallPosts();
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

/* CHECK AUTH STATUS & UPDATE NAVBAR */
function checkUserAuth() {
    const nav = document.querySelector(".navbar nav");
    const user = localStorage.getItem("vmcUser");

    if (nav && user) {
        const authBtn = nav.querySelector(".login-btn");
        if (authBtn) {
            authBtn.outerHTML = `<button onclick="logout()" class="logout-btn">Logout (${user})</button>`;
        }
    }
}

/* PAGE LOAD */
document.addEventListener("DOMContentLoaded", function () {
    displayConcerns();
    displayWallPosts();
    checkUserAuth();
    console.log("VMC Nexus successfully loaded.");
});
