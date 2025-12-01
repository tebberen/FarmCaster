from playwright.sync_api import sync_playwright

def verify_network_switch():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to local dev server
            page.goto("http://localhost:3000")

            # Wait for FarmGrid to load
            page.wait_for_selector("text=Networks", timeout=10000)

            # Take initial screenshot (Base default)
            page.screenshot(path="verification/1_initial_state.png")
            print("Initial screenshot taken")

            # Find and Click on BSC network row (using text "BSC")
            # The structure is a div with text "BSC" inside a clickable div
            bsc_row = page.get_by_text("BSC", exact=True)
            if bsc_row.is_visible():
                print("Found BSC row")
                # We need to click the parent container that has the onClick handler
                # But clicking the text should bubble up
                bsc_row.click()
                print("Clicked BSC")

                # Wait a bit for state update (optimistic UI)
                page.wait_for_timeout(1000)

                # Check if "BSC Network" is displayed in Action Area
                # The Action Area h2 should update
                # Expecting "BSC Network"
                action_area_title = page.locator("h2:has-text('BSC Network')")
                if action_area_title.is_visible():
                    print("SUCCESS: Action Area updated to BSC Network")
                else:
                    print("FAILURE: Action Area did not update to BSC Network")

                # Take screenshot after switch
                page.screenshot(path="verification/2_after_switch_bsc.png")

                # Now try clicking Arbitrum (ARB)
                arb_row = page.get_by_text("Arbitrum", exact=True)
                if arb_row.is_visible():
                    arb_row.click()
                    print("Clicked Arbitrum")
                    page.wait_for_timeout(1000)
                     # Expecting "Arbitrum Network"
                    if page.locator("h2:has-text('Arbitrum Network')").is_visible():
                         print("SUCCESS: Action Area updated to Arbitrum Network")
                    else:
                         print("FAILURE: Action Area did not update to Arbitrum Network")

                    page.screenshot(path="verification/3_after_switch_arb.png")

            else:
                print("Could not find BSC row")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_network_switch()
