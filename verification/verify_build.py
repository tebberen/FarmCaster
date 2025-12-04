from playwright.sync_api import sync_playwright, expect

def verify_build():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8080")
            # Check for specific text that identifies the FarmCaster app
            expect(page.get_by_text("Seed Market")).to_be_visible()
            expect(page.get_by_text("Weekly Schedule")).to_be_visible()

            # Take a screenshot
            page.screenshot(path="verification/build_verification.png")
            print("Verification successful, screenshot saved.")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_build()
