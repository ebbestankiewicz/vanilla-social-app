import { NOROFF_API_KEY } from "../config.js";

/**
 * Tiny fetch wrapper: JSON headers + optional API key.
 * If we later add a token, we can set it here as well.
 * @param {RequestInfo} url
 * @param {RequestInit} [opts]
 * @returns {Promise<any>}
 */
export async function http(url, opts = {}) {
    const headers = new Headers({
        "Content-Type": "application/json",
        ...opts.headers,
    });

    if (NOROFF_API_KEY) headers.set("X-Noroff-API-Key", NOROFF_API_KEY);

    const res = await fetch(url, { ...opts, headers });
    const isJSON = res.headers.get("Content-Type")?.includes("application/json");
    const body = isJSON ? await res.json() : await res.text();

    if (!res.ok) {
        const message = body?.errors?.[0]?.message || body?.message || res.statusText;
        throw new Error(message);
    }
    return body;
}
