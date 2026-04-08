from playwright.sync_api import sync_playwright, expect
import time

def verify_debounce():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate
        page.goto("http://localhost:8080/")

        # Inject auth
        page.evaluate("""
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('user', JSON.stringify({id: '1', name: 'Test User', email: 'test@example.com'}));
        """)

        page.goto("http://localhost:8080/patients")

        # Wait for page load
        try:
            # Wait for search input
            expect(page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")).to_be_visible(timeout=10000)
            print("Search input found.")

            # Wait for at least one patient name from mock
            expect(page.get_by_text("João Silva Santos")).to_be_visible(timeout=10000)
            print("Mock data loaded.")

        except Exception as e:
            print(f"Failed to load initial page: {e}")
            page.screenshot(path="verification/failed_load.png")
            browser.close()
            return

        # Find search input
        search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")

        # Take baseline screenshot
        page.screenshot(path="verification/1_baseline.png")

        # Type "Ana" (matches "Ana Carolina Ferreira")
        print("Typing 'Ana'...")
        search_input.fill("Ana")

        # Wait 100ms
        time.sleep(0.1)

        # Take screenshot - should show "Ana" in input, but list should still show "João Silva Santos" (old data)
        # Because debounce (500ms) hasn't fired yet.
        page.screenshot(path="verification/2_during_debounce.png")

        # Wait 1.5s
        print("Waiting for debounce + fetch...")
        time.sleep(1.5)

        # Take screenshot - should ONLY show "Ana Carolina Ferreira"
        page.screenshot(path="verification/3_after_debounce.png")

        print("Screenshots taken.")
        browser.close()

if __name__ == "__main__":
    verify_debounce()
