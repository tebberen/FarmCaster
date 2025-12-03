from playwright.sync_api import sync_playwright

def verify_farm_grid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the locally served app
        page.goto("http://localhost:3000")

        # Wait for the grid to appear
        page.wait_for_selector(".wood-panel", timeout=10000)

        # Check for specific elements of the new design
        # 1. "My Farm" header
        if page.get_by_text("My Farm").is_visible():
            print("Verified: 'My Farm' header is visible")
        else:
            print("Failed: 'My Farm' header not found")

        # 2. Season/Month indicator (e.g. "DECEMBER SEASON")
        # We look for "SEASON" text
        if page.get_by_text("SEASON").is_visible():
            print("Verified: Season indicator is visible")
        else:
            print("Failed: Season indicator not found")

        # 3. Network rows
        if page.get_by_text("Base").is_visible():
            print("Verified: Base network row visible")
        else:
            print("Failed: Base network row not found")

        # Take screenshot
        page.screenshot(path="verification/farm_grid_verification.png")
        print("Screenshot saved to verification/farm_grid_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_farm_grid()
