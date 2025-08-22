# SagaSage – unified application repository

This repository brings together the three **ai‑co‑dm** projects—API, DB and UI—into a single codebase.  The original sources are copied into `api/`, `db/` and `ui/` and remain unmodified.  Secrets and credentials are injected at runtime via environment variables to ensure no private information is stored in the repository.

## Overview

SagaSage is a full‑stack generative AI application for table‑top role‑playing games.  It allows game masters and players to **create, save and edit richly generated characters**, complete with portraits, backstories, stat blocks and inventories.  Characters can be marked as **public** or **private**: public characters are visible to all players, while private characters (such as enemies or NPCs) are hidden from other players so game masters can keep surprises secret.  Authentication is handled by Google Sign‑In via Firebase, so only authorised users can manage their characters.

## Install (running locally)

The SagaSage stack can be run locally without deploying to AWS.  Use the following steps:

1. **Clone the repository** and install dependencies in each sub‑project:

   ```bash
   cd api && npm install      # install API dependencies
   cd ../ui && npm install    # install UI dependencies
   # Liquibase requires Java; install Liquibase CLI separately.
   ```

2. **Set up a local PostgreSQL database.**  Create a new database (e.g. `sagasage`) and a user with privileges.  Configure environment variables `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER` and `PG_PASS` accordingly (see **Environment variables** below).

3. **Apply database migrations.**  From the `db` directory run:

   ```bash
   liquibase update --defaults-file=defaults.properties
   ```

   This will create the necessary tables (`users`, `characters`, `sessions`, etc.) based on the changelog【505033970815444†L8-L19】.

4. **Run the API locally.**  The Lambda function can be executed as an Express app via the `local` script defined in `api/package.json`【604146137565700†L17-L33】.  Create an `.env` file in the `api` folder with the required variables (see below), then run:

   ```bash
   cd api
   npm run local
   ```

   This starts an Express server (typically on port 3001) exposing the same endpoints as the AWS Lambda.

5. **Run the UI.**  In the `ui` directory, create a `.env.local` file with your Firebase web credentials and the local API URL.  Start the development server with:

   ```bash
   cd ui
   npm run dev
   ```

   The UI will be available at `http://localhost:3000`.  Sign in with Google; the app will store your ID token in cookies and include it in API calls.

## Architecture

SagaSage uses a serverless architecture when deployed to the cloud.  Locally, the same services can be emulated using Express and a local PostgreSQL instance.  The diagram below groups AWS services (Lambda and S3) inside an **AWS Cloud** boundary and places external services (Firebase Auth, PostgreSQL, OpenAI API and the user’s browser) outside that boundary.  Arrow labels describe request and data flows.

![SagaSage Architecture](architecture_diagram_updated.png)

### Components

* **AWS Lambda (Character API):** A Node.js function that accepts requests to generate or save characters.  It uses environment variables for credentials and calls the OpenAI API to generate backstories and images.  When running locally this Lambda is served via an Express wrapper using the `npm run local` script.
* **S3 Bucket (Image Storage):** Stores generated character portraits.  Terraform defines the bucket with a public‑read ACL【832695198216688†L0-L7】.  Locally you can use a simple `uploads/` directory or MinIO as a stand‑in.
* **PostgreSQL Database:** Stores user accounts, sessions, characters and usage metrics.  Although the Terraform configuration sets up AWS providers【102489849184110†L19-L30】, the actual database runs outside of AWS (e.g. RDS or a self‑hosted instance).  Liquibase manages schema migrations.
* **OpenAI / Stable Diffusion:** The API uses the OpenAI SDK to generate character descriptions and portraits by default.  You can point the API to a custom Stable Diffusion server by overriding the appropriate environment variables.
* **React/Next.js UI:** Provides the web interface where users create and manage characters.  It authenticates via Firebase (Google OAuth) and sends HTTPS requests to the API including the user’s ID token.
* **Terraform:** Defines the cloud infrastructure—Lambda, S3 bucket, IAM roles and function URLs.  Use `terraform plan` and `terraform apply` to deploy SagaSage in AWS.  You can adjust the region and bucket names in the Terraform locals files.
* **Security:** Authentication is enforced via Google/Firebase.  The API validates the user’s ID token using the Google OAuth client ID【263045001802365†L34-L41】 and reads a shared `AUTH_KEY` from the request body.  Sessions are stored in cookies with expiry times.  Secrets (API keys, DB passwords, Firebase config) are injected via environment variables; none are stored in the repository.

## Environment variables

To run SagaSage locally you must provide several environment variables.  Create a `.env` file in `api/` for the API and a `.env.local` file in `ui/` for the front‑end.  Values in italics must be supplied from external services or generated by you.

### API (`api/.env`)

* `OPENAI_API_ORG` – *OpenAI organisation ID used for billing*.
* `OPENAI_API_KEY` – *OpenAI API key used to generate text and images*.
* `FAKE_OPENAI_API_KEY` – Dummy key for development when you do not wish to call OpenAI.
* `AUTH_KEY` – Shared secret between UI and API; set any random string and reuse it in the UI requests.
* `DOMAIN` – Base domain where the UI runs (e.g. `http://localhost:3000`).
* `PG_USER`, `PG_PASS`, `PG_HOST`, `PG_PORT`, `PG_DATABASE` – PostgreSQL username, password, host, port and database name.
* `APP_NAME` – Arbitrary label used for logging and S3 prefixes.
* `SESSION_EXPIRY_SECONDS` – Number of seconds a user session is valid (e.g. `7200`).
* `FIREBASE_CONFIG` – JSON stringified Firebase Admin SDK credentials (service account).  Create a service account in Firebase Console and copy its JSON here.
* `UI_GOOGLE_CLIENT_ID` – Google OAuth client ID used to verify ID tokens【263045001802365†L34-L41】.
* `AUTH_OVERRIDE` – (Optional) token that disables auth checks for local testing; choose any string.
* `OVERRIDE_USER` – (Optional) JSON string representing a fake user returned when `AUTH_OVERRIDE` is used.
* `DEBUG` – Set to `true` to enable verbose logging.

### UI (`ui/.env.local`)

* `NEXT_PUBLIC_API_URL` – Base URL of your local API (e.g. `http://localhost:3001`).
* `NEXT_PUBLIC_FIREBASE_API_KEY` – Firebase web API key from your Firebase project settings.
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` – Firebase auth domain (e.g. `<projectId>.firebaseapp.com`).
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID` – Firebase project ID.
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` – Firebase storage bucket name.
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` – Firebase messaging sender ID (optional if you do not use push messaging).
* `NEXT_PUBLIC_FIREBASE_APP_ID` – Firebase app ID.
* `NEXT_PUBLIC_GOOGLE_CLIENT_ID` – Google OAuth client ID for the front‑end; must match `UI_GOOGLE_CLIENT_ID` in the API.

### Liquibase / Database

Liquibase reads the same PostgreSQL connection variables (`PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASS`) to apply migrations.  You can export these variables in your shell or define them in a `defaults.properties` file.

## Repository layout

```
sagaSage/
├── api/           # Copy of ai‑co‑dm‑character‑lambda (Node.js Lambda)
│   └── tests/     # Example Jest tests for the API
├── db/            # Liquibase changelogs and defaults
├── ui/            # React/Next.js front‑end
│   └── src/__tests__/  # Example React Testing Library tests for the UI
├── architecture_diagram_updated.png  # Updated architecture diagram
└── README.md      # Project documentation
```

## Unit tests

Sample tests have been added to illustrate how you might begin testing SagaSage:

* `api/tests/character.test.ts` uses Jest to call the `character` handler directly and verifies it returns proper error codes for invalid methods and missing parameters.
* `ui/src/__tests__/CharacterForm.test.tsx` uses React Testing Library to render a character form component, ensuring form fields are present and the public/private toggle works as expected.

To run the tests, install dev dependencies and run `npm test` in the respective directories.  You can expand these tests to cover additional components and API routes.

## Secret management

SagaSage relies on environment variables to inject secrets at runtime.  No API keys, passwords or Firebase credentials are checked into source control.  When deploying to AWS you should use services such as AWS Secrets Manager or SSM Parameter Store to supply these values securely.  When running locally, store them in a `.env` file (API) and `.env.local` file (UI) which are ignored by Git.

## Conclusion

SagaSage enables game masters and players to generate and manage rich TTRPG characters using a serverless architecture.  With the provided installation steps, architecture diagram and environment variable definitions, you can run the entire stack locally or deploy it to AWS.  Remember to supply your own credentials and secrets when configuring the application.

## Repository layout

```
sagaSage/
├── api/           # Copy of ai‑co‑dm‑character‑lambda
├── db/            # Copy of ai‑co‑dm‑db (Liquibase changelogs)
├── ui/            # Copy of ai‑co‑dm‑ui (React/Next.js frontend)
├── architecture_diagram_updated.png  # Updated architecture diagram
├── architecture_diagram.png          # Earlier diagram (for reference)
└── README.md     # This document
```

## Secret management

The original repositories relied on environment variables loaded via Terraform to supply credentials.  For example, the Lambda configuration maps variables like `OPENAI_API_KEY`, `PG_USER` and `PG_PASS` from a `.env` file into the function’s environment【151961939534151†L18-L32】.  In this consolidated repository **no secret values are stored**.  You must provide the appropriate values at deployment time (e.g., via AWS Secrets Manager, CI/CD pipeline variables or local `.env` files).  The copies under `api/`, `db/` and `ui/` reflect the upstream state and have not been modified.

## Deployment guidance

1. **Install dependencies** – run `npm install` or `yarn` in each of the `api/` and `ui/` directories.  Liquibase requires Java and can be run using the `liquibase update` command in the `db` directory.
2. **Configure Terraform** – in `api/terraform`, set up your environment variables (e.g., through `terraform.tfvars` or environment variables) and run `terraform plan` followed by `terraform apply` to provision the AWS Lambda and S3 bucket.  The `provider.tf` file uses the AWS provider and a region specified via `local.region`【102489849184110†L19-L30】.
3. **Apply database migrations** – use Liquibase to apply the changelogs to your PostgreSQL database (`liquibase update --defaults-file=defaults.properties`).  Tables such as `users`, `sessions`, `characters` and `usage` will be created【505033970815444†L8-L19】.
4. **Run the UI** – configure Firebase in `ui` with your project credentials (Firebase API key, auth domain, etc.) and start the Next.js server with `npm run dev`.

## Conclusion

SagaSage combines the character API, database migration scripts and the user interface into a single repository.  The updated architecture diagram highlights how AWS services, third‑party APIs and external infrastructure interact.  All secrets have been removed from the codebase; remember to provide the necessary environment variables when deploying.  This unified repository should serve as the foundation for future development and deployment of the SagaSage application.