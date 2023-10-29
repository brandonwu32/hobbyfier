# ssd-oauth-assignment

This Node.js Express server application demonstrate basic Google OAuth2 process to access user's private calendar information. A blog post explaining the basic OAuth2 process can be found [here](https://medium.com/@isuru71/google-calendar-api-with-oauth2-and-node-js-25f17521c1f3).

## Setup

Clone the repo and install dependencies

```sh { vsls_cell_id=e0213d86-93f7-4115-a9d9-500c6967760a }
git clone https://github.com/robotikka/ssd-oauth-assignment.git
cd ssd-oauth-assignment
```

```sh { vsls_cell_id=f02bd63c-2e88-4b01-843b-b18bd0d962af }
npm install
```

Create an Google Console API application from [here](https://console.developers.google.com/) and enable Google Calendar API.

Create an .env file in the root directory as follows

```ini { vsls_cell_id=52a82653-97ca-4da6-bc2f-6e8c918bbc20 }
GOOGLE_CLIENT_ID = [Application Client ID]
GOOGLE_CLIENT_SECRET = [Application Client Secret]

SESSION_NAME = "GoogleOAuthSession"
SESSION_SECRET = "secretsecret"
```

To start express server, run the following

```text { vsls_cell_id=82f92265-ffae-4b59-bb70-a03f62795ba0 }
npm test
```

Visit http://localhost:3000/ on your browser to access the application.

> This application is developed for the 2nd Assignment of Secure Software Development module offered in 4th year 2nd semester of BSc. in Information Technology specialized in Software Engineering degree at Sri Lanka Institute of Information Technology.