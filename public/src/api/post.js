import { BASE_API_URL } from "../config.js";
import { http } from "./http.js";
import { POSTS_URL } from "../config.js"

/**
 * Fetch a list of posts
 * @param {Object} options
 * @param {string} [options.query] - Search query.
 * @param {number} [options.limit=30] - Number of posts to return.
 * @param {number} [options.offset=0] - Offset for pagination.
 * @returns {Promise<any>} List of posts.
 */
export function listPosts({ query = "", limit = 30, offset = 0 } = {}) {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset), _author: "true" });
    if (query) sp.set("q", query);
    return http(`${POSTS_URL}?${sp.toString()}`);
}

/**
 * Create new post.
 * @param {Object} data
 * @param {string} data.title - Post title.
 * @param {string} data.body - Post body.
 * @param {string} [data.media] - Optional media URL.
 * @returns {Promise<any>} Created post.
 */
export function createPost({ title, body, media }) {
    const payload = { title, body };
    if (media !== undefined) payload.media = media;
    return http(`${BASE_API_URL}/social/posts`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete a post by id.
 * @param {string} id - Post ID.
 * @returns {Promise<any>} The API delete result.
 */
export function deletePost(id) {
    return http(`${POSTS_URL}/${id}`, { method: "DELETE" });
}

/**
 * Get a single post by ID.
 * @param {string} id - Post ID.
 * @returns {Promise<any>} The post data.
 */
export function getPost(id) {
    const sp = new URLSearchParams({ _author: "true" });
    return http(`${POSTS_URL}/${id}?${sp.toString()}`);
}

/**
 * Update a post by ID.
 * @param {string} id - Post ID.
 * @param {Object} data
 * @param {string} [data.title] - New title.
 * @param {string} [data.body] - New body.
 * @param {Object} [data.media] - New media object.
 * @returns {Promise<any>} The updated post data.
 */
export function updatePost(id, { title, body, media }) {
    const payload = { title, body };
    if (media !== undefined) payload.media = media;
    return http(`${BASE_API_URL}/social/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
