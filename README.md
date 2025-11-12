CODEL Social App

A small social media web app built with vanilla JavaScript (ES6 modules), TailwindCSS, and the Noroff Social API v2.
Users can register, log in, create, update, delete, and search posts; view profiles; and follow/unfollow.

Live Demo
URL:

Features

Auth (JWT): Register & login; token stored in localStorage

Posts (CRUD): Create, read, update, delete your own posts

Search: Live, debounced search by title/body/tags/author

Profiles: View profiles, see user posts, follow/unfollow

Media: Optional image URL per post

UI: TailwindCSS dark theme


How to Run Locally

Clone the repo

git clone https://github.com/ebbestankiewicz/vanilla-social-app.git
cd vanilla-social-app


Open with a local server (so ES modules load correctly)

Easiest: install the VS Code Live Server extension, then right-click public/index.html → “Open with Live Server”

Or run any static HTTP server from the public/ folder.

Register or Login

Use your @stud.noroff.no email to register


Tech Stack

HTML5

CSS3 + TailwindCSS

JavaScript (ES6 Modules)

Noroff Social API v2

LocalStorage (for auth token & profile)


Author

Ebbe Stankiewicz
ebbe2002@me.com
https://github.com/ebbestankiewicz
