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
}

async function onLoginFormSubmit(event) {
    event.preventDefault();
    if (msg) msg.textContent = "";
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    try {
        const res = await loginUser(formFields);

        const token =
        res?.data?.accessToken ??
        res?.accessToken ??
        res?.access_token ??
        null;

        const name =
        res?.data?.name ??
        res?.name ??
        "";
        const email =
        res?.data?.email ??
        res?.email ??
        "";

        if (!token) {
        console.error("[login] No token in response:", res);
        throw new Error("No access token returned.");
        }

        addToLocalStorage(STORAGE_KEYS.token, token);
        if (name) addToLocalStorage(STORAGE_KEYS.userName, name);

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

