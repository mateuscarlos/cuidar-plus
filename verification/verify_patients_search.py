from playwright.sync_api import sync_playwright, expect
import os
import time

def verify_patients_search(page):
    # Simulate auth
    page.goto("http://localhost:8080")
    page.evaluate("localStorage.setItem('token', 'mock-token')")
    page.evaluate("localStorage.setItem('user', JSON.stringify({id: '1', name: 'Test User', role: 'admin'}))")

    # Navigate to patients page
    page.goto("http://localhost:8080/patients")

    # Wait for page to load
    page.wait_for_selector("h2:has-text('Pacientes')")

    # Find search input
    search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")
    expect(search_input).to_be_visible()

    # Type in search
    search_input.fill("Maria")

    # Wait for debounce (500ms) + mock delay (500ms)
    time.sleep(1.5)

    # Take screenshot
    page.screenshot(path="verification/patients_search.png")

    print("Verification complete. Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_patients_search(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
