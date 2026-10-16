import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landmarks and learning progress expose meaningful accessible names',async({page})=>{
 await page.goto('#learn');
 await expect(page.getByRole('main',{name:'Make Terraform make sense.'})).toBeVisible();
 const progress=page.getByRole('progressbar',{name:'Learning progress'});
 await expect(progress).toHaveAttribute('aria-valuenow','0');await expect(progress).toHaveAttribute('aria-valuemax','8');await expect(progress).toHaveAttribute('aria-valuetext','0 of 8 lessons marked complete');
 await page.goto('#lesson/read-plan');
 await expect(page.getByRole('group',{name:'You see an unexplained replacement. What is the next step?'})).toBeVisible();
 await expect(page.getByRole('radio',{name:'Investigate the reason and target before approval'})).toBeVisible();
});

test('modal traps keyboard focus, restores its opener and has no automated accessibility violations',async({page})=>{
 await page.goto('');const opener=page.getByRole('button',{name:'Open search'});await opener.click();
 const dialog=page.getByRole('dialog',{name:'What can we help you find?'});await expect(dialog).toBeVisible();
 await page.getByRole('searchbox',{name:'Search lessons, problems and commands'}).fill('state lock');
 for(let n=0;n<12;n++){await page.keyboard.press(n%3===0?'Shift+Tab':'Tab');expect(await page.evaluate(()=>!!document.activeElement.closest('#search-dialog'))).toBe(true);}
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(opener).toBeFocused();
 await opener.click();await page.locator('#global-search').fill('state lock');await page.locator('.search-result').first().click();await expect(page.getByRole('main',{name:'Terraform cannot acquire the state lock'})).toBeFocused();
});

test('diagnoses use a concise live summary while detailed evidence stays available',async({page})=>{
 await page.goto('#fix');const status=page.getByRole('status',{name:'Diagnostic summary'});
 await page.locator('#error-input').fill('Error: Error acquiring the state lock\nsynthetic-private-marker');await page.getByRole('button',{name:'Find relevant guidance'}).click();
 await expect(status).toContainText('First: Terraform cannot acquire the state lock');await expect(status).not.toContainText('synthetic-private-marker');
 await expect(page.getByRole('region',{name:'Diagnostic guidance'})).toContainText('MATCHED DIAGNOSTIC');await expect(page.locator('#analysis-results')).not.toHaveAttribute('aria-live','polite');
 await page.getByRole('button',{name:'Clear',exact:true}).click();await expect(status).toContainText('cleared');
 await expect(page.getByRole('status',{name:'Notification'})).toContainText('cleared');
});

test('blocked browser storage preserves the current visit without promising saved progress',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage disabled','SecurityError');}}));
 await page.goto('#lesson/read-plan');await page.locator('[data-exercise="read-plan"][value="2"]').check();await page.getByRole('button',{name:'Check my understanding'}).click();await page.locator('[data-complete="read-plan"]').click();
 await expect(page.getByRole('status',{name:'Notification'})).toContainText('for this visit');await page.goto('#learn');await expect(page.getByRole('progressbar',{name:'Learning progress'})).toHaveAttribute('aria-valuenow','1');
 await page.locator('#theme-toggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');expect(errors).toEqual([]);
 await page.reload();await expect(page.getByRole('progressbar',{name:'Learning progress'})).toHaveAttribute('aria-valuenow','0');
});

test('reduced motion and keyboard-only lesson feedback remain usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('#lesson/read-plan');
 expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
 const radio=page.getByRole('radio',{name:'Investigate the reason and target before approval'});await radio.focus();await page.keyboard.press('Space');await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Check my understanding'})).toBeFocused();await page.keyboard.press('Enter');
 await expect(page.getByRole('status',{name:'Understanding feedback'})).toContainText('That’s right');await expect(page.locator('[data-complete="read-plan"]')).toBeEnabled();
 await page.goto('#fix');const duration=await page.locator('.problem-card').first().evaluate(el=>getComputedStyle(el).transitionDuration);expect(duration).toBe('0s');
});
