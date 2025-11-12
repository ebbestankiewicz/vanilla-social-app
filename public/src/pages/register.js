import { AUTH_REGISTER_URL, AUTH_LOGIN_URL } from "../config.js";
import { http } from "../api/http.js";
import { addToLocalStorage } from "../utils/storage.js";

const form = document.querySelector("#register-form");
const msg = document.querySelector("#msg");

function isNoroffStudentEmail(email) {
    return typeof email === "string" && /@stud\.noroff\.no$/i.test(email.trim());
}
function isNonEmptyUrl(u) {
    try { return u && Boolean(new URL(u)); } catch { return false; }
}

async function registerUser(dto) {
    return http(AUTH_REGISTER_URL, { method: "POST", body: JSON.stringify(dto) });
}

async function loginUser(credentials) {
    return http(AUTH_LOGIN_URL, { method: "POST", body: JSON.stringify(credentials) });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    try {
        const fd = new FormData(form);
        const name = String(fd.get("name") || "").trim();
        const email = String(fd.get("email") || "").trim();
        const password = String(fd.get("password") || "");

        if (!/^[A-Za-z0-9_]+$/.test(name)) throw new Error("Username can only contain letters, numbers, and underscore (_).");
        if (!isNoroffStudentEmail(email)) throw new Error("Email must be a valid @stud.noroff.no address.");
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");

        const dto = { name, email, password };

        const bio = String(fd.get("bio") || "").trim();
        if (bio) dto.bio = bio;

        const avatarUrl = String(fd.get("avatarUrl") || "").trim();
        const avatarAlt = String(fd.get("avatarAlt") || "").trim();
        if (isNonEmptyUrl(avatarUrl)) {
        dto.avatar = { url: avatarUrl };
        if (avatarAlt) dto.avatar.alt = avatarAlt;
        }

        const bannerUrl = String(fd.get("bannerUrl") || "").trim();
        const bannerAlt = String(fd.get("bannerAlt") || "").trim();
        if (isNonEmptyUrl(bannerUrl)) {
        dto.banner = { url: bannerUrl };
        if (bannerAlt) dto.banner.alt = bannerAlt;
        }

        await registerUser(dto);

        const loginRes = await loginUser({ email, password });
        const accessToken = loginRes?.data?.accessToken;
        if (!accessToken) throw new Error("Login failed: no access token.");
        addToLocalStorage("accessToken", accessToken);

        location.href = "./index.html";
    } catch (err) {
        msg.textContent = err.message || "Registration failed";
    }
});
