from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Load the game
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # 1. Verify Initial Load (HUD)
    page.wait_for_selector("#objective-text")
    print("HUD Loaded.")

    # 2. Simulate User Interaction (Click to lock pointer - though playwright can't fully emulate pointer lock visual logic easily, it triggers the event)
    page.mouse.click(100, 100)

    # 3. Wait for game loop to run a bit (World gen, traffic spawn)
    page.wait_for_timeout(3000)

    # 4. Screenshot: Intro State
    page.screenshot(path="verification/aaa_intro.png")
    print("Intro Screenshot Saved.")

    # 5. Simulate Interaction (Press 'E')
    page.keyboard.press("e")
    page.wait_for_timeout(1000)

    # 6. Verify Dialogue Overlay appears
    dialogue_visible = page.is_visible("#dialogue-overlay")
    print(f"Dialogue Triggered: {dialogue_visible}")

    if dialogue_visible:
        page.screenshot(path="verification/aaa_dialogue.png")
        print("Dialogue Screenshot Saved.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
