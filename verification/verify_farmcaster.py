from playwright.sync_api import sync_playwright

def verify_farmcaster(page):
    # Navigate to the home page
    page.goto("http://localhost:3000")

    # Wait for the grid to load
    page.wait_for_selector(".custom-scrollbar")

    # We want to click Day 4 of Base network.
    # Base is the first network.
    # Day 4 is the 4th child in the cells container.
    # The structure:
    # .space-y-3 > div (Base row) > .flex-1 (Cells container) > div:nth-child(4)

    target_cell = page.locator(".space-y-3 > div:first-child .flex-1 > div:nth-child(4)")
    target_cell.click()

    # Wait for UI update
    page.wait_for_timeout(500)
    page.screenshot(path="verification/2_selected_day_4.png")

    # Check Action Area text
    # It should say "WATER PLANT"
    water_button = page.get_by_text("WATER PLANT")
    if water_button.is_visible():
        print("Button is visible and says WATER PLANT")
    else:
        print("Button not found or text incorrect")
        # Dump page text to debug
        # print(page.content())

    water_button.click()

    # Wait for "WATERING..."
    # Note: It might happen fast, so we might miss it if we are not careful,
    # but the logic says 1 second delay.
    # checking for "HARVESTED" after 1.5 seconds.

    page.wait_for_timeout(1500)

    harvested_button = page.get_by_text("HARVESTED")
    if harvested_button.is_visible():
        print("Button changed to HARVESTED")
    else:
        print("Button did not change to HARVESTED")

    # Take screenshot after watering
    page.screenshot(path="verification/3_after_watering_day_4.png")

    print("Verification script finished.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_farmcaster(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
