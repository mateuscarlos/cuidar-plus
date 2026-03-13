import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test('chart sanitization prevents injection', async ({ page }) => {
    // Generate an HTML file to test our component logic
    const htmlPath = path.resolve(process.cwd(), 'e2e', 'test.html');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Chart Test</title>
        <script>
            function sanitizeForStyle(value) {
                if (!value) return "";
                return value.replace(/[<>;}\\[\\]"']/g, "");
            }

            const maliciousId = 'chart-id"><script>alert(1)</script>';
            const maliciousKey = 'key;} body { background: red; }';
            const maliciousColor = 'red;</style><script>document.body.innerHTML="<h1>XSS VULNERABILITY</h1>"</script><style>';
        </script>
    </head>
    <body>
        <div id="output"></div>
        <script>
            document.getElementById('output').innerHTML =
                'Id: ' + sanitizeForStyle(maliciousId) + '<br>' +
                'Key: ' + sanitizeForStyle(maliciousKey) + '<br>' +
                'Color: ' + sanitizeForStyle(maliciousColor);
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync(htmlPath, htmlContent);

    await page.goto(`file://${htmlPath}`);

    await page.waitForSelector('#output');

    const output = await page.locator('#output').innerText();

    // Ensure scripts aren't in the output string (the brackets should be removed)
    expect(output).toContain('Id: chart-idscriptalert(1)/script');
    expect(output).toContain('Key: key body { background: red: }');
    expect(output).toContain('Color: red/stylescriptdocument.body.innerHTML=h1XSS VULNERABILITY/h1/scriptstyle');

    // Check that there is no H1 tag on the page created by XSS
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(0);
});
