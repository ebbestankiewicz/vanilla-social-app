import { BASE_API_URL } from "../config.js";
import { http } from "./http.js";

const POSTS_BASE = `${BASE_API_URL}/social/posts`;

/**
 * Get posts (optionally filtered by query)
 */
export function listPosts({ query = "", limit = 30, offset = 0 } = {}) {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset), _author: "true" });
    if (query) sp.set("q", query);
    return http(`${POSTS_BASE}?${sp.toString()}`);
}

/**
 * Create a post.
 */
export function createPost({ title, body, media }) {
    const payload = { title, body };
    if (media) payload.media = media;
    return http(`${BASE_API_URL}/social/posts`, {
        method: "POST",
        body: JSON.stringify(payload),
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
export function updatePost(id, { title, body, media }) {
    const payload = { title, body };
    if (media !== undefined) payload.media = media; // set to {url,...} or null to clear
    return http(`${BASE_API_URL}/social/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
