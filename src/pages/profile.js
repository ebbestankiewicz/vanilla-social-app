import { getFromLocalStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";
import { getProfile, getProfilePosts, followProfile, unfollowProfile } from "../api/profiles.js";

const token = getFromLocalStorage(STORAGE_KEYS.token);
if (!token) location.href = "./login.html";


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


const params = new URLSearchParams(location.search);
const name = (params.get("name") || getFromLocalStorage(STORAGE_KEYS.userName) || "").trim();
if (!name) {
    postsWrap.textContent = "No profile name provided.";
    throw new Error("Missing profile name");
}
whoEl.textContent = name;
profileTitle.textContent = `Profile: ${name}`;

/**
 * Create a DOM card element for a single post.
 *
 * @param {Object} post - The post object.
 * @param {number|string} post.id - Post ID.
 * @param {string} [post.title] - Post title.
 * @param {string} [post.body] - Post body text.
 * @param {Object} [post.media] - Media object, if present.
 * @param {string} post.media.url - Image URL.
 * @param {string} [post.media.alt] - Alt text.
 * @returns {HTMLElement} The rendered post card element.
 */
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

/**
 * Fetch and render profile information for the current profile page.
 *
 * Loads avatar, email, follower counts, and follow/unfollow button state.
 *
 * @returns {Promise<void>}
 */
async function loadProfile() {
    try {
        msgEl.textContent = "";
        const profRes = await getProfile(name, { posts: false, followers: true, following: true });
        const prof = profRes?.data ?? profRes;

        avatarImg.src = prof?.avatar?.url || "https://placehold.co/80x80?text=?";
        avatarImg.alt = prof?.avatar?.alt || `${name}'s avatar`;
        emailEl.textContent = prof?.email || "";
        const c = prof?._count || {};
        countsEl.textContent = `Posts: ${c.posts ?? 0} • Followers: ${c.followers ?? 0} • Following: ${c.following ?? 0}`;

        const myName = (getFromLocalStorage(STORAGE_KEYS.userName) || "").toLowerCase();
        const viewed = (name || "").toLowerCase();
        const isMine = myName && viewed && myName === viewed;

        followBtn.hidden = true;
        unfollowBtn.hidden = true;

        if (!isMine) {
        const amIFollowing = Array.isArray(prof?.followers)
            ? prof.followers.some((f) => (f?.name || "").toLowerCase() === myName)
            : false;

        if (amIFollowing) {
            unfollowBtn.hidden = false;
        } else {
            followBtn.hidden = false;
        }
        }
    } catch (err) {
        msgEl.textContent = err?.message || "Failed to load profile.";
    }
    }

    /**
 * Fetch and render all posts belonging to the current profile user.
 * @returns {Promise<void>}
 */
    async function loadPosts() {
    try {
        postsWrap.textContent = "Loading…";
        const postsRes = await getProfilePosts(name, { limit: 30, offset: 0 });
        const posts = postsRes?.data ?? [];
        postsWrap.innerHTML = "";
        if (!posts.length) {
        postsWrap.textContent = "No posts by this user.";
        return;
        }
        posts.forEach((p) => postsWrap.append(postCard(p)));
    } catch (err) {
        postsWrap.textContent = err?.message || "Failed to load posts.";
    }
    }

/**
 * Follow the currently viewed profile and refresh the header state.
 * @returns {Promise<void>}
 */
    followBtn?.addEventListener("click", async () => {
    try {
        followBtn.disabled = true;
        await followProfile(name);
        await loadProfile();
    } catch (e) {
        alert(e?.message || "Failed to follow.");
    } finally {
        followBtn.disabled = false;
    }
    });

    /**
 * Unfollow the currently viewed profile and refresh the header state.
 * @returns {Promise<void>}
 */
    unfollowBtn?.addEventListener("click", async () => {
    try {
        unfollowBtn.disabled = true;
        await unfollowProfile(name);
        await loadProfile();
    } catch (e) {
        alert(e?.message || "Failed to unfollow.");
    } finally {
        unfollowBtn.disabled = false;
    }
    });

    await loadProfile();
    await loadPosts();