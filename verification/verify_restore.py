from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for server to start
            page.goto("http://localhost:3000", timeout=60000)

            # Check for key elements of the restored UI
            expect(page.get_by_text("FARMCASTER")).to_be_visible()
            expect(page.get_by_text("Farmer Profile")).to_be_visible()
            expect(page.get_by_text("Daily Quest")).to_be_visible()
            expect(page.get_by_text("Action Area")).to_be_visible()

            page.screenshot(path="verification/restored_ui.png")
            print("Screenshot taken: verification/restored_ui.png")
        except Exception as e:
            print(f"Error: {e}")
            # Take error screenshot
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
