/**
 * Save a value to localstorage.
 * @param {string} key 
 * @param {any} value 
 */
export function addToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Get a value from localStorage.
 * @param {string} key
 * @returns {any|null}
 */
export function getFromLocalStorage(key) {
    return localStorage.getItem(key);
}