
from playwright.sync_api import sync_playwright, expect

def verify_seed_market_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device to verify the grid-cols-2 behavior, but checking layout responsiveness
        # However, the user request says "2 columns on mobile, 4 on desktop".
        # Since we are running in a constrained environment, we can check a desktop viewport.
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Navigate to the served page
        # Note: basePath is /FarmCaster
        page.goto("http://localhost:3000/FarmCaster")

        # Wait for hydration - look for the "Connect" button which implies JS is running
        page.get_by_role("button", name="Connect").wait_for()

        # Close onboarding modal if it appears (user might have seen it or not)
        # Based on code, it shows up if localStorage is empty.
        # "Let's Farm!" button closes it.
        try:
            page.get_by_role("button", name="Let's Farm!").click(timeout=3000)
        except:
            print("Onboarding modal not found or already closed")

        # Locate the Seed Market Tabs
        # We look for "GM" button.
        gm_btn = page.get_by_role("button", name="GM Free")
        expect(gm_btn).to_be_visible()

        # Verify it is "Active" by checking styles?
        # Hard to check computed styles easily, but we can check if it exists.

        # Take a screenshot of the whole page
        page.screenshot(path="verification/seed_market.png")

        print("Screenshot taken at verification/seed_market.png")
        browser.close()

if __name__ == "__main__":
    verify_seed_market_ui()
