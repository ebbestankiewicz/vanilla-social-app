import { getFromLocalStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";
import { listPosts, createPost, updatePost, deletePost } from "../api/post.js";

const token = getFromLocalStorage(STORAGE_KEYS.token);
if (!token) {
    location.href = "./login.html";
}

const currentUserName = (getFromLocalStorage("currentUserName") || "").toLowerCase();

const feedEl = document.querySelector("#feed");
const msgEl = document.querySelector("#msg");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const clearSearchBtn = document.querySelector("#clearSearchBtn");
const searchStatus = document.querySelector("#searchStatus");
const createForm = document.querySelector("#create-form");

function postCard(post) {
    const wrapper = document.createElement("article");
    wrapper.className ="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition";

    const title = document.createElement("h3");
    title.textContent = post.title || "(untitled)";
    title.className = "text-lg font-semibold text-indigo-400 cursor-pointer hover:underline";
    title.addEventListener("click", () => {
    location.href = `./post.html?id=${post.id}`;
});

    const body = document.createElement("p");
    body.textContent = post.body || "";

    wrapper.append(title, body);

    const mediaUrl = post.media?.url;
    if (mediaUrl) {
        const img = document.createElement("img");
        img.src = mediaUrl;
        img.alt = post.media?.alt || "";
        img.className = "w-full rounded-xl mt-3";
        wrapper.append(img);
    }

    const footer = document.createElement("div");
    footer.className = "flex items-center gap-3 mt-4";

    const by = document.createElement("small");
    const author = post.author?.name;

    if (author) {
        by.innerHTML = `by <a class="text-indigo-400 hover:underline" href="./profile.html?name=${encodeURIComponent(author)}">${author}</a>`;
    } else {
        by.textContent = "by unknown";
    }
footer.append(by);

const authorName = (post.author?.name || "").toLowerCase();
const isMine = !!authorName && !!currentUserName && authorName === currentUserName;

if (isMine) {
    const spacer = document.createElement("div");
    spacer.style.flex = "1";
    footer.append(spacer);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";

    footer.append(editBtn, delBtn);

    const editForm = document.createElement("form");
    editForm.className ="hidden mt-3 grid gap-2 grid-cols-1 bg-gray-800 p-3 rounded-xl";

    const titleInput = document.createElement("input");
    titleInput.name = "title";
    titleInput.value = post.title || "";

    const bodyInput = document.createElement("textarea");
    bodyInput.name = "body";
    bodyInput.value = post.body || "";

    const mediaInput = document.createElement("input");
    mediaInput.name = "mediaUrl";
    mediaInput.placeholder = "Image URL";
    mediaInput.value = post.media?.url || "";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";

    editForm.append(titleInput, bodyInput, mediaInput, saveBtn, cancelBtn);
    wrapper.append(editForm);

    editBtn.addEventListener("click", () => {
        editForm.style.display = editForm.style.display === "none" ? "grid" : "none";
    });

    cancelBtn.addEventListener("click", () => {
        editForm.style.display = "none";
    });

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const newTitle = titleInput.value.trim() || undefined;
            const newBody = bodyInput.value.trim() || undefined;
            const newMediaUrl = mediaInput.value.trim();
            const media = newMediaUrl ? { url: newMediaUrl } : undefined;

            await updatePost(post.id, { title: newTitle, body: newBody, media });
            await loadFeed(searchInput?.value?.trim() ?? "");
            msgEl.textContent = "Post updated";
            setTimeout(() => (msgEl.textContent = ""), 1500);
        } catch (err) {
            alert(err.message || "Failed to update post");
        }
    });

    delBtn.addEventListener("click", async () => {
        try {
            await deletePost(post.id);
            await loadFeed(searchInput?.value?.trim() ?? "");
            msgEl.textContent = "Post deleted 🗑️";
            setTimeout(() => (msgEl.textContent = ""), 1500);
        } catch (err) {
            alert(err.message || "Failed to delete post");
        }
    });
}

    wrapper.append(footer);
    return wrapper;
}

async function loadFeed(q = "") {
    if (!feedEl || !msgEl) return;
    msgEl.textContent = "";
    feedEl.innerHTML = "Loading…";
    try {
        const res = await listPosts({ query: q, limit: 30 });
        let posts = res?.data ?? [];

        const needle = (q || "").trim().toLowerCase();
        if (needle) {
        posts = posts.filter((p) => {
            const title = (p.title || "").toLowerCase();
            const body = (p.body || "").toLowerCase();
            const tags = Array.isArray(p.tags) ? p.tags.map(String).join(" ").toLowerCase() : "";
            const author = (p.author?.name || "").toLowerCase();
            return (
            title.includes(needle) ||
            body.includes(needle) ||
            tags.includes(needle) ||
            author.includes(needle)
            );
        });
        }

        feedEl.innerHTML = "";
        if (!posts.length) {
        feedEl.textContent = needle ? `No posts found for “${q}”.` : "No posts found.";
        return;
        }
        posts.forEach((p) => feedEl.append(postCard(p)));
    } catch (e) {
        feedEl.innerHTML = "";
        msgEl.textContent = e?.message || "Failed to load feed.";
    }
}


function debounce(fn, ms = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
    }

    let inFlight = null;

    async function performSearch(q) {
    if (inFlight) inFlight.abort?.();

    inFlight = new AbortController();
    const signal = inFlight.signal;

    try {
        if (searchStatus) searchStatus.textContent = q ? `Searching “${q}”…` : "";
        await loadFeed(q);
        if (signal.aborted) return;
        if (searchStatus) {
        const trimmed = (q || "").trim();
        searchStatus.textContent = trimmed ? `Results for “${trimmed}”` : "";
        }
    } catch (e) {
        if (signal.aborted) return;
        if (searchStatus) searchStatus.textContent = e?.message || "Search failed";
    }
}
const debouncedSearch = debounce((q) => performSearch(q), 350);

// Search button
searchBtn?.addEventListener("click", () => {
    const q = searchInput?.value?.trim() ?? "";
    performSearch(q);
});

// Live search input
searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim();
    debouncedSearch(q);
});

// Enter key to search
searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    }
    // Escape key to clear
    if (e.key === "Escape") {
        searchInput.value = "";
        performSearch("");
    }
});

// Clear search button
clearSearchBtn?.addEventListener("click", () => {
    searchInput.value = "";
    performSearch("");
});


if (createForm) {
    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!msgEl) return;
        msgEl.textContent = "";
        try {
            const fd = new FormData(createForm);
            const title = String(fd.get("title") || "").trim();
            const body = String(fd.get("body") || "").trim() || undefined;
            const mediaUrl = String(fd.get("mediaUrl") || "").trim();
            const media = mediaUrl ? { url: mediaUrl } : undefined;

            if (!title) throw new Error("Title is required.");

            await createPost({ title, body, media });
            createForm.reset();
            await loadFeed(searchInput?.value?.trim() ?? "");
            msgEl.textContent = "Post created";
        } catch (e) {
            msgEl.textContent = e?.message || "Failed to create post.";
        }
    });
}

// Logout button
const logoutBtn = document.querySelector("#logoutBtn");

function isLoggedIn() {
    const token = getFromLocalStorage(STORAGE_KEYS.token);
    return !!token;
}

if (logoutBtn) {
    if (!isLoggedIn()) {
        logoutBtn.style.display = "none";
    } else {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.userName);
        localStorage.removeItem(STORAGE_KEYS.profile);
        location.href = "./login.html";
        });
    }
}

loadFeed();


const myProfileLink = document.getElementById("myProfileLink");
if (myProfileLink) {
    const userName = getFromLocalStorage(STORAGE_KEYS.userName);
    if (userName) {
        myProfileLink.href = `./profile.html?name=${encodeURIComponent(userName)}`;
    } else {
        myProfileLink.href = "./login.html";
    }
}