import os
from playwright.sync_api import sync_playwright, expect

def verify_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to patients page
        print("Navigating to patients page...")
        page.goto("http://localhost:8080/patients")

        # Wait for loading to finish (if any)
        # Assuming there is a heading "Pacientes"
        page.wait_for_selector('h2:has-text("Pacientes")')

        # 1. Verify Search Input Focus
        print("Verifying search input focus...")
        # Use placeholder as fallback if role searchbox is not found (though it should be)
        search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")
        search_input.fill("Test Search")

        # Verify clear button appears
        # It's inside a tooltip, so we look for the button by aria-label
        clear_button = page.get_by_label("Limpar busca")
        expect(clear_button).to_be_visible()

        # Click clear button
        clear_button.click()

        # Verify input is cleared
        expect(search_input).to_have_value("")

        # Verify input is focused
        expect(search_input).to_be_focused()
        print("Search focus verified!")

        # 2. Verify Select Accessibility
        print("Verifying select accessibility...")

        # Open filter panel
        filter_button = page.get_by_label("Alternar filtros avançados")
        filter_button.click()

        # Wait for panel
        page.wait_for_selector("#advanced-filters-panel")

        # Check Status Label and Select Association
        status_label = page.locator("label[for='status-filter']")
        expect(status_label).to_be_visible()
        expect(status_label).to_have_text("Status")

        # Check that the trigger has the id
        status_trigger = page.locator("button#status-filter")
        expect(status_trigger).to_be_visible()

        # Check Priority Label and Select Association
        priority_label = page.locator("label[for='priority-filter']")
        expect(priority_label).to_be_visible()
        expect(priority_label).to_have_text("Prioridade")

        priority_trigger = page.locator("button#priority-filter")
        expect(priority_trigger).to_be_visible()

        print("Accessibility labels verified!")

        # Take screenshot
        if not os.path.exists("verification"):
            os.makedirs("verification")
        page.screenshot(path="verification/ux_verification.png")
        print("Screenshot saved to verification/ux_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_ux()
