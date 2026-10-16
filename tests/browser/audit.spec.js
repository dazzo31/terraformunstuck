import {test,expect} from '@playwright/test';

test('skip link focuses content without replacing the current topic',async({page})=>{
 await page.goto('#lesson/read-plan');
 const heading=await page.locator('main h1').textContent();
 await page.locator('.skip-link').focus();await page.keyboard.press('Enter');
 await expect(page.locator('main')).toBeFocused();
 await expect(page.locator('main h1')).toHaveText(heading);
 await expect(page).toHaveURL(/#lesson\/read-plan$/);
});

test('malformed routes show a fallback without runtime errors',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of ['fix/extra','lesson/read-plan/extra','home/','%ZZ','constructor','__proto__']){
  await page.goto('#'+route);await expect(page.locator('main')).toContainText('Let’s get you back on track');
 }
 expect(errors).toEqual([]);
});

test('stored progress counts unique recognised lessons only',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('tfu-progress',JSON.stringify([...Array(20).fill('read-plan'),'missing',null,{}])));
 await page.goto('#learn');await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
});

test('searching the current topic focuses its content',async({page})=>{
 await page.goto('#lesson/read-plan');await page.locator('#search-toggle').click();
 await page.locator('#global-search').fill('read plan');
 await page.locator('#search-results a[href="#lesson/read-plan"]').click();
 await expect(page.locator('#search-dialog')).not.toBeVisible();await expect(page.locator('main')).toBeFocused();
});

test('blocked storage reset describes its persistence limit',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage disabled','SecurityError');}}));
 await page.goto('#about');await page.locator('#reset-preferences').click();
 await expect(page.locator('#toast')).toContainText('could not be cleared');
});

test('copy uses displayed command text and share excludes queries and diagnostic drafts',async({page})=>{
 await page.addInitScript(()=>{window.copied=[];Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied.push(text);}},configurable:true});});
 await page.goto('?private-query-marker#fix');await page.locator('#error-input').fill('private-draft-marker');
 await page.goto('#recipe/not-found');
 const command=page.locator('.command').first();const text=await command.locator('code').textContent();
 await command.locator('[data-copy]').click();expect(await page.evaluate(()=>window.copied.at(-1))).toBe(text);
 await page.locator('[data-share]').click();const shared=await page.evaluate(()=>window.copied.at(-1));
 expect(shared).toMatch(/#recipe\/not-found$/);expect(shared).not.toContain('private-');expect(new URL(shared).search).toBe('');
});
