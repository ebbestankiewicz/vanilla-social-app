import { BASE_API_URL } from "../config.js";
import { http } from "./http.js";

const PROFILES_BASE = `${BASE_API_URL}/social/profiles`;

/** Get profile by name */
export function getProfile(name, { posts = false, followers = false, following = false } = {}) {
    const sp = new URLSearchParams();
    if (posts) sp.set("_posts", "true");
    if (followers) sp.set("_followers", "true");
    if (following) sp.set("_following", "true");
    const qs = sp.toString();
    return http(`${PROFILES_BASE}/${encodeURIComponent(name)}${qs ? `?${qs}` : ""}`);
}

/** Get posts by a profile */
export function getProfilePosts(name, { limit = 30, offset = 0 } = {}) {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset), _author: "true" });
    return http(`${PROFILES_BASE}/${encodeURIComponent(name)}/posts?${sp.toString()}`);
}

/** Follow profile */
export function followProfile(name) {
    return http(`${PROFILES_BASE}/${encodeURIComponent(name)}/follow`, { method: "PUT" });
}

/** Unfollow profile */
export function unfollowProfile(name) {
    return http(`${PROFILES_BASE}/${encodeURIComponent(name)}/unfollow`, { method: "PUT" });
}