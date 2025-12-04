from playwright.sync_api import sync_playwright, expect

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:3000/FarmCaster")

        # Check if the page loaded
        expect(page).to_have_title("FarmCaster")

        # Check if "PLANT SEED NOW" button is visible
        plant_button = page.get_by_role("button", name="PLANT SEED NOW")
        expect(plant_button).to_be_visible()

        # Check cooldown text
        expect(page.get_by_text("Cooldown: 1 min between plants")).to_be_visible()

        # Click on a different seed (e.g., Flowers)
        page.get_by_text("Flowers").click()

        # Check if summary updated
        expect(page.get_by_text("Planting Flowers")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="verification/plant_ui.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_frontend()
