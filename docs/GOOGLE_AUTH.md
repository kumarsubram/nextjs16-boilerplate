# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for authentication in this boilerplate using Better Auth.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create a Google Cloud Project](#step-1-create-a-google-cloud-project)
4. [Step 2: Configure OAuth Consent Screen](#step-2-configure-oauth-consent-screen)
5. [Step 3: Create OAuth Credentials](#step-3-create-oauth-credentials)
6. [Step 4: Configure Your App](#step-4-configure-your-app)
7. [Step 5: Test the Integration](#step-5-test-the-integration)
8. [Going to Production](#going-to-production)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This boilerplate uses [Better Auth](https://www.better-auth.com/) with Google OAuth for authentication. Users can sign in with their Google account, and their session is managed securely.

### How It Works

1. User clicks "Sign in with Google"
2. User is redirected to Google's consent screen
3. User grants permission
4. Google redirects back with an authorization code
5. Better Auth exchanges the code for user info
6. User session is created in your database

---

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Your app running on `localhost:3000` (for development)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Click the project dropdown at the top of the page

3. Click **"New Project"**

4. Fill in the project details:
   - **Project name**: Your app name (e.g., "My SaaS App")
   - **Organization**: Leave as default or select your organization
   - **Location**: Leave as default

5. Click **"Create"**

6. Wait for the project to be created, then select it from the project dropdown

---

## Step 2: Configure OAuth Consent Screen

The consent screen is what users see when they sign in with Google.

1. In the Google Cloud Console, go to **APIs & Services > OAuth consent screen**
   - Direct link: `https://console.cloud.google.com/apis/credentials/consent`

2. Select **User Type**:
   - **Internal**: Only users within your Google Workspace organization (for internal tools)
   - **External**: Any Google user can sign in (for public apps)

   For most apps, select **External**, then click **"Create"**

3. Fill in the **App information**:

   | Field              | Example             | Notes                   |
   | ------------------ | ------------------- | ----------------------- |
   | App name           | My SaaS App         | Shown on consent screen |
   | User support email | support@yourapp.com | Required                |
   | App logo           | (optional)          | 120x120px PNG or JPG    |

4. Fill in the **App domain** (optional for development):
   - Application home page: `https://yourapp.com`
   - Application privacy policy: `https://yourapp.com/privacy`
   - Application terms of service: `https://yourapp.com/terms`

5. Add **Authorized domains**:
   - For production: `yourapp.com`
   - Leave empty for localhost development

6. Fill in **Developer contact information**:
   - Add your email address

7. Click **"Save and Continue"**

### Configure Scopes

1. Click **"Add or Remove Scopes"**

2. Select these scopes:
   - `email` - View user's email address
   - `profile` - View user's basic profile info
   - `openid` - Associate you with your personal info on Google

3. Click **"Update"**, then **"Save and Continue"**

### Add Test Users (for External apps)

While your app is in "Testing" status, only test users can sign in.

1. Click **"Add Users"**

2. Add email addresses of people who need to test:
   - Your email
   - Team members' emails

3. Click **"Save and Continue"**

4. Review the summary and click **"Back to Dashboard"**

---

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
   - Direct link: `https://console.cloud.google.com/apis/credentials`

2. Click **"Create Credentials"** > **"OAuth client ID"**

3. Select **Application type**: **Web application**

4. Fill in the details:

   | Field | Value                         |
   | ----- | ----------------------------- |
   | Name  | Web client (or your app name) |

5. Add **Authorized JavaScript origins**:

   For development:

   ```
   http://localhost:3000
   ```

   For production (add these later):

   ```
   https://yourapp.com
   https://www.yourapp.com
   ```

6. Add **Authorized redirect URIs**:

   For development:

   ```
   http://localhost:3000/api/auth/callback/google
   ```

   For production (add these later):

   ```
   https://yourapp.com/api/auth/callback/google
   https://www.yourapp.com/api/auth/callback/google
   ```

7. Click **"Create"**

8. **Copy your credentials** - You'll see a popup with:
   - **Client ID**: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

   **Important**: Save these securely. The Client Secret is shown only once!

---

## Step 4: Configure Your App

1. Open your `.env.local` file (create it from `.env.example` if it doesn't exist)

2. Add your Google credentials:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Better Auth
BETTER_AUTH_SECRET=your-32-character-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

3. Generate a secret for `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

4. Save the file

5. Restart your development server:

```bash
npm run dev
```

---

## Step 5: Test the Integration

1. Open your browser to `http://localhost:3000`

2. Click "Sign in" in the navigation

3. Click "Continue with Google"

4. You should see Google's consent screen with your app name

5. Select your Google account and grant permissions

6. You should be redirected back to your app, now signed in

### Verify the Session

After signing in, you can verify the session is working:

```typescript
// In a Server Component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  console.log(session?.user); // { id, name, email, image }

  return <div>Welcome, {session?.user?.name}</div>;
}
```

---

## Going to Production

Before launching, complete these steps:

### 1. Update OAuth Credentials

Go back to Google Cloud Console > Credentials and add your production URLs:

**Authorized JavaScript origins:**

```
https://yourapp.com
https://www.yourapp.com
```

**Authorized redirect URIs:**

```
https://yourapp.com/api/auth/callback/google
https://www.yourapp.com/api/auth/callback/google
```

### 2. Update Environment Variables

In your production environment (Vercel, etc.):

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://yourapp.com
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

### 3. Publish Your App (Optional)

By default, your app is in "Testing" mode, limited to 100 test users.

To allow anyone to sign in:

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. Your app will enter "In production" status

**Note**: If your app requests sensitive scopes, Google may require verification.

### 4. Verify Your App (If Required)

If your app requests sensitive or restricted scopes, Google requires verification:

1. Fill out the verification form
2. Provide a privacy policy URL
3. Demonstrate how you use the requested scopes
4. Wait for Google's review (can take several weeks)

For apps that only use `email`, `profile`, and `openid`, verification is usually not required.

---

## Troubleshooting

### "Google hasn't verified this app" Warning

This appears when:

- Your app is in "Testing" mode
- You're signing in with an account not in the test users list

**Solutions:**

- Add your email to test users
- Or click "Advanced" > "Go to [App Name] (unsafe)" to proceed

### "redirect_uri_mismatch" Error

The redirect URI doesn't match what's configured in Google Cloud.

**Check:**

1. The URI in your error message
2. Compare with URIs in Google Cloud Console
3. Make sure they match exactly (including `http` vs `https`, trailing slashes)

Common mistakes:

- Missing `http://` or `https://`
- Using `localhost` instead of `127.0.0.1` (or vice versa)
- Missing port number (`:3000`)
- Wrong path (`/api/auth/callback/google`)

### "Access Blocked: App is not verified"

Your app requests sensitive scopes and hasn't been verified by Google.

**Solutions:**

- Remove unnecessary scopes (only request `email`, `profile`, `openid`)
- Submit your app for verification
- For development, add users as test users

### Sign-in Works but Session is Empty

The database might not be set up correctly.

**Check:**

1. Run `npm run db:push` to sync the schema
2. Check database connection (`DATABASE_URL`)
3. Look for errors in the server logs

### "Invalid Client" Error

Your credentials are incorrect.

**Check:**

1. Copy Client ID and Secret again from Google Cloud Console
2. Make sure there are no extra spaces
3. Verify you're using the correct project

---

## Security Best Practices

1. **Never commit credentials** - Keep `.env.local` in `.gitignore`
2. **Use environment variables** - Never hardcode credentials
3. **Rotate secrets periodically** - Update `BETTER_AUTH_SECRET` every few months
4. **Monitor usage** - Check Google Cloud Console for unusual activity
5. **Limit scopes** - Only request the permissions you need

---

## Files Reference

| File                                  | Purpose                        |
| ------------------------------------- | ------------------------------ |
| `src/lib/auth.ts`                     | Server-side auth configuration |
| `src/lib/auth-client.ts`              | Client-side auth hooks         |
| `src/app/api/auth/[...all]/route.ts`  | Auth API routes                |
| `src/app/(auth)/login/page.tsx`       | Login page                     |
| `src/components/auth/auth-button.tsx` | Sign in/out button             |

---

## Further Reading

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [OAuth Consent Screen Guide](https://support.google.com/cloud/answer/6158849)
