from playwright.sync_api import sync_playwright, expect

def verify_a11y():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to Patients page
        print("Navigating to /patients...")
        page.goto("http://localhost:8080/patients")

        # Wait for page to load
        # Use exact match for the main heading
        page.get_by_role("heading", name="Pacientes", exact=True).wait_for()
        print("Page loaded.")

        # 2. Check Search Input
        # Use exact match for label if possible, or just Search Input
        search_input = page.get_by_label("Buscar pacientes")

        expect(search_input).to_be_visible()
        print("✅ Search input found with label 'Buscar pacientes'")

        # Check Search Icon aria-hidden
        search_icon = page.locator(".lucide-search").first
        hidden_attr = search_icon.get_attribute("aria-hidden")
        if hidden_attr == "true":
            print("✅ Search icon has aria-hidden='true'")
        else:
            print(f"❌ Search icon missing aria-hidden='true', found: {hidden_attr}")

        # 3. Check Filter Button
        # The button has aria-label="Alternar filtros avançados"
        filter_button = page.get_by_label("Alternar filtros avançados")

        expect(filter_button).to_be_visible()
        print("✅ Filter button found with label 'Alternar filtros avançados'")

        # Check aria-expanded
        expanded = filter_button.get_attribute("aria-expanded")
        print(f"Filter button aria-expanded: {expanded}")
        if expanded != "false":
             print("❌ Expected aria-expanded='false' initially")

        # 4. Click Filter Button
        print("Clicking filter button...")
        filter_button.click()

        # Check aria-expanded again
        # Small wait for state update if needed, but playwright auto-waits for actionability.
        # Attribute update might be instant or require small wait.
        page.wait_for_timeout(500)
        expanded_after = filter_button.get_attribute("aria-expanded")
        print(f"Filter button aria-expanded after click: {expanded_after}")
        if expanded_after == "true":
            print("✅ Filter button aria-expanded toggled to 'true'")
        else:
            print("❌ Filter button aria-expanded did not toggle to 'true'")

        # Check if panel is visible
        panel = page.locator("#advanced-filters-panel")
        expect(panel).to_be_visible()
        print("✅ Advanced filters panel is visible")

        # 5. Type in search to see Clear button
        print("Typing in search...")
        search_input.fill("Teste")

        # Clear button should appear
        clear_button = page.get_by_label("Limpar busca")
        expect(clear_button).to_be_visible()
        print("✅ Clear button appeared with label 'Limpar busca'")

        # Take screenshot
        page.screenshot(path="/home/jules/verification/patients_filters.png")
        print("📸 Screenshot saved to /home/jules/verification/patients_filters.png")

        browser.close()

if __name__ == "__main__":
    verify_a11y()
