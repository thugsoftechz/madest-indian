from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Enable console logging
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    # Load the game
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # 1. Capture Cinematic Intro
    try:
        page.wait_for_selector("#cinematic-overlay", state="visible", timeout=5000)
        page.screenshot(path="verification/native_intro.png")
        print("Intro Captured.")
    except Exception as e:
        print(f"Intro wait failed: {e}")

    # 2. Wait for Gameplay
    try:
        page.wait_for_selector("#cinematic-overlay", state="hidden", timeout=10000)
        print("Gameplay Started.")

        # 3. Simulate High-Speed Gameplay
        page.evaluate("window.game.adrenaline = 50")
        page.screenshot(path="verification/native_gameplay.png")
        print("Gameplay Captured.")
    except Exception as e:
        print(f"Gameplay wait failed: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
