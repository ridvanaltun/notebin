# Notebin

> In short, It helps you take notes, manage your notes and share your notes in ease.

![preview](/docs/preview.png "Preview")

# Table of Contents

- [Notebin](#notebin)
- [Table of Contents](#table-of-contents)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Showcase](#showcase)
- [Development](#development)

# Tech Stack

- Django
- Django REST Framework
- ReactJS
- Redux
- NextJS
- RESTful API
- JWT
- PWA
- Docker
- Docker Compose

# Features

- Create note with one click
- Create new note with any url
- Change font size in any time
- Dark mode
- Spellcheck
- Download note as PDF
- Markdown viewer
- Code viewer (JavaScript, PHP, Python etc.)
- Copy the note to your clipboard with one click
- Change note url with one easy step
- Lock any note with a password, you can unlock the note if know the password
- Automatically save, no save button
- Mobile responsive
- Progressive Web App
- User system, register and login
- You can change your profile details and your password after registration
- You can delete your account with your all data
- Track notes with your track list
- Get an immutable backup of the notes you want

# Showcase

|  Sign In  	|  Sign Up	|  Forgot Password 	|   Note Trackings	| Note Backups	|
|---	|---	|---	|---	| ---	|
|  ![Sign In](/docs/sign_in.png "Sign In") 	|  ![Sign Up](/docs/sign_up.png "Sign Up") 	|  ![Forgot Password](/docs/forgot_password.png "Forgot Password") 	|  ![Note Trackings](/docs/note_trackings.png "Note Trackings") 	| ![Note Backups](/docs/note_backups.png "Note Backups") 	|

|  Dark Mode	|  Settings Profile	|  Settings Security 	|   Settings Danger Zone	| Note	|
|---	|---	|---	|---	| ---	|
|  ![Dark Mode](/docs/dark_mode.png "Dark Mode") 	|  ![Profile](/docs/settings_profile.png "Profile") 	|  ![Security](/docs/settings_security.png "Security") 	|  ![Danger Zone](/docs/settings_danger_zone.png "Danger Zone") 	| ![Note](/docs/note.png "Note") 	|


|  Note Password  	|  Note Font Size	|  Markdown Preview 	|   Code Preview	|
|---	|---	|---	|---	|
|  ![Note Password](/docs/note_password.png "Note Password") 	|  ![Change Note Font Size](/docs/note_change_font_size.png "Change Note Font Size") 	|  ![Markdown Preview](/docs/markdown_preview.png "Markdown Preview") 	|  ![Code Preview](/docs/code_preview.png "Code Preview") 	|

# Development

```bash
# Clone the project.
git clone https://github.com/ridvanaltun/notebin.git

# Go to web client, install depedencies, build for PWA and run production server.
# To work with PWA, it is necessary to compile for production. (npm run build)
cd web-client && npm i && npm run build && npm run start

# Go to project main folder and start back-end server.
# pgAdmin (database client), PostgreSQL (database)
# ... and Django App (back-end API server) will start.
docker-compose up -d
```