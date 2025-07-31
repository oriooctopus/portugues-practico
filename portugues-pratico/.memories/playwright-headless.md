# Playwright Testing Memory

## Always Use Headless Mode

For all Playwright tests, use headless mode to avoid visual distraction:

```javascript
const browser = await chromium.launch({
  headless: true,
});
```

### Benefits:

- ✅ No browser UI visible - runs completely in background
- ✅ Still takes screenshots - full functionality for analysis
- ✅ Faster execution - no rendering overhead
- ✅ No visual distraction - user can keep working
- ✅ Perfect for layout testing and debugging

### Usage:

- Layout consistency testing
- Automated screenshot capture
- CI/CD environments
- Background verification of UI changes

### Example:

```javascript
import { chromium } from "playwright";

async function testLayout() {
  const browser = await chromium.launch(
    { headless: true },
  );
  const page = await browser.newPage();

  // Test steps...
  await page.screenshot({
    path: "test.png",
    fullPage: true,
  });

  await browser.close();
}
```

**Date:** July 28, 2024
**Context:** Portuguese conjugator app layout testing
