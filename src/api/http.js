import { NOROFF_API_KEY, STORAGE_KEYS } from "../config.js";
import { getFromLocalStorage } from "../utils/storage.js";

/**
 * Simple HTTP wrapper for the Noroff API.
 * Automatically handles JSON and headers.
 * @param {string} url - Request URL.
 * @param {RequestInit} options - Fetch options.
 * @returns {Promise<Object>} Parsed JSON response.
 */
export async function http(url, opts = {}) {
    const headers = new Headers({
        "Content-Type": "application/json",
        ...opts.headers,
    });

    if (NOROFF_API_KEY) headers.set("X-Noroff-API-Key", NOROFF_API_KEY);

    const token = getFromLocalStorage(STORAGE_KEYS.token);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(url, { ...opts, headers });
    const isJSON = res.headers.get("Content-Type")?.includes("application/json");
    const body = isJSON ? await res.json() : await res.text();

    if (!res.ok) {
        const message = body?.errors?.message || body?.message || res.statusText;
        throw new Error(message);
    }
    return body;
}

