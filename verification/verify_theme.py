
from playwright.sync_api import sync_playwright
import time

def verify_theme():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # 1. Navigate to the page
        print("Navigating to http://localhost:3000/FarmCaster/")
        page.goto("http://localhost:3000/FarmCaster/")

        # Wait for the page to load
        page.wait_for_timeout(3000)

        # 2. Close Onboarding Modal
        print("Closing Onboarding Modal...")
        try:
            # Try finding the button by text containing "Let's Farm"
            onboarding_btn = page.get_by_role("button", name="Let's Farm")
            if onboarding_btn.is_visible():
                onboarding_btn.click()
                print("Onboarding closed.")
                page.wait_for_timeout(1000)
            else:
                # Fallback: Try clicking the X button
                close_btn = page.locator("button:has(svg.lucide-x)")
                if close_btn.count() > 0 and close_btn.first.is_visible():
                    close_btn.first.click()
                    print("Onboarding closed via X button.")
                    page.wait_for_timeout(1000)
                else:
                    print("Onboarding button not found or not visible.")
        except Exception as e:
            print(f"Error closing onboarding: {e}")

        # 3. Check initial theme
        print("Taking initial screenshot (Base)")
        page.screenshot(path="verification/initial_load.png")

        # 4. Switch to Celo (Click on Celo tab)
        print("Switching to Celo")
        try:
            celo_btn = page.get_by_role("button", name="Celo")
            celo_btn.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/celo_theme.png")
            print("Celo screenshot taken")
        except Exception as e:
            print(f"Failed to switch to Celo: {e}")

        # 5. Switch to BSC
        print("Switching to BSC")
        try:
            bsc_btn = page.get_by_role("button", name="BSC")
            bsc_btn.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/bsc_theme.png")
            print("BSC screenshot taken")
        except Exception as e:
            print(f"Failed to switch to BSC: {e}")

        browser.close()

if __name__ == "__main__":
    verify_theme()
