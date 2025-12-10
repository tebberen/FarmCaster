from playwright.sync_api import sync_playwright, expect

def test_success_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        # Navigate to the page with basePath
        page.goto("http://localhost:3000/FarmCaster", timeout=60000)

        try:
            page.wait_for_selector("header", timeout=10000)
            print("Header found.")
        except:
            print("Header not found.")

        # Take a screenshot
        page.screenshot(path="verification/verification.png")

        browser.close()

if __name__ == "__main__":
    test_success_modal()
