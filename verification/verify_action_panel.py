
from playwright.sync_api import sync_playwright

def verify_action_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto('http://localhost:3000')
            # Wait for the ActionPanel content to load (or at least the connect prompt)
            page.wait_for_selector('text=Farm Controls', timeout=10000)

            # Take a screenshot of the main page which should include ActionPanel
            page.screenshot(path='verification/action_panel.png')
            print('Screenshot taken: verification/action_panel.png')
        except Exception as e:
            print(f'Error: {e}')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_action_panel()
