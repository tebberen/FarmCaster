
from playwright.sync_api import sync_playwright

def verify_app_loads():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Navigate to the app (default port 3000)
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_timeout(5000)

            # The onboarding modal should be visible initially
            if page.locator("text=Welcome, Farmer!").is_visible():
                print("Onboarding modal visible")
                # Close it
                page.click("button:has-text('Let')") # "Let's Farm!" or similar

            page.wait_for_timeout(1000)

            # Take screenshot of the main page
            page.screenshot(path="verification/app_load.png")
            print("Screenshot taken")

            # Check for header elements
            # "Farmer" text and "Connect" (since no wallet connected)
            if page.locator("text=Farmer").is_visible():
                print("Farmer text found")

            # Since we are in browser (no Farcaster context), sdk.context.user is undefined.
            # isFarcasterContext should be false.
            # handleConnect should NOT have polled for farcaster-mini-app automatically.

            # Click "WATER FARM" to trigger connection
            page.click("button:has-text('WATER FARM')")
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/connect_triggered.png")
            print("Connect triggered screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app_loads()
