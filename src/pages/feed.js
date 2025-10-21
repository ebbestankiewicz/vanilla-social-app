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
const createForm = document.querySelector("#create-form");

function postCard(post) {
    const wrapper = document.createElement("article");
    wrapper.style.padding = "1rem";
    wrapper.style.border = "1px solid #263041";
    wrapper.style.borderRadius = "12px";
    wrapper.style.marginBottom = "12px";
    wrapper.style.background = "#131720";

    const title = document.createElement("h3");
    title.textContent = post.title || "(untitled)";
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
    location.href = `./post.html?id=${post.id}`;
});

    const body = document.createElement("p");
    body.textContent = post.body || "";

    wrapper.append(title, body);

    const mediaUrl = post.media?.[0]?.url;
    if (mediaUrl) {
        const img = document.createElement("img");
        img.src = mediaUrl;
        img.alt = post.media?.[0]?.alt || "";
        img.style.width = "100%";
        img.style.borderRadius = "10px";
        img.style.marginTop = "8px";
        wrapper.append(img);
    }

    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.gap = "8px";
    footer.style.alignItems = "center";
    footer.style.marginTop = "8px";

    const by = document.createElement("small");
    by.textContent = `by ${post.author?.name ?? "unknown"}`;
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
    editForm.style.display = "none";
    editForm.style.marginTop = "10px";
    editForm.style.display = "none";
    editForm.style.gap = "8px";
    editForm.style.gridTemplateColumns = "1fr";

    const titleInput = document.createElement("input");
    titleInput.name = "title";
    titleInput.value = post.title || "";

    const bodyInput = document.createElement("textarea");
    bodyInput.name = "body";
    bodyInput.value = post.body || "";

    const mediaInput = document.createElement("input");
    mediaInput.name = "mediaUrl";
    mediaInput.placeholder = "Image URL";
    mediaInput.value = post.media?.[0]?.url || "";

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
        if (!confirm("Delete this post?")) return;
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
        const posts = res?.data ?? [];
        feedEl.innerHTML = "";
        if (!posts.length) {
            feedEl.textContent = "No posts found.";
            return;
        }
        posts.forEach((p) => feedEl.append(postCard(p)));
    } catch (e) {
        feedEl.innerHTML = "";
        msgEl.textContent = e?.message || "Failed to load feed.";
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        loadFeed(searchInput?.value?.trim() ?? "");
    });
}

if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            loadFeed(searchInput.value.trim());
        }
    });
}

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
            const media = mediaUrl ? [{ url: mediaUrl }] : undefined;

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

loadFeed();