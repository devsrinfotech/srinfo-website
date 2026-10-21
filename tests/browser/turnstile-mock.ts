import type { Page } from '@playwright/test';

// No real challenge is solved and no request reaches Cloudflare or the live CRM.
export async function mockTurnstile(page: Page) {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js**', route => route.fulfill({
    contentType: 'application/javascript', body: `
      (() => {
        let options, control, box, sequence = 0;
        window.__turnstileMock = { resets: 0,
          expire: () => options['expired-callback'](),
          error: () => options['error-callback'](),
        };
        window.turnstile = {
          render(container, config) {
            options = config;
            window.__turnstileMock.size = config.size;
            box = document.createElement('div');
            box.style.cssText = 'box-sizing:border-box;border:1px solid #bacadb;border-radius:4px;padding:12px;background:#f7f9fc;color:#123454;';
            box.style.width = config.size === 'compact' ? '150px' : '100%';
            box.style.minWidth = config.size === 'compact' ? '150px' : '300px';
            box.style.minHeight = config.size === 'compact' ? '140px' : '65px';
            const label = document.createElement('small');
            label.textContent = 'Turnstile test double (no live check)';
            control = document.createElement('button');
            control.type = 'button'; control.textContent = 'Verify test check';
            control.addEventListener('click', () => {
              control.disabled = true; control.textContent = 'Test verification complete';
              config.callback('mock-single-use-token-' + (++sequence));
            });
            box.append(label, control); container.append(box);
            return 'inventory-test-widget';
          },
          remove() { box.remove(); },
          reset(id) {
            if (id !== 'inventory-test-widget') throw new Error('Wrong widget reset');
            window.__turnstileMock.resets++;
            control.disabled = false; control.textContent = 'Verify test check';
          }
        };
      })();`,
  }));
}
