from playwright.sync_api import sync_playwright

def verify_farm_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the served app
        page.goto("http://localhost:3001")

        # Wait for content to load
        page.wait_for_selector('h3:has-text("Farm Schedule")')

        # Take a screenshot of the entire page
        page.screenshot(path="verification_screenshot.png", full_page=True)

        # Verify specific elements exist
        # Check for wood-texture class
        wood_elements = page.locator('.wood-texture')
        count = wood_elements.count()
        print(f"Found {count} .wood-texture elements")

        # Check for soil-pit class
        soil_elements = page.locator('.soil-pit')
        soil_count = soil_elements.count()
        print(f"Found {soil_count} .soil-pit elements")

        browser.close()

if __name__ == "__main__":
    verify_farm_ui()
