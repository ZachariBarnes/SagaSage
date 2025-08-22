# SagaSage API

This folder contains the serverless backend powering the SagaSage application. It exposes Lambda
handlers for creating and saving characters, generating portraits, signing up users, and
retrieving characters.  The API integrates with OpenAI to generate character descriptions
and uses AWS S3 to store character portraits.  Authentication is handled via Google OAuth and
Firebase, and user data is persisted in a PostgreSQL database managed by Liquibase.  A
pricing model monitors usage by tracking tokens and compute costs to implement flexible
billing or quotas.

## Features

- **Create, save, and retrieve characters** – endpoints allow users to generate new
  characters, persist edits, and list characters filtered by user or privacy flag.
- **AI‑driven descriptions** – the API calls OpenAI to generate character backstories and
  attributes using structured prompts.  You can substitute a custom Stable Diffusion
  server by modifying the prompt generation logic.
- **Portrait generation** – character portraits are created on demand and stored in an
  S3 bucket.  The `storeCharacterImage` helper uploads Base64 images to S3 and
  constructs a URL for the UI to display the image【279530171570181†L127-L138】.
- **User sign‑up and session management** – Google or Firebase ID tokens are
  validated via the Google OAuth library and Firebase Admin SDK【741634612476973†L36-L66】.  Sessions are
  created and persisted in PostgreSQL tables.
- **Usage tracking** – every call to the AI service records token usage and cost in
  a `usage` table, enabling rate‑limiting or pricing controls【279530171570181†L17-L39】.

In addition to the core functionality above, the API implements several support
features designed to keep costs under control and improve the developer
experience:

- **Pricing controls** – generation requests record the number of OpenAI tokens
  consumed and the approximate USD cost.  A default image cost (defined in
  `utils.ts` as `SD_DEFAULT_IMAGE_COST`) allows you to simulate charges when
  using a self‑hosted Stable Diffusion service【741634612476973†L20-L23】.  You can use this data to
  enforce quotas, build freemium tiers or display cost breakdowns to your users.
- **Flexible image backend** – by default the API calls OpenAI to generate
  portraits, but you can point it at your own diffusion server by changing a
  single environment variable and updating the prompt generator.  The rest of
  the workflow (S3 upload, usage tracking) stays the same.
- **Privacy model** – when creating or saving characters, callers can set an
  `is_private` flag.  Private characters are stored in the database but are
  hidden from other players unless they belong to the same Dungeon Master.  The
  API enforces this visibility on read operations.

## Environment variables

The API reads configuration from environment variables.  When running locally, create a
`.env` file in the `api` directory and set the following:

| Variable                     | Description |
|------------------------------|-------------|
| **`OPENAI_API_KEY`**         | Secret API key for OpenAI; required to call the OpenAI API【995567643693928†L0-L7】. |
| **`FAKE_OPENAI_API_KEY`**    | Dummy key used when OpenAI calls are disabled; useful for local development【995567643693928†L0-L7】. |
| **`NODE_ENV`**               | Environment identifier (`local`, `development`, or `production`)【995567643693928†L4-L7】. |
| **`FIREBASE_CONFIG`**        | JSON string containing Firebase Admin credentials; used to initialize the Firebase app【741634612476973†L10-L13】. |
| **`DEBUG`**                  | Set to `true` to enable verbose logging in development【203895097141799†L8-L12】. |
| **`UI_GOOGLE_CLIENT_ID`**    | Google OAuth client ID used to verify ID tokens【741634612476973†L36-L45】. |
| **`AUTH_OVERRIDE`**          | Special token that bypasses auth checks, allowing mock users in development【741634612476973†L72-L76】. |
| **`OVERRIDE_USER`**          | JSON string representing a mock user returned when `AUTH_OVERRIDE` is used【741634612476973†L72-L76】. |
| **`AUTH_KEY`**               | Shared secret verifying that requests originate from the UI【741634612476973†L122-L125】. |
| **`PG_USER`**, **`PG_PASS`**, **`PG_HOST`**, **`PG_PORT`**, **`PG_DATABASE`** | PostgreSQL connection parameters for the underlying database. |
| **`SESSION_EXPIRY_SECONDS`** | Number of seconds before session cookies expire. |
| **`S3_BUCKET_NAME`**         | Name of the S3 bucket used to store character portraits. |

## Installation and local development

1. **Install dependencies**

   ```bash
   cd api
   npm install
   ```

2. **Configure environment**

   Create a `.env` file with the variables listed above.  For example:

   ```env
   OPENAI_API_KEY=sk-your-key
   FAKE_OPENAI_API_KEY=fakekey
   NODE_ENV=local
   FIREBASE_CONFIG={"projectId":"...","privateKey":"...","clientEmail":"..."}
   DEBUG=true
   UI_GOOGLE_CLIENT_ID=your-google-client-id
   AUTH_OVERRIDE=dev-auth
   OVERRIDE_USER={"email":"test@example.com","name":"Test User"}
   AUTH_KEY=supersecret
   PG_USER=postgres
   PG_PASS=postgres
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=sagasage
   SESSION_EXPIRY_SECONDS=7200
   S3_BUCKET_NAME=image-generation.sagasage.com
   ```

3. **Run locally**

   The API is implemented as an AWS Lambda, but it can be run locally via the
   provided script:

   ```bash
   npm run local
   ```

   This compiles the TypeScript source on the fly and starts an Express server
   exposing the same handlers on port `3001`.  You can then test endpoints like
   `/character`, `/portrait`, `/signup`, `/saveCharacter`, and `/getCharacters` using
   a REST client such as Postman.

## Deployment

Infrastructure definitions are located under `terraform/`.  They provision a
Lambda function, API Gateway routes, a PostgreSQL database, an S3 bucket,
IAM roles, and all required environment variables.  To deploy:

```bash
npm run build        # compile the TypeScript to the build folder
cd terraform
terraform init
terraform apply -auto-approve
```

Terraform will output the API Gateway URL for the deployed endpoints.  The
`deploy:local` script in `package.json` bundles the build, applies Terraform and
captures outputs into `terraform_output.json`.

## Testing

Unit tests live in `api/tests`.  They can be executed with Jest (you must
install Jest and ts-jest if not already installed).  A sample test is provided
to verify utility functions and basic handler behaviour.

## Repository structure

- **`src/index.ts`** – exposes Lambda handlers for creating characters,
  generating portraits, signing up users, saving characters, and retrieving
  characters【203895097141799†L9-L144】.
- **`src/processors/character.ts`** – orchestrates calls to OpenAI for
  character generation, stores images in S3, and records usage in the
  database【279530171570181†L17-L39】.
- **`src/utilities/utils.ts`** – helpers for request validation, JWT and cookie
  decoding, and formatting success/error responses【741634612476973†L122-L170】.
- **`src/database/`** – data access layer for users, characters and usage metrics.
- **`terraform/`** – infrastructure as code for AWS Lambda, API Gateway, S3,
  RDS, IAM, and related resources.