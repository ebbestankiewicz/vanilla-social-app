import { addToLocalStorage } from "../utils/storage.js";
import { AUTH_LOGIN_URL, STORAGE_KEYS } from "../config.js";
import { http } from "../api/http.js";

const loginForm = document.querySelector("#login-form");
const msg = document.querySelector("#msg");

async function loginUser(userDetails) {
    const res = await http(AUTH_LOGIN_URL, {
        method: "POST",
        body: JSON.stringify(userDetails),
    });
    return res?.data?.accessToken || res?.accessToken || res?.access_token;
}

async function onLoginFormSubmit(event) {
    event.preventDefault();
    if (msg) msg.textContent = "";
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    try {
        const token = await loginUser(formFields);
        if (!token) throw new Error("No access token returned.");
        addToLocalStorage(STORAGE_KEYS.token, token);
        window.location.href = "./feed.html";
    } catch (e) {
        if (msg) msg.textContent = e.message || "Login failed";
        console.error(e);
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", onLoginFormSubmit);
} else {
    console.warn("Login form not found in DOM");
}
