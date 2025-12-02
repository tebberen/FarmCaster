from playwright.sync_api import sync_playwright

def verify_seed_market():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the served app
        page.goto("http://localhost:3000")

        # Wait for the Action Area to be visible
        page.wait_for_selector("text=Action Area")

        # Check if Seed Market is visible
        seed_market = page.locator("text=Seed Market")
        if seed_market.is_visible():
            print("Seed Market header is visible.")

        # Click on Fruits Tab
        page.get_by_role("button", name="Fruits ($0.15)").click()

        # Click on a Seed (e.g., Grape)
        page.get_by_text("🍇").click()

        # Wait for the button to update
        page.wait_for_selector("text=Plant 🍇")

        # Take a screenshot
        page.screenshot(path="verification/seed_market.png")
        print("Screenshot taken at verification/seed_market.png")

        browser.close()

if __name__ == "__main__":
    verify_seed_market()
