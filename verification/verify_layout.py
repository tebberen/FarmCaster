from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_farmcaster_layout(page: Page):
    # 1. Arrange: Go to the homepage.
    try:
        page.goto("http://localhost:3000")

        # 2. Assert: Check for key elements.
        # Check title
        expect(page).to_have_title("FarmCaster")

        # Check Header elements
        expect(page.get_by_text("FARMCASTER")).to_be_visible()
        expect(page.get_by_text("0 XP")).to_be_visible()

        # Check FarmGrid
        expect(page.get_by_role("heading", name="My Farm")).to_be_visible()
        expect(page.get_by_text("Base")).to_be_visible()
        expect(page.get_by_text("HyperEVM")).to_be_visible()

        # Check SeedMarket
        expect(page.get_by_role("heading", name="Seed Market")).to_be_visible()
        expect(page.get_by_text("Seed 1")).to_be_visible()

        # 3. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/farmcaster_layout.png")
        print("Screenshot taken.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="/home/jules/verification/error.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_farmcaster_layout(page)
        finally:
            browser.close()
