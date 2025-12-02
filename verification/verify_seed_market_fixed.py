from playwright.sync_api import Page, expect, sync_playwright

def verify_seed_market(page: Page):
    # 1. Arrange: Go to the app
    # Using the port 3001
    page.goto("http://localhost:3001")

    # 2. Act: Wait for the Seed Market to be visible
    # We look for the "Seed Market" heading
    market_heading = page.get_by_role("heading", name="Seed Market")
    expect(market_heading).to_be_visible()

    # Check for seed tiers
    expect(page.get_by_role("button", name="Starter (1 XP)")).to_be_visible()
    expect(page.get_by_role("button", name="Fruits (2 XP)")).to_be_visible()
    expect(page.get_by_role("button", name="Flowers (3 XP)")).to_be_visible()
    expect(page.get_by_role("button", name="Trees (5 XP)")).to_be_visible()

    # Click on Fruits tab
    page.get_by_role("button", name="Fruits (2 XP)").click()

    # Select an emoji (e.g., Blueberry)
    # The emoji buttons don't have text names easily accessible, but we can try to find one by text
    # The mock data has emojis.
    blueberry = page.get_by_role("button", name="🫐")
    expect(blueberry).to_be_visible()
    blueberry.click()

    # Check if the "Plant" button updates
    # The expected text is "Plant 🫐 for $0.10 (Native)"
    plant_button = page.get_by_role("button", name="Plant 🫐 for $0.10 (Native)")
    expect(plant_button).to_be_visible()

    # 4. Screenshot: Capture the state
    page.screenshot(path="verification/seed_market_fixed.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_seed_market(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_fixed.png")
            raise e
        finally:
            browser.close()
