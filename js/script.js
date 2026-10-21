/* ========================================
   VMC NEXUS JAVASCRIPT (FULL FIXED)
======================================== */

// Default sample announcements if none exist in localStorage
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

// Initialize default announcements on first load
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

/* MODAL HANDLERS FOR PUBLIC PAGE */
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

/* ADMIN: CREATE NEW ANNOUNCEMENT */
function createAnnouncement(event) {
    if (event) event.preventDefault();

    const title = document.getElementById("adminAnnTitle").value.trim();
    const date = document.getElementById("adminAnnDate").value.trim();
    const content = document.getElementById("adminAnnContent").value.trim();

    if (!title || !date || !content) return false;

    let list = JSON.parse(localStorage.getItem("vmcAnnouncements")) || [];
    list.unshift({ title: title, date: date, content: content });
    localStorage.setItem("vmcAnnouncements", JSON.stringify(list));

    alert("Announcement published successfully!");
    event.target.reset();
    loadAdminData();
    return false;
}

/* ADMIN: DELETE ANNOUNCEMENT */
function deleteAnnouncement(index) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        let list = JSON.parse(localStorage.getItem("vmcAnnouncements")) || [];
        list.splice(index, 1);
        localStorage.setItem("vmcAnnouncements", JSON.stringify(list));
        loadAdminData();
    }
}

/* ADMIN: LOAD ALL MONITORING DATA */
function loadAdminData() {
    // 1. Announcements
    const annContainer = document.getElementById("adminAnnouncementList");
    if (annContainer) {
        let list = JSON.parse(localStorage.getItem("vmcAnnouncements")) || [];
        if (list.length === 0) {
            annContainer.innerHTML = "<p style='color: #64748b;'>No announcements available.</p>";
        } else {
            annContainer.innerHTML = "";
            list.forEach((a, index) => {
                const div = document.createElement("div");
                div.style.cssText = "background: #030914; border: 1px solid #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 12px;";
                div.innerHTML = `
                    <small style="color: #64748b;">${escapeHtml(a.date)}</small>
                    <h3 style="color: #4da3ff; margin: 4px 0 8px 0; font-size: 16px;">${escapeHtml(a.title)}</h3>
                    <p style="color: #cbd5e1; font-size: 14px;">${escapeHtml(a.content)}</p>
                    <button onclick="deleteAnnouncement(${index})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 10px;">Delete Announcement</button>
                `;
                annContainer.appendChild(div);
            });
        }
    }

    // 2. Concerns
    const concernContainer = document.getElementById("adminConcernList");
    if (concernContainer) {
        let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
        if (concerns.length === 0) {
            concernContainer.innerHTML = "<p style='color: #64748b;'>No concerns submitted yet.</p>";
        } else {
            concernContainer.innerHTML = "";
            concerns.forEach((c, index) => {
                const div = document.createElement("div");
                div.style.cssText = "background: #030914; border: 1px solid #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 12px;";
                let statusColor = c.status === "Resolved" ? "#16a34a" : c.status === "In Progress" ? "#2563eb" : "#f39c12";

                div.innerHTML = `
                    <h3 style="color: #4da3ff; margin-bottom: 5px; font-size: 16px;">${escapeHtml(c.subject)}</h3>
                    <p><strong>Student:</strong> ${escapeHtml(c.name)} | <strong>Category:</strong> ${escapeHtml(c.category)}</p>
                    <p style="margin: 8px 0; color: #cbd5e1;">${escapeHtml(c.message)}</p>
                    <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 600;">${escapeHtml(c.status)}</span> | <small style="color: #64748b;">${escapeHtml(c.date)}</small></p>
                    <div style="margin-top: 10px; display: flex; gap: 8px;">
                        <button onclick="updateConcernStatus(${index}, 'In Progress')" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">In Progress</button>
                        <button onclick="updateConcernStatus(${index}, 'Resolved')" style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Resolved</button>
                        <button onclick="deleteConcern(${index})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: auto;">Delete</button>
                    </div>
                `;
                concernContainer.appendChild(div);
            });
        }
    }

    // 3. Freedom Wall Posts
    const wallContainer = document.getElementById("adminWallList");
    if (wallContainer) {
        let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
        if (posts.length === 0) {
            wallContainer.innerHTML = "<p style='color: #64748b;'>No freedom wall posts yet.</p>";
        } else {
            wallContainer.innerHTML = "";
            posts.forEach((p, index) => {
                const div = document.createElement("div");
                div.style.cssText = "background: #030914; border: 1px solid #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 12px;";
                div.innerHTML = `
                    <h3 style="color: #e2e8f0; font-size: 15px;">${escapeHtml(p.name)}</h3>
                    <p style="margin: 6px 0; color: #cbd5e1;">${escapeHtml(p.message)}</p>
                    <small style="color: #64748b;">${escapeHtml(p.date)}</small>
                    <button onclick="deletePost(${index})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; display: block; margin-top: 8px;">Remove Post</button>
                `;
                wallContainer.appendChild(div);
            });
        }
    }

    // 4. Registered Users
    const userContainer = document.getElementById("adminUserList");
    if (userContainer) {
        let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
        if (users.length === 0) {
            userContainer.innerHTML = "<p style='color: #64748b;'>No registered users yet.</p>";
        } else {
            userContainer.innerHTML = "";
            users.forEach((u) => {
                const div = document.createElement("div");
                div.style.cssText = "background: #030914; border: 1px solid #1e293b; padding: 10px 15px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between;";
                div.innerHTML = `
                    <span style="color: #e2e8f0; font-size: 14px;"><strong>${escapeHtml(u.name)}</strong></span>
                    <span style="color: #64748b; font-size: 13px;">${escapeHtml(u.email)}</span>
                `;
                userContainer.appendChild(div);
            });
        }
    }
}

/* HELPER FUNCTIONS */
function updateConcernStatus(index, newStatus) {
    let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
    if (concerns[index]) {
        concerns[index].status = newStatus;
        localStorage.setItem("concerns", JSON.stringify(concerns));
        loadAdminData();
    }
}

function deleteConcern(index) {
    if (confirm("Delete this concern?")) {
        let concerns = JSON.parse(localStorage.getItem("concerns")) || [];
        concerns.splice(index, 1);
        localStorage.setItem("concerns", JSON.stringify(concerns));
        loadAdminData();
    }
}

function deletePost(index) {
    if (confirm("Remove this post?")) {
        let posts = JSON.parse(localStorage.getItem("wallPosts")) || [];
        posts.splice(index, 1);
        localStorage.setItem("wallPosts", JSON.stringify(posts));
        loadAdminData();
    }
}

function adminLogout() {
    window.location.href = "index.html";
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* AUTH & SUBPAGE SUBMISSIONS */
function register(event) {
    if (event) event.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value.trim();
    const message = document.getElementById("register-message");

    if (!email.includes("@vmc.com")) {
        if (message) { message.style.color = "#f44336"; message.innerHTML = "Email must end with @vmc.com"; }
        return false;
    }

    let users = JSON.parse(localStorage.getItem("vmcRegisteredUsers")) || [];
    if (users.some(u => u.email === email)) {
        if (message) { message.style.color = "#f44336"; message.innerHTML = "Account already exists!"; }
        return false;
    }

    users.push({ name, email, password });
    localStorage.setItem("vmcRegisteredUsers", JSON.stringify(users));
    localStorage.setItem("vmcUser", name);
    window.location.href = "index.html";
    return false;
}

function login(event) {
    if (event) event.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

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

    localStorage.setItem("vmcUser", email.split("@")[0]);
    window.location.href = "index.html";
    return false;
}

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

/* INIT ON LOAD */
document.addEventListener("DOMContentLoaded", function () {
    initAnnouncements();
    checkUserAuth();
    displayAnnouncements();
    displayConcerns();
    displayWallPosts();
    loadAdminData();
});
