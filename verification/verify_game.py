from playwright.sync_api import sync_playwright
import os
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Enable console logging
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    # Load the game
    file_path = os.path.abspath("index.html")
    print(f"Loading: file://{file_path}")
    page.goto(f"file://{file_path}")

    # Wait for JS to execute and create the game instance
    try:
        # Check if window.game is defined
        page.wait_for_function("() => window.game !== undefined", timeout=5000)
        print("Game instance found.")
    except Exception as e:
        print(f"Game instance NOT found: {e}")

    # 1. Capture Cinematic Intro
    try:
        # Wait longer for overlay
        page.wait_for_selector("#cinematic-overlay", state="visible", timeout=10000)
        print("Cinematic overlay visible.")

        # Take screenshot of intro
        page.screenshot(path="verification/native_intro.png")
        print("Intro Captured: verification/native_intro.png")

        # Check title text
        title = page.inner_text("#cinematic-overlay h1")
        print(f"Intro Title: {title}")

    except Exception as e:
        print(f"Intro wait failed: {e}")
        # Take a debug screenshot to see what's on screen
        page.screenshot(path="verification/debug_fail.png")
        print("Saved debug_fail.png")

    # 2. Wait for Gameplay (Overlay gone)
    try:
        # We can simulate time passing by evaluating script if needed, but let's wait naturally first
        # The intro is ~5 seconds.
        print("Waiting for intro to finish...")
        page.wait_for_selector("#cinematic-overlay", state="hidden", timeout=15000)
        print("Gameplay Started (Overlay hidden).")

        # 3. Simulate High-Speed Gameplay
        # Force Adrenaline check
        page.evaluate("window.game.adrenaline = 50")
        page.evaluate("window.game.player.velocity.z = 20") # Fake movement

        # Allow a frame to render
        page.wait_for_timeout(1000)

        page.screenshot(path="verification/native_gameplay.png")
        print("Gameplay Captured: verification/native_gameplay.png")

        crosshair_text = page.inner_text("#crosshair")
        print(f"Crosshair Text: {crosshair_text}")

    except Exception as e:
        print(f"Gameplay wait failed: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
