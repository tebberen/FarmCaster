from playwright.sync_api import sync_playwright

def verify_farmcaster():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the local server
            page.goto("http://localhost:3001")

            # Wait for main elements to load
            # The class .wood-panel is used in multiple places, so it should be present
            page.wait_for_selector(".wood-panel", timeout=5000)

            # Take a full page screenshot
            page.screenshot(path="verification/restore_verification.png", full_page=True)
            print("Screenshot captured successfully.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_farmcaster()
