from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto("http://localhost:3000")
    # Wait for the main heading to ensure page load
    page.wait_for_selector("text=FARMCASTER")
    # Wait for the wallet to be connected (or showing address)
    page.wait_for_selector("text=Connect Wallet", state="visible", timeout=10000)

    # Wait a bit for other elements to settle
    page.wait_for_timeout(2000)

    # Take screenshot
    page.screenshot(path="verification/app_screenshot.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app(page)
        finally:
            browser.close()
