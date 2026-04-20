from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to /patients...")
            page.goto("http://localhost:8080/patients")

            time.sleep(5)

            print(f"Current URL: {page.url}")
            print(f"Page Title: {page.title()}")

            page.screenshot(path="verification/debug_start.png")
            print("Screenshot saved to verification/debug_start.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
