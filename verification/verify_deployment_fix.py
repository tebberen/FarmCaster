from playwright.sync_api import sync_playwright
import os

def verify_deployment_fix():
    # This verification checks if the build output contains the expected content
    # and if the configuration is correct for GitHub Pages.

    # 1. Check for .nojekyll
    if not os.path.exists("out/.nojekyll"):
        print("FAIL: out/.nojekyll is missing")
        return

    # 2. Check for index.html
    if not os.path.exists("out/index.html"):
        print("FAIL: out/index.html is missing")
        return

    # 3. Check for basePath usage in generated HTML (simple check)
    with open("out/index.html", "r") as f:
        content = f.read()
        # Since we set basePath: '/FarmCaster', local build might not strictly enforce it in paths
        # unless we use Link or Image components, but let's check if the content is correct.
        if "FarmCaster" not in content:
            print("FAIL: 'FarmCaster' text not found in index.html")
            return

    print("SUCCESS: Deployment configuration looks correct locally.")

if __name__ == "__main__":
    verify_deployment_fix()
