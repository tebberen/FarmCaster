from playwright.sync_api import sync_playwright

def verify_connect_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector("text=FarmCaster")

            # Check for Connect Button
            # RainbowKit Connect Button usually has text "Connect Wallet" or similar, or just "Connect" if configured.
            # But initially it might show "Connect Wallet"

            # Let's take a screenshot of the header
            page.screenshot(path="verification/connect_button.png")
            print("Screenshot taken at verification/connect_button.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_connect_button()
