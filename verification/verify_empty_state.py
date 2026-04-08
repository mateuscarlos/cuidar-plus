from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Simulate authentication
        page.goto("http://localhost:8080/")
        page.evaluate("""
            localStorage.setItem('token', 'fake-token');
            localStorage.setItem('user', JSON.stringify({
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin',
                is_active: true
            }));
        """)

        # 2. Navigate to Patients page
        page.goto("http://localhost:8080/patients")

        # Wait for the list to load (skeleton gone)
        expect(page.get_by_text("Lista de Pacientes")).to_be_visible()

        # Take initial screenshot
        page.screenshot(path="verification/step1_list_loaded.png")
        print("Screenshot taken: step1_list_loaded.png")

        # 3. Type non-existent search term
        # Using placeholder since role might be ambiguous if multiple searchboxes exist (though usually one)
        # Or use get_by_role("searchbox")
        search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")
        search_input.fill("NonExistentPatientXYZ")

        # Wait a bit for debounce/update
        page.wait_for_timeout(1000)

        # Take screenshot after search
        page.screenshot(path="verification/step2_after_search.png")
        print("Screenshot taken: step2_after_search.png")

        # 4. Expect Empty State Text
        # Using partial text match or exact
        expect(page.get_by_text("Nenhum paciente encontrado")).to_be_visible()
        expect(page.get_by_text("Não encontramos pacientes com os filtros selecionados.")).to_be_visible()

        # 5. Expect Clear Filters Button
        # Use aria-label as the name
        clear_button = page.get_by_role("button", name="Limpar todos os filtros")
        expect(clear_button).to_be_visible()

        # 6. Click Clear Filters
        clear_button.click()

        # Wait for update
        page.wait_for_timeout(1000)

        # 7. Expect list to return (Empty state gone)
        expect(page.get_by_text("Não encontramos pacientes com os filtros selecionados.")).not_to_be_visible()

        # Take screenshot of restored list
        page.screenshot(path="verification/step3_restored_list.png")
        print("Screenshot taken: step3_restored_list.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error_state.png")
        print("Screenshot taken: error_state.png")
        raise e
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
