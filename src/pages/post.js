import { getPost, deletePost } from "../api/post.js";

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
    wrapper.style.padding = "1rem";
    wrapper.style.border = "1px solid #263041";
    wrapper.style.borderRadius = "12px";
    wrapper.style.background = "#131720";

    const title = document.createElement("h2");
    title.textContent = post.title || "(untitled)";
    const body = document.createElement("p");
    body.textContent = post.body || "";

    wrapper.append(title, body);

    if (post.media?.[0]?.url) {
        const img = document.createElement("img");
        img.src = post.media[0].url;
        img.alt = post.media[0].alt || "";
        img.style.width = "100%";
        img.style.marginTop = "1rem";
        wrapper.append(img);
    }

    const by = document.createElement("small");
    by.textContent = `by ${post.author?.name ?? "unknown"}`;
    wrapper.append(by);

    if (postEl) {
        postEl.innerHTML = "";
        postEl.append(wrapper);
    }
}
