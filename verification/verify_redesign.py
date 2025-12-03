from playwright.sync_api import sync_playwright

def verify_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Attempt to connect to localhost:3000 where serve usually runs by default
        # If serve picks another port, I might need to check serve.log
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Take a screenshot of the whole page
            page.screenshot(path="verification/redesign_full.png", full_page=True)
            print("Screenshot taken: verification/redesign_full.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_redesign()
