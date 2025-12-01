from playwright.sync_api import sync_playwright

def verify_leaderboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the served app
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Click the Leaderboard button
            # It's a button with "Leaderboard" text
            leaderboard_btn = page.get_by_role("button", name="Leaderboard")
            if leaderboard_btn.is_visible():
                print("Leaderboard button found.")
                leaderboard_btn.click()
            else:
                print("Leaderboard button NOT found.")
                page.screenshot(path="verification/not_found.png")
                return

            # Wait for modal to appear
            # The modal has "Leaderboard" heading
            page.wait_for_timeout(2000) # Give it a moment to animate/render

            # Check for tabs
            base_tab = page.get_by_role("button", name="Base")
            bsc_tab = page.get_by_role("button", name="BSC")

            if base_tab.is_visible():
                print("Base tab visible.")

            # Take a screenshot of the open modal
            page.screenshot(path="verification/leaderboard_modal.png")
            print("Screenshot saved to verification/leaderboard_modal.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_leaderboard()
