/* ========================================
   VMC NEXUS JAVASCRIPT
======================================== */


/* LOGIN */

function login(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("login-message");


    /* STUDENT ACCOUNT */

    if (
        email === "student@vmc.com" &&
        password === "12345"
    ) {

        localStorage.setItem(
            "vmcUser",
            "Student"
        );

        message.style.color = "green";

        message.innerHTML =
            "Login successful! Redirecting...";

        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 1000);

        return;
    }


    /* ADMIN ACCOUNT */

    if (
        email === "admin@vmc.com" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "vmcUser",
            "Administrator"
        );

        message.style.color = "green";

        message.innerHTML =
            "Admin login successful!";

        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 1000);

        return;
    }


    /* WRONG LOGIN */

    message.style.color = "red";

    message.innerHTML =
        "Invalid email or password.";

}


/* SHOW PASSWORD */

function showPassword() {

    const password =
        document.getElementById("password");

    const button =
        document.getElementById("showButton");


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

    window.location.href =
        "index.html";

}


/* SUBMIT CONCERN */

function submitConcern(event) {

    event.preventDefault();


    const name =
        document.getElementById("studentName").value;

    const category =
        document.getElementById("category").value;

    const subject =
        document.getElementById("concernSubject").value;

    const message =
        document.getElementById("concernMessage").value;


    const concern = {

        name: name,

        category: category,

        subject: subject,

        message: message,

        status: "Pending",

        date: new Date().toLocaleString()

    };


    let concerns =
        JSON.parse(
            localStorage.getItem("concerns")
        ) || [];


    concerns.push(concern);


    localStorage.setItem(
        "concerns",
        JSON.stringify(concerns)
    );


    alert(
        "Your concern has been submitted successfully!"
    );


    event.target.reset();


    displayConcerns();

}


/* DISPLAY CONCERNS */

function displayConcerns() {

    const list =
        document.getElementById("concernList");


    if (!list) return;


    let concerns =
        JSON.parse(
            localStorage.getItem("concerns")
        ) || [];


    if (concerns.length === 0) {

        list.innerHTML =
            "<p>No concerns submitted yet.</p>";

        return;

    }


    list.innerHTML = "";


    concerns.forEach(function (concern) {

        const item =
            document.createElement("div");

        item.className =
            "concern-item";


        item.innerHTML = `

            <h3>${concern.subject}</h3>

            <p>
                <strong>Student:</strong>
                ${concern.name}
            </p>

            <p>
                <strong>Category:</strong>
                ${concern.category}
            </p>

            <p>
                ${concern.message}
            </p>

            <span class="status">
                Status: ${concern.status}
            </span>

            <p>
                <small>
                    ${concern.date}
                </small>
            </p>

        `;


        list.appendChild(item);

    });

}


/* FREEDOM WALL */

function postMessage(event) {

    event.preventDefault();


    const name =
        document.getElementById("wallName").value;

    const message =
        document.getElementById("wallMessage").value;


    const post = {

        name: name,

        message: message,

        date: new Date().toLocaleString()

    };


    let posts =
        JSON.parse(
            localStorage.getItem("wallPosts")
        ) || [];


    posts.unshift(post);


    localStorage.setItem(
        "wallPosts",
        JSON.stringify(posts)
    );


    alert("Your message has been posted!");


    event.target.reset();


    displayWallPosts();

}


/* DISPLAY WALL POSTS */

function displayWallPosts() {

    const container =
        document.getElementById("wallPosts");


    if (!container) return;


    let posts =
        JSON.parse(
            localStorage.getItem("wallPosts")
        ) || [];


    if (posts.length === 0) {

        container.innerHTML =
            "<p>No messages yet.</p>";

        return;

    }


    container.innerHTML = "";


    posts.forEach(function (post) {

        const div =
            document.createElement("div");

        div.className =
            "wall-post";


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

    const search =
        document
        .getElementById("bookSearch")
        .value
        .toLowerCase();


    const books =
        document.querySelectorAll(".book-card");


    books.forEach(function (book) {

        const title =
            book.innerText.toLowerCase();


        if (title.includes(search)) {

            book.style.display = "block";

        } else {

            book.style.display = "none";

        }

    });

}


/* SCHOLARSHIP */

function showScholarship(name) {

    alert(

        name +
        "\n\n" +
        "Please contact the school administration " +
        "for requirements, application dates, and " +
        "complete scholarship information."

    );

}


/* PAGE LOAD */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayConcerns();

        displayWallPosts();

        console.log(
            "VMC Nexus successfully loaded."
        );

    }
);
```
