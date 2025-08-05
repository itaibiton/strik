# Clerk JWT Template Setup (REQUIRED)

To make Clerk work with Convex, you MUST create a JWT template in your Clerk Dashboard:

## Steps:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates** (in the left sidebar)
3. Click **+ New template**
4. Configure the template:
   - **Name**: `convex` (must be exactly this)
   - **Claims**: Add this JSON:
   ```json
   {
     "aud": "convex"
   }
   ```
5. Click **Save**

## Important:
- The template name MUST be `convex` (lowercase)
- The audience (`aud`) MUST be `"convex"`
- This is required for Convex to authenticate users

After creating the template, the integration will automatically sync users when they sign in.