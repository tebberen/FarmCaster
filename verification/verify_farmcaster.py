from playwright.sync_api import sync_playwright

def verify_farmcaster():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=FarmCaster", timeout=10000)
            page.screenshot(path="verification/farmcaster_ui.png", full_page=True)
            print("Screenshot captured at verification/farmcaster_ui.png")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_farmcaster()
