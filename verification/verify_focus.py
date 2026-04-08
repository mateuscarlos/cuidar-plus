from playwright.sync_api import sync_playwright, expect
import os

def run(page):
    print("Navigating to /patients...")
    # Use 127.0.0.1 instead of localhost to avoid IPv6 issues sometimes
    page.goto("http://127.0.0.1:8080/patients")

    # Wait for the page to load
    page.wait_for_load_state("networkidle")

    # Locate the search input
    # get_by_role('searchbox') works for <input type="search">
    search_input = page.get_by_role("searchbox", name="Buscar pacientes")
    expect(search_input).to_be_visible()

    print("Typing in search input...")
    search_input.fill("Test Patient")

    # Wait for the clear button to appear (it renders conditionally)
    clear_button = page.get_by_role("button", name="Limpar busca")
    expect(clear_button).to_be_visible()

    print("Clicking clear button...")
    clear_button.click()

    # Verify the input is cleared
    expect(search_input).to_have_value("")

    # Verify focus returned to input
    print("Verifying focus...")
    # We can check if the element matches :focus pseudo-class
    expect(search_input).to_be_focused()
    print("Focus check passed!")

    # Take screenshot
    page.screenshot(path="verification/verification.png")
    print("Screenshot saved to verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            run(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
