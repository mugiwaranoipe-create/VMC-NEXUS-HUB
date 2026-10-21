/* ========================================
   VMC NEXUS JAVASCRIPT
======================================== */

// Default sample announcements
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

// Initialize announcements in localStorage if empty
function initAnnouncements() {
    let stored = localStorage.getItem("vmcAnnouncements");
    if (!stored) {
        localStorage.setItem("vmcAnnouncements", JSON.stringify(defaultAnnouncements));
    }
}

/* RENDER ANNOUNCEMENTS */
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
        card.onclick = function () { openAnnouncementModal(index); };

        card.innerHTML = `
            <small>${escapeHtml(item.date)}</small>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.content.length > 120 ? item.content.substring(0, 120) + "..." : item.content)}</p>
            <span style="color: #4da3ff; font-size: 13px; font-weight: 600; display: inline-block; margin-top: 10px;">Click to view details →</span>
        `;
        container.appendChild(card);
    });
}

/* MODAL HANDLERS FOR ANNOUNCEMENTS */
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

/* UTILITY: SANITIZE HTML */
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* AUTH & USER SESSION */
function checkUserAuth() {
    const user = localStorage.getItem("vmcUser");
    if (user) {
        const navLoginBtn = document.querySelector(".navbar nav .login-btn");
        if (navLoginBtn) {
            navLoginBtn.outerHTML = `<button onclick="logout()" class="logout-btn">Logout</button>`;
        }
        const studentName = document.getElementById("studentName");
        if (studentName) studentName.value = user;
        const wallName = document.getElementById("wallName");
        if (wallName) wallName.value = user;
    }
}

function logout() {
    localStorage.removeItem("vmcUser");
    window.location.href = "index.html";
}

/* CONCERNS FORM */
function submitConcern(event) {
    if (event) event.preventDefault();
    const concern = {
        name: document.getElementById("studentName").value,
        category: document.getElementById("category").value,
        subject: document.getElementById("concernSubject").value,
        message: document.getElementById("concernMessage").value,
        status: "Pending",
        date: new Date().toLocaleString()
    };
    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
    concerns.push(concern);
    localStorage.setItem("concerns", JSON.stringify(concerns));
    alert("Concern submitted!");
    event.target.reset();
    displayConcerns();
    return false;
}

function displayConcerns() {
    const list = document.getElementById("concernList");
    if (!list) return;
    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
    if (concerns.length === 0) { list.innerHTML = "<p>No concerns submitted yet.</p>"; return; }
    list.innerHTML = "";
    concerns.forEach(c => {
        const div = document.createElement("div");
        div.style.cssText = "background:#030914; border:1px solid #1e293b; padding:15px; border-radius:8px; margin-bottom:12px;";
        div.innerHTML = `<h3 style="color:#4da3ff">${escapeHtml(c.subject)}</h3><p>Category: ${escapeHtml(c.category)}</p><p>${escapeHtml(c.message)}</p><small style="color:#64748b">${escapeHtml(c.date)}</small>`;
        list.appendChild(div);
    });
}

/* FREEDOM WALL FORM */
function postMessage(event) {
    if (event) event.preventDefault();
    const post = {
        name: document.getElementById("wallName").value,
        message: document.getElementById("wallMessage").value,
        date: new Date().toLocaleString()
    };
    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
    posts.unshift(post);
    localStorage.setItem("wallPosts", JSON.stringify(posts));
    alert("Message posted!");
    event.target.reset();
    displayWallPosts();
    return false;
}

function displayWallPosts() {
    const container = document.getElementById("wallPosts");
    if (!container) return;
    let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
    if (posts.length === 0) { container.innerHTML = "<p>No messages yet.</p>"; return; }
    container.innerHTML = "";
    posts.forEach(p => {
        const div = document.createElement("div");
        div.className = "wall-post";
        div.innerHTML = `<h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.message)}</p><small>${escapeHtml(p.date)}</small>`;
        container.appendChild(div);
    });
}

/* INITIALIZE ON PAGE LOAD */
document.addEventListener("DOMContentLoaded", function () {
    initAnnouncements();
    checkUserAuth();
    displayAnnouncements();
    displayConcerns();
    displayWallPosts();
});
