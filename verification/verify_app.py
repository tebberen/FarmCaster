from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the served app
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector('text=FarmCaster')
            page.wait_for_selector('text=Seed Market')

            # Check for Connect Button (RainbowKit)
            # The button usually has text 'Connect Wallet' or similar if not connected
            # But the specific text might depend on RainbowKit version/state.
            # Often it's a button with specific classes or testid.
            # We'll look for a button in the header.

            # Take screenshot
            page.screenshot(path="verification/app_verify.png")
            print("Screenshot taken at verification/app_verify.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
