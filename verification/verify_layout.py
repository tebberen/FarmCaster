
from playwright.sync_api import sync_playwright, expect

def verify_farmcaster():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the served app
        page.goto("http://localhost:3000")

        # Verify Title
        expect(page.get_by_text("FarmCaster").first).to_be_visible()

        # Verify Sections
        expect(page.get_by_text("Weekly Schedule")).to_be_visible()
        expect(page.get_by_text("Seed Market")).to_be_visible()

        # Verify Button
        expect(page.get_by_role("button", name="PLANT SEED NOW")).to_be_visible()

        # Verify Network (Base is default)
        expect(page.get_by_text("Base").first).to_be_visible()

        # Take Screenshot
        page.screenshot(path="verification/layout.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_farmcaster()
