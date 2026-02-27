
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_patient_search_debounce():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        # Inject mock authentication
        await context.add_init_script("""
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
        """)

        page = await context.new_page()

        try:
            # Navigate to patients page
            await page.goto("http://localhost:8080/patients")

            # Wait for page load
            await expect(page.get_by_text("Pacientes")).to_be_visible()

            # Find search input
            search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")
            await expect(search_input).to_be_visible()

            # Type slowly to trigger multiple potential calls if not debounced
            await search_input.type("Silva", delay=100)

            # Wait for results to update (debouncing delay is 500ms)
            await page.wait_for_timeout(1000)

            # Take screenshot
            await page.screenshot(path="verification/debounce_verification.png")

            print("Verification complete. Screenshot saved to verification/debounce_verification.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            await page.screenshot(path="verification/error_screenshot.png")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_patient_search_debounce())
