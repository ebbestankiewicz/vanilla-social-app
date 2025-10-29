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