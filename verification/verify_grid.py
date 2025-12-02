from playwright.sync_api import Page, expect, sync_playwright

def verify_farm_grid(page: Page):
    # Visit the served app
    page.goto("http://localhost:3000")

    # Wait for the main grid to appear
    # We look for the "Farm Schedule" text
    expect(page.get_by_text("Farm Schedule")).to_be_visible()

    # Look for at least one Network row (e.g., Base)
    expect(page.get_by_role("button", name="Base")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="verification/farm_grid_full.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_farm_grid(page)
            print("Verification successful")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
