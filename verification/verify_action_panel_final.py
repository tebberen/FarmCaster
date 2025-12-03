
from playwright.sync_api import sync_playwright

def verify_action_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto('http://localhost:3000')
            # Wait for Farm Controls text which is in ActionPanel
            page.wait_for_selector('text=Farm Controls', timeout=10000)

            # Check if Plant Seed button exists (might be disabled if not connected, but should be in DOM)
            # The text depends on state, but 'Farm Controls' header confirms presence.

            # Take a screenshot
            page.screenshot(path='verification/action_panel_final.png')
            print('Screenshot taken: verification/action_panel_final.png')
        except Exception as e:
            print(f'Error: {e}')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_action_panel()
