/* =========================
   VMC NEXUS LOGIN JAVASCRIPT
   ========================= */


/* =========================
   SHOW / HIDE PASSWORD
   ========================= */

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


/* =========================
   LOGIN FORM
   ========================= */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    /* CHECK EMPTY FIELDS */

    if (email === "" || password === "") {

        alert("Please enter your email and password.");

        return;

    }


    /* SIMPLE EMAIL CHECK */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;

    }


    /*
       TEMPORARY LOGIN

       This is only for the HTML version.
       PHP + MySQL will handle the real login.
    */

    alert(
        "Login successful!\n\n" +
        "Welcome to VMC Nexus."
    );


    /*
       Example dashboard redirect:

       window.location.href =
       "student/dashboard.html";
    */

}


/* =========================
   PAGE LOAD
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "VMC Nexus Login System Loaded."
        );

    }
);
```
