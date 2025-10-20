import { BASE_API_URL } from "../config.js";
import { http } from "./http.js";

const POSTS_BASE = `${BASE_API_URL}/social/posts`;

/**
 * Get posts (optionally filtered by query). Adjust limit as you like.
 */
export function listPosts({ query = "", limit = 30, offset = 0 } = {}) {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (query) sp.set("q", query);
    return http(`${POSTS_BASE}?${sp.toString()}`);
}

/**
 * Create a post. Media is optional (array of { url, alt? }).
 */
export function createPost({ title, body, media = [] }) {
    return http(POSTS_BASE, {
        method: "POST",
        body: JSON.stringify({ title, body, media }),
    });
}

/**
 * Delete a post by id (we'll show the button later for your own posts).
 */
export function deletePost(id) {
    return http(`${POSTS_BASE}/${id}`, { method: "DELETE" });
}
