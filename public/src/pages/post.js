import { getPost} from "../api/post.js";

const msgEl = document.querySelector("#msg");
const postEl = document.querySelector("#post");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    if (msgEl) msgEl.textContent = "No post ID provided in the URL.";
} else {
    loadPost(id);
}

async function loadPost(id) {
    if (msgEl) msgEl.textContent = "Loading post…";
    try {
        const res = await getPost(id);
        const post = res?.data ?? res;
        if (msgEl) msgEl.textContent = "";
        renderPost(post);
    } catch (e) {
        console.error(e);
        if (msgEl) msgEl.textContent = e?.message || "Could not load post.";
    }
}

function renderPost(post) {
    if (!post) {
        if (postEl) postEl.textContent = "Post not found.";
        return;
    }

    const wrapper = document.createElement("article");
    wrapper.className = "bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-md";

    const title = document.createElement("h2");
    title.textContent = post.title || "(untitled)";
    title.className = "text-2xl font-bold text-indigo-400";

    const body = document.createElement("p");
    body.textContent = post.body || "";
    body.className = "text-gray-300 mt-2";

    wrapper.append(title, body);

    if (post.media?.url) {
        const img = document.createElement("img");
        img.src = post.media.url;
        img.alt = post.media.alt || "";
        img.className = "w-full rounded-lg mt-4";
        wrapper.append(img);
    }

    const by = document.createElement("small");
    const author = post.author?.name;
    by.innerHTML = author
    ? `by <a href="./profile.html?name=${encodeURIComponent(author)}">${author}</a>`
    : "by unknown";
    by.className = "block mt-4 text-sm text-gray-400";
    wrapper.append(by);

    if (postEl) {
        postEl.innerHTML = "";
        postEl.append(wrapper);
    }
}
