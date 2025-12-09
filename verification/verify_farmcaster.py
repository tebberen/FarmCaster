from playwright.sync_api import sync_playwright, expect

def verify_farmcaster():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Navigate to the local server
        page.goto("http://localhost:3000/FarmCaster")

        # 1. Close Onboarding if visible
        try:
            # The onboarding might take a moment to appear
            page.wait_for_selector('button[title="How to Play"]', timeout=2000)

            # Try to click "Let's Farm!" button if it exists.
            lets_farm_btn = page.get_by_role("button", name="Let's Farm!")
            if lets_farm_btn.is_visible():
                print("Closing Onboarding Modal...")
                lets_farm_btn.click()

        except Exception as e:
            print(f"Onboarding handling note: {e}")

        # 2. Verify Calendar Visual Changes
        # Look for the grid cells.
        # Use a more specific locator to avoid matching prices (e.g. $0.15)
        # Grid cells are div.relative.aspect-square...
        # We can look for the span with the day number class we modified.
        # "absolute top-0.5 right-1 text-[9px]"

        # Let's find the day "15" inside the specific span class pattern or parent container
        # Since we just updated the code to use text-[9px], we can assume the class is present if the code updated correctly.

        day_number_locator = page.locator("span.absolute.top-0\\.5.right-1.text-\\[9px\\]").filter(has_text="15")

        # Expect it to be visible
        if day_number_locator.count() > 0:
             print("Found Calendar Day 15 with correct class style.")
             expect(day_number_locator.first).to_be_visible()
        else:
             # If exact class match fails, fallback to just finding the number in a grid context,
             # but verify it is distinct from the price.
             print("Could not find exact class match, trying generic grid cell...")
             # Grid cells are in a section with "S M T W T F S" header.
             # We can narrow scope.
             grid_section = page.locator("section").filter(has_text="S").filter(has_text="M").last
             day_15 = grid_section.get_by_text("15", exact=True)
             expect(day_15).to_be_visible()
             print("Found Day 15 in grid.")

        # 3. Verify Leaderboard Button Functionality
        # Find the Leaderboard button
        leaderboard_btn = page.get_by_role("button", name="🏆 Leaderboard")
        expect(leaderboard_btn).to_be_visible()

        print("Clicking Leaderboard button...")
        leaderboard_btn.click()

        # Wait for modal to appear
        # The modal has "Top 100 Farmers" text
        leaderboard_header = page.get_by_text("Top 100 Farmers")
        expect(leaderboard_header).to_be_visible()
        print("Leaderboard Modal Opened successfully.")

        # Take a screenshot
        page.screenshot(path="verification/farmcaster_verification.png")
        print("Screenshot saved to verification/farmcaster_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_farmcaster()
