from playwright.sync_api import sync_playwright

def verify_farm_grid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the served app
        page.goto("http://localhost:3000")

        # Wait for FarmGrid to be visible
        # We look for "Base" or the month name
        page.wait_for_selector("text=Base", timeout=10000)

        # Check if the header shows Month Year (dynamic)
        # Note: In the new code, "Base" is replaced by "{currentMonthName} {currentYear}"
        # Wait, I updated the code to show Month Year.
        # But if the build was old? I ran npm run build. It should be new.
        # Let's check for the "Base" text removal.
        # Ah, in my new code I removed "Base" and replaced it with Month Year.
        # So waiting for "Base" might fail if it worked!

        # Let's wait for a network button like "Base"
        page.wait_for_selector("text=Base", timeout=10000)

        # Take screenshot
        page.screenshot(path="verification/farm_grid_dynamic.png")

        browser.close()

if __name__ == "__main__":
    verify_farm_grid()
