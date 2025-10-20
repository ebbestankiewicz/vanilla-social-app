import { BASE_API_URL } from "../config.js";
import { http } from "./http.js";

const POSTS_BASE = `${BASE_API_URL}/social/posts`;

/**
 * Get posts (optionally filtered by query)
 */
export function listPosts({ query = "", limit = 30, offset = 0 } = {}) {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (query) sp.set("q", query);
    return http(`${POSTS_BASE}?${sp.toString()}`);
}

/**
 * Create a post.
 */
export function createPost({ title, body, media = [] }) {
    return http(POSTS_BASE, {
        method: "POST",
        body: JSON.stringify({ title, body, media }),
    });
}

/**
 * Delete a post by id.
 */
export function deletePost(id) {
    return http(`${POSTS_BASE}/${id}`, { method: "DELETE" });
}

/**
 * Get a single post by ID.
 */
export function getPost(id) {
    return http(`${POSTS_BASE}/${id}`);
}

/**
 * Update a post by ID.
 */
export function updatePost(id, data) {
    return http(`${POSTS_BASE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
