
from playwright.sync_api import sync_playwright, Page, expect

def verify_network_change(page: Page):
    print("Navigating to home...")
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")

    # 2. Act: Click on the "BSC" network row cell (Day 1)
    print("Locating BSC row...")

    # Locate the text "BSC"
    bsc_text = page.locator("span", has_text="BSC")

    # Click the BSC text first to see if that works (it shouldn't select the cell, but maybe focus?)
    # But we need to click a cell.

    # Let's find the row by its structure.
    # The row contains the text "BSC".
    # And it contains cells.

    # We can select the 2nd row in the list of rows.
    # The rows are inside div.space-y-3
    rows = page.locator(".space-y-3 > div")

    # BSC is index 1 (Base is 0)
    bsc_row = rows.nth(1)

    # Verify it has BSC text
    expect(bsc_row).to_contain_text("BSC")

    # Find the cells container.
    # It's the div with flex-1
    cells_container = bsc_row.locator("div.flex-1")

    # Find the first cell (Day 1)
    # It is a div.
    day1_cell = cells_container.locator("div").first

    # Check if it is clickable (has cursor-pointer class)
    # expect(day1_cell).to_have_class(re.compile(r"cursor-pointer"))

    print("Clicking Day 1 on BSC row...")
    # Force click if needed, but standard click should work
    day1_cell.click(force=True)

    # 3. Assertions
    print("Verifying BSC Streak card...")
    expect(page.get_by_text("BSC Streak")).to_be_visible()

    print("Verifying Action Area...")
    action_area_title = page.locator("h2").filter(has_text="BSC").filter(has_text="Network")
    expect(action_area_title).to_be_visible()

    # 4. Screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/ui_verification_bsc.png")

    print("Network change verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_network_change(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_bsc_debug.png")
        finally:
            browser.close()
