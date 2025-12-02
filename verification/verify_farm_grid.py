from playwright.sync_api import sync_playwright, expect

def verify_farm_grid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:3000")

        # Wait for "Farm Schedule" which confirms the new Grid is loaded
        expect(page.get_by_text("Farm Schedule")).to_be_visible()

        # Check for Network Labels
        expect(page.get_by_text("BASE")).to_be_visible()
        expect(page.get_by_text("BSC")).to_be_visible()
        expect(page.get_by_text("ETHEREUM")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="verification/farm_grid_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_farm_grid()
