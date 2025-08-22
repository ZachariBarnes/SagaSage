# SagaSage UI

This directory contains the front‑end for the SagaSage application.  It is built
with React and Material UI and provides a polished interface for players and
dungeon masters to create, edit, and browse character sheets, generate
portraits, and collaborate with others.  The UI communicates with the SagaSage
API and uses Firebase Authentication for secure sign‑in.

## Features

- **Character management** – create new characters, edit existing ones and view
  your collection.  A privacy toggle lets you mark characters as public or
  private so that DMs can hide enemy stat blocks from other players.
- **AI‑powered portraits & descriptions** – trigger portrait generation and
  descriptive text from within the UI.  The app shows a loading spinner while
  generation is in progress and then displays the resulting portrait and
  description when complete.
  descriptive text from within the UI.  A **fancy loading spinner** appears
  during generation to let users know that their request is being processed,
  then gracefully transitions to the final portrait and story once the API
  responds.  Because the API tracks token usage and image costs, you can
  display cost estimates alongside the generate button if desired.
- **Authentication** – users sign in via Google OAuth using Firebase UI,
  with tokens stored in secure cookies and passed to the API.  Session expiry
  is enforced server‑side.
- **Responsive design** – built with Material UI, the UI adapts to desktop
  and mobile viewports.

## Environment variables

The UI uses environment variables to configure its connection to Firebase and
the API.  Create a `.env.local` file in this directory with values for your
environment:

| Variable                             | Description |
|--------------------------------------|-------------|
| `NEXT_PUBLIC_API_URL`                | Base URL of the SagaSage API (e.g. `http://localhost:3001`). |
| `NEXT_PUBLIC_FIREBASE_API_KEY`       | Firebase Web API key from your Firebase project settings. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`   | Firebase Auth domain, usually `<projectId>.firebaseapp.com`. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`    | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase storage bucket name. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID (unused in this app). |
| `NEXT_PUBLIC_FIREBASE_APP_ID`        | Firebase application ID. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`       | Google OAuth client ID; must match `UI_GOOGLE_CLIENT_ID` used by the API【741634612476973†L36-L45】. |

## Installation and local development

1. **Install dependencies**

   ```bash
   cd ui
   npm install
   ```

2. **Configure environment**

   Create a `.env.local` file with the variables listed above.

3. **Run the development server**

   ```bash
   npm start
   ```

   The app runs on `http://localhost:3000` by default.  API requests will be
   proxied to `NEXT_PUBLIC_API_URL`.

4. **Run tests**

   ```bash
   npm test
   ```

   This runs Jest via `react-scripts` together with the React Testing
   Library.  Sample tests live in `src/__tests__`.

## Deployment

You can build and deploy the UI to any static hosting provider or via AWS.
Terraform definitions in `ui/terraform/` provision an S3 bucket and
CloudFront distribution for hosting the built site and configure environment
variables for the API URL and Firebase settings.  To deploy via Terraform:

```bash
npm run build
cd terraform
terraform init
terraform apply -auto-approve
```

Terraform will output the CloudFront URL for your deployed UI.

## Repository structure

- **`src/`** – React source code.
- **`src/components/`** – reusable UI components.
- **`src/pages/`** – page components rendered by the router.
- **`src/state/`** – Redux slices and store configuration.
- **`src/__tests__/`** – unit tests for React components.