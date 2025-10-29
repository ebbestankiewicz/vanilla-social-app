import { getFromLocalStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";
import { getProfile, getProfilePosts, followProfile, unfollowProfile } from "../api/profiles.js";

// --- Auth guard
const token = getFromLocalStorage(STORAGE_KEYS.token);
if (!token) location.href = "./login.html";


// --- DOM elements
const profileTitle = document.getElementById("profileTitle");
const profileInfo = document.getElementById("profileInfo");
const avatarImg = document.getElementById("avatar");
const emailEl = document.getElementById("email");
const countsEl = document.getElementById("counts");
const followBtn = document.getElementById("followBtn");
const unfollowBtn = document.getElementById("unfollowBtn");
const postsWrap = document.getElementById("profilePosts");
const whoEl = document.getElementById("who");
const msgEl = document.getElementById("msg");


// --- Get profile name from URL or storage
const params = new URLSearchParams(location.search);
const name = (params.get("name") || getFromLocalStorage(STORAGE_KEYS.userName) || "").trim();
if (!name) {
    postsWrap.textContent = "No profile name provided.";
    throw new Error("Missing profile name");
}
whoEl.textContent = name;
profileTitle.textContent = `Profile: ${name}`;

function postCard(post) {
    const card = document.createElement("article");
    card.style.padding = "1rem";
    card.style.border = "1px solid #263041";
    card.style.borderRadius = "12px";
    card.style.marginBottom = "12px";
    card.style.background = "#131720";

    const h3 = document.createElement("h3");
    h3.textContent = post.title || "(untitled)";
    h3.style.cursor = "pointer";
    h3.addEventListener("click", () => (location.href = `./post.html?id=${post.id}`));

    const p = document.createElement("p");
    p.textContent = post.body || "";

    card.append(h3, p);

    const mediaUrl = post.media?.url;
    if (mediaUrl) {
        const img = document.createElement("img");
        img.src = mediaUrl;
        img.alt = post.media?.alt || "";
        img.style.width = "100%";
        img.style.borderRadius = "10px";
        img.style.marginTop = "8px";
        card.append(img);
    }

    return card;
}