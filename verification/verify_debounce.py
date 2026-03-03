import os
import time
import subprocess
import signal
from playwright.sync_api import sync_playwright

def verify_debounce():
    print("Starting Vite server...")
    server = subprocess.Popen(
        ["pnpm", "dev", "--port", "8080"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )

    # Wait for server to start
    time.sleep(10)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to patients page...")
            page.goto("http://localhost:8080/patients")
            page.wait_for_load_state("networkidle")

            # Find the search input
            search_input = page.get_by_placeholder("Buscar por nome, prontuário ou CPF...")

            # Simulate typing
            print("Typing in search box...")
            search_input.fill("silva")

            time.sleep(2) # wait for debounce

            print("Taking screenshot...")
            page.screenshot(path="verification/debounce_screenshot.png")
            print("Screenshot saved to verification/debounce_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
            os.killpg(os.getpgid(server.pid), signal.SIGTERM)

if __name__ == "__main__":
    verify_debounce()
