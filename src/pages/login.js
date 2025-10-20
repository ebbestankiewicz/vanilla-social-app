import { addToLocalStorage } from "../utils/storage.js";
import { AUTH_LOGIN_URL } from "../config.js";
import { http } from "../api/http.js";

const loginForm = document.querySelector("#login-form");
const msg = document.querySelector("#msg");

async function loginUser(userDetails) {
    const res = await http(AUTH_LOGIN_URL, {
        method: "POST",
        body: JSON.stringify(userDetails),
    });
    return res?.data?.accessToken;
}

function onLoginFormSubmit(event) {
    event.preventDefault();
    msg.textContent = "";
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    loginUser(formFields)
        .then((token) => {
        if (!token) throw new Error("No access token returned.");
        addToLocalStorage("accessToken", token);
        location.href = "./index.html";
        })
        .catch((e) => {
        msg.textContent = e.message || "Login failed";
        });
}

loginForm.addEventListener("submit", onLoginFormSubmit);
