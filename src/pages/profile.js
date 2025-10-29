import { getFromLocalStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";
import { getProfile, getProfilePosts, followProfile, unfollowProfile } from "../api/profiles.js";