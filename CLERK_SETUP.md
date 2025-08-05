# Clerk JWT Template Setup

To make Clerk work with Convex, you need to create a JWT template in your Clerk Dashboard:

1. Go to your Clerk Dashboard
2. Navigate to **JWT Templates**
3. Click **New template**
4. Name it: `convex`
5. Add this to the Claims:
```json
{
  "aud": "convex"
}
```
6. Save the template

That's it! The integration will automatically sync users when they sign in.