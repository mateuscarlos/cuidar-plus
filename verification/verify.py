import os
import subprocess
import time
from playwright.sync_api import sync_playwright

def verify_tooltips():
    print("Starting Vite server...")
    # Start Vite server
    server_process = subprocess.Popen(
        ["pnpm", "dev", "--port", "8080"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )

    # Give it a few seconds to start
    time.sleep(5)

    print("Running Playwright script...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 375, 'height': 812}) # Mobile viewport
            page = context.new_page()

            # Go to patients page
            page.goto("http://localhost:8080/patients")
            time.sleep(2)

            # Hover over filter button
            filter_btn = page.get_by_label("Filtros")
            filter_btn.hover()
            time.sleep(1) # wait for tooltip animation

            # Take screenshot of tooltip on filter button
            page.screenshot(path="verification/filter-tooltip.png")

            # Check mobile menu button
            menu_btn = page.get_by_label("Abrir menu")
            menu_btn.hover()
            time.sleep(1) # wait for tooltip animation

            # Take screenshot of mobile menu button tooltip
            page.screenshot(path="verification/menu-tooltip.png")

            browser.close()
            print("Verification complete.")

    finally:
        print("Stopping Vite server...")
        os.killpg(os.getpgid(server_process.pid), 15)

if __name__ == "__main__":
    verify_tooltips()
