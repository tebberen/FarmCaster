from playwright.sync_api import sync_playwright

def verify_connect_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            # Wait for the Connect Button to appear. RainbowKit usually has specific classes or text.
            # It might say "Connect Wallet" or similar.
            connect_button = page.get_by_role("button", name="Connect Wallet")
            if connect_button.is_visible():
                print("Connect Button found!")
            else:
                 # Fallback to check for partial text if exact match fails
                connect_button = page.get_by_text("Connect Wallet", exact=False)
                if connect_button.is_visible():
                    print("Connect Button found (via text)!")
                else:
                    print("Connect Button NOT found.")

            page.screenshot(path="verification/connect_wallet.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_connect_button()
