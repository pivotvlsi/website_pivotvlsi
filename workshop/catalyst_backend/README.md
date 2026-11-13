# Zoho Catalyst Backend for Workshop Payment

## Deployment Instructions

### 1. Link Your Catalyst Project
Inside this folder (`workshop/catalyst_backend`):
```bash
catalyst init
```
* Select your Catalyst Project (or create a new project called `pivot-workshop`).
* Choose `Functions` (do not overwrite existing files).

### 2. Set Catalyst Environment Variables
In your [Zoho Catalyst Console](https://catalyst.zoho.in) under **Settings -> Environment Variables** (or via CLI):
- `ZOHO_PAYMENTS_ACCOUNT_ID`: Your Zoho Payments Account ID.
- `ZOHO_PAYMENTS_CLIENT_ID`: Zoho API Client ID.
- `ZOHO_PAYMENTS_CLIENT_SECRET`: Zoho API Client Secret.
- `ZOHO_PAYMENTS_REFRESH_TOKEN`: Zoho OAuth Refresh Token.

### 3. Deploy
```bash
catalyst deploy
```
Copy your deployed function URL (e.g. `https://pivot-workshop-xxxx.development.catalystcloud.in/server/workshop_payment/create-session`) and set it in `reserve_spot.html`.

