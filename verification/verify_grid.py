from playwright.sync_api import Page, expect, sync_playwright
import time
import datetime

def verify_grid(page: Page):
    print("Navigating to http://localhost:3000")
    page.goto("http://localhost:3000")

    # Wait for the title to be visible - the H1 contains "FARM" and a span "CASTER"
    # We can search for the text "FARM" or "FARMCASTER" if the browser concatenates.
    # The code: <h1 ...>FARM<span ...>CASTER</span></h1>
    expect(page.locator("h1")).to_contain_text("FARM")

    print("Title found.")

    # Check for Month/Year header
    now = datetime.datetime.now()
    year = str(now.year)
    month_name = now.strftime("%B").upper() # "NOVEMBER"

    print(f"Checking for {month_name} {year}")
    expect(page.get_by_text(f"{month_name} {year}")).to_be_visible()

    # Check if network buttons are present (Base, BSC, etc)
    expect(page.get_by_role("button", name="Base")).to_be_visible()
    expect(page.get_by_role("button", name="BSC")).to_be_visible()

    # Check for soil pits
    # There should be many (7 networks * 28-31 days approx 200+)
    # Wait a bit for JS to render
    page.wait_for_selector(".soil-pit")
    count = page.locator(".soil-pit").count()
    print(f"Found {count} soil pits")
    if count < 100:
        raise Exception(f"Not enough soil pits found! Found {count}")

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")
    print("Done.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_grid(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
