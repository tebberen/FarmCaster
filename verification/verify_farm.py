from playwright.sync_api import sync_playwright

def verify_farm_grid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local dev server
        page.goto("http://localhost:3000")

        # Wait for the grid to appear
        page.wait_for_selector("text=AYI TARLASI")

        # Wait for stats to load (simulated) or just capture the initial state
        # The FarmGrid should be visible

        # Screenshot the whole page or just the grid
        page.screenshot(path="verification/farm_grid_verification.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_farm_grid()
