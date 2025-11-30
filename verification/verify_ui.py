
from playwright.sync_api import sync_playwright, Page, expect

def verify_ui_changes(page: Page):
    # 1. Arrange: Go to the app homepage
    page.goto("http://localhost:3000")

    # Wait for the page to load
    page.wait_for_load_state("networkidle")

    # 2. Verify English Text
    # Check "Farmer Profile"
    expect(page.get_by_text("Farmer Profile")).to_be_visible()

    # Check "Harvest Points"
    expect(page.get_by_text("Harvest Points")).to_be_visible()

    # Check "Keep the streak alive! Harvest daily."
    expect(page.get_by_text("Keep the streak alive! Harvest daily.")).to_be_visible()

    # Check "ACTION AREA"
    expect(page.get_by_text("ACTION AREA")).to_be_visible()

    # Check "DAILY QUEST"
    expect(page.get_by_text("DAILY QUEST")).to_be_visible()

    # Check "Share your daily activity on Farcaster and earn extra XP."
    expect(page.get_by_text("Share your daily activity on Farcaster and earn extra XP.")).to_be_visible()

    # Check "FARMING GRID" (part of the month header)
    expect(page.get_by_text("FARMING GRID")).to_be_visible()

    # Check "Scrollable"
    expect(page.get_by_text("Scrollable")).to_be_visible()

    # Check "Networks"
    expect(page.get_by_text("Networks")).to_be_visible()

    # 3. Verify Leaderboard Button
    leaderboard_btn = page.get_by_role("button", name="Leaderboard")
    expect(leaderboard_btn).to_be_visible()

    # 4. Verify Network Specific Text (Base default)
    # Check "Base Streak"
    expect(page.get_by_text("Base Streak")).to_be_visible()

    # Check "Network" and "Day" in Action Area
    expect(page.get_by_text("Network", exact=True).or_(page.get_by_text("Network ")).first).to_be_visible()
    expect(page.get_by_text("Day", exact=False).first).to_be_visible()

    # 5. Take Screenshots
    # Full page
    page.screenshot(path="verification/ui_verification_full.png", full_page=True)

    print("Verification complete. Screenshots saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ui_changes(page)
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_screenshot.png")
        finally:
            browser.close()
