
from playwright.sync_api import sync_playwright

def verify_action_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto('http://localhost:3000')
            # Just take a screenshot to see what's happening
            page.wait_for_timeout(2000)
            page.screenshot(path='verification/debug.png')
            print('Debug screenshot taken: verification/debug.png')
        except Exception as e:
            print(f'Error: {e}')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_action_panel()
