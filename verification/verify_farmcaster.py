from playwright.sync_api import Page, expect, sync_playwright

def test_farmcaster(page: Page):
    # 1. Go to localhost:3000
    page.goto("http://localhost:3000")

    # 2. Wait for title to be FarmCaster
    expect(page).to_have_title("FarmCaster")

    # 3. Check for main heading
    expect(page.get_by_text("FARMCASTER", exact=False)).to_be_visible()

    # 4. Check for grid
    # Use exact=True to avoid matching "Base Streak" or other partials
    # Or just check that any "Base" is visible
    expect(page.get_by_text("Base", exact=True)).to_be_visible()

    # 5. Screenshot
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_farmcaster(page)
        finally:
            browser.close()
