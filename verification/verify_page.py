from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the local server
            page.goto("http://localhost:3000")

            # Wait for the page to load
            page.wait_for_load_state("networkidle")

            # Take a screenshot of the main page
            page.screenshot(path="verification/page.png")
            print("Screenshot taken at verification/page.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
