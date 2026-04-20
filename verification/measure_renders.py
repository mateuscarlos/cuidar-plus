from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        logs = []
        page.on("console", lambda msg: logs.append(msg.text) if "[PERF]" in msg.text else None)

        print("Navigating to /patients...")
        page.goto("http://localhost:8080/patients")

        # Wait for "Novo Paciente" button
        page.wait_for_selector("text=Novo Paciente")

        # Wait for list to load (hopefully mock data works now)
        time.sleep(3)

        print(f"Initial logs (loading): {len(logs)}")
        logs.clear() # Clear initial render logs

        print("Clicking 'Novo Paciente'...")
        page.click("text=Novo Paciente")

        # Wait for modal to appear (wait for title)
        try:
            page.wait_for_selector("text=Cadastro de Paciente", timeout=5000)
            print("Modal opened.")
        except:
            print("Modal did not open or selector not found.")
            page.screenshot(path="verification/modal_fail.png")

        # Wait a bit for renders to happen
        time.sleep(2)

        print(f"Logs after opening modal: {len(logs)}")

        # Take a screenshot to verify list is behind modal
        page.screenshot(path="verification/baseline.png")

        browser.close()

if __name__ == "__main__":
    run()
