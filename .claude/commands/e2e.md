---
description: End-to-end testing with Chrome integration — click through flows visually
---

# /e2e — Chrome Integration Testing

Use Claude Code's Chrome integration for visual e2e testing. Stays in-toolset.

## When to Use

- Testing user flows (login, checkout, onboarding)
- Verifying UI changes visually
- Debugging browser-specific issues
- Quick smoke tests before deploy

## Process

1. **Start Chrome session**
   - Open the target URL in Chrome
   - Connect Claude Code via `/chrome`

2. **Walk the flow**
   - Click through the user journey
   - Inspect DOM elements as needed
   - Check console for errors

3. **Document findings**
   - Screenshot critical states (if needed)
   - Note any failures or unexpected behavior

## What You Can Do

- Click elements
- Fill forms
- Navigate pages
- Inspect DOM structure
- Read console logs/errors
- Verify text content
- Check element visibility

## Example Session

```
/e2e login flow

Testing: Login → Dashboard

1. Navigate to /login
   ✓ Page loaded
   ✓ Email/password fields present

2. Enter test credentials
   ✓ Form accepts input
   ✓ No console errors

3. Click "Sign In"
   ✓ Redirected to /dashboard
   ✓ User name displayed
   ✓ No auth errors in console

Result: Login flow working ✓
```

## Tips

- Use test accounts (never production credentials)
- Check console for errors after each action
- For complex flows, break into steps
