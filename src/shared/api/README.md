# Mobile App Authentication Support

This directory contains utilities to handle authentication issues with the mobile app (Expo/React Native).

## The Problem

The Expo app sometimes sends malformed cookies in the format:
```
better-auth.session_token=abc,better-auth.session_token=xyz
```

Instead of the correct format:
```
better-auth.session_token=abc; better-auth.session_token=xyz
```

This causes authentication to fail with 401 errors.

## The Solution

We provide two simple utilities:

### 1. For API Routes: `getMobileCompatibleSession`

```typescript
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function GET(req: NextRequest) {
  const session = await getMobileCompatibleSession(req);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Use session.user...
}
```

### 2. For Server Actions: `mobileAuthenticatedActionClient`

```typescript
import { mobileAuthenticatedActionClient } from "@/shared/api/mobile-safe-actions";

export const myAction = mobileAuthenticatedActionClient
  .schema(mySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx; // user is guaranteed to be authenticated
    // Your action logic...
  });
```

## How It Works

1. **Cookie Cleaning**: The utilities detect and fix malformed cookie separators
2. **Deduplication**: If multiple cookies with the same name exist, it keeps the last one (most recent)
3. **Transparent**: Works exactly like the regular auth utilities, just handles mobile app issues

## When to Use

- Use these utilities for any authenticated endpoints that need to work with the mobile app
- For web-only endpoints, you can continue using the regular `auth.api.getSession()` and `authenticatedActionClient`

## Adding to New Routes

When creating a new authenticated API route that needs mobile support:

```typescript
// ❌ Don't use this for mobile-compatible routes
const session = await auth.api.getSession({ headers: req.headers });

// ✅ Use this instead
const session = await getMobileCompatibleSession(req);
```

## Testing

To test if your endpoint works with mobile cookies, use this curl command:

```bash
curl -X GET http://localhost:3000/api/your-endpoint \
  -H "Cookie: better-auth.session_token=token1,better-auth.session_token=token2; better-auth.session_data=data"
```

If it returns data instead of 401, it's working correctly!