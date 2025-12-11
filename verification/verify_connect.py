from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to local server
    page.goto("http://localhost:3000")

    # Wait for the page to load
    page.wait_for_selector("text=Leaderboard")

    # Check if "WATER FARM" button exists (it should)
    if page.is_visible("text=WATER FARM"):
        print("WATER FARM button is visible")
    else:
        print("WATER FARM button is missing")

    # Take screenshot
    page.screenshot(path="verification/screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
