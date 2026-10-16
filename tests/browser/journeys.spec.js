import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {lessons,recipes,workflows} from '../../dist/assets/js/content.js';
test('learn and fix are visible entry points with working navigation',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('');await expect(page.getByRole('heading',{level:1})).toContainText('A clearer plan');
 for(const link of await page.locator('header nav a').all()){const box=await link.boundingBox();expect(box.x>=0&&box.x+box.width<=page.viewportSize().width+1,'Navigation item must remain visible').toBe(true);}
 await page.getByRole('link',{name:'Learn Terraform',exact:true}).click();await expect(page).toHaveURL(/#learn$/);
 await page.goBack();await expect(page.getByRole('heading',{level:1})).toContainText('A clearer plan');
 await page.getByRole('link',{name:'Fix a problem',exact:true}).first().click();await expect(page.locator('#triage-phase')).toBeVisible();
 expect(errors).toEqual([]);await page.goto('');await page.screenshot({path:`test-results/home-${info.project.name}.png`,fullPage:true});
});
test('all topic routes render, preserve one heading and avoid horizontal overflow',async({page})=>{
 for(const route of [...lessons.map(x=>'lesson/'+x.id),...recipes.map(x=>'recipe/'+x.id),...workflows.map(x=>'workflow/'+x.id)]){
  await page.goto('#'+route);await expect(page.locator('main h1')).toHaveCount(1);await expect(page.locator('main')).not.toContainText('undefined');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),route).toBe(true);
 }
});
for(const theme of ['light','dark'])test(`core journeys pass automated accessibility checks in ${theme} theme`,async({page},info)=>{
 await page.goto('');if(theme==='dark')await page.locator('#theme-toggle').click();
 for(const route of ['home','learn','lesson/mental-model','fix','recipe/state-locked','workflow/start','reference','about']){
  await page.goto('#'+route);await expect(page.locator('main h1')).toHaveCount(1);
  if(route==='home'&&theme==='dark')await page.screenshot({path:`test-results/home-dark-${info.project.name}.png`,fullPage:true});
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
});
test('keyboard search closes with Escape and skip link reaches content',async({page})=>{
 await page.goto('');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 await page.keyboard.press('Control+k');await expect(page.locator('#global-search')).toBeFocused();await page.locator('#global-search').fill('state lock');
 await expect(page.locator('.search-result').first()).toContainText('state lock');await page.keyboard.press('Escape');await expect(page.locator('#search-dialog')).not.toBeVisible();
});
test('triage preserves unknown/active lock ownership and navigates to the matching guide',async({page},info)=>{
 await page.goto('#fix');await page.locator('#triage-phase').selectOption('plan');await page.locator('#triage-symptom').selectOption('state-locked');
 await expect(page.locator('#triage-result')).toContainText('owner is unknown');await page.locator('#triage-owner').selectOption('active');await expect(page.locator('#triage-result')).toContainText('Do not remove');await page.screenshot({path:`test-results/triage-${info.project.name}.png`,fullPage:true});
 await page.locator('#triage-result a').click();await expect(page).toHaveURL(/#recipe\/state-locked$/);
 await page.goBack();await expect(page.locator('#triage-owner')).toHaveValue('active');
});
test('understanding feedback gates new lesson completion',async({page},info)=>{
 await page.goto('#lesson/read-plan');const complete=page.locator('[data-complete="read-plan"]');await expect(complete).toBeDisabled();
 await page.locator('[data-exercise="read-plan"][value="0"]').check();await page.getByRole('button',{name:'Check my understanding'}).click();await expect(page.locator('#exercise-feedback')).toContainText('Have another look');await expect(complete).toBeDisabled();
 await page.locator('[data-exercise="read-plan"][value="2"]').check();await page.getByRole('button',{name:'Check my understanding'}).click();await expect(complete).toBeEnabled();await page.screenshot({path:`test-results/lesson-${info.project.name}.png`,fullPage:true});await complete.click();
 await page.reload();await expect(complete).toContainText('Marked complete');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tfu-progress')))).toContain('read-plan');
});
test('diagnostics rank evidence, keep independent contexts and clear input',async({page})=>{
 await page.goto('#fix');await page.locator('details').filter({hasText:'Add context'}).locator('summary').click();
 await page.locator('#context-provider').selectOption('azure');await page.locator('#context-backend').selectOption('s3');
 await page.locator('#error-input').fill('Error: Failed to query available provider packages\nno available releases match the given constraints');await page.locator('#analyse').click();
 await expect(page.locator('.result-card h3').first()).toHaveText('Provider versions cannot be resolved');await expect(page.locator('#analysis-results')).toContainText('RELATED GENERIC MESSAGE');await expect(page.locator('#analysis-results')).toContainText('AzureRM provider');await expect(page.locator('#analysis-results')).toContainText('S3 backend');
 await page.locator('#advanced-mode').click();await expect(page.locator('#error-input')).not.toHaveValue('');await page.locator('#clear-input').click();await expect(page.locator('#error-input')).toHaveValue('');await expect(page.locator('#analysis-results')).toBeEmpty();
});
test('pasted private marker stays out of requests, storage, URLs and executable DOM',async({page})=>{
 const marker='private-marker-7391';const requests=[];page.on('request',r=>requests.push(r.url()+' '+(r.postData()??'')));
 await page.goto('#fix');await page.locator('#error-input').fill('Error: Error acquiring the state lock\n<img src=x onerror="window.privateFailure=true">'+marker);await page.locator('#analyse').click();
 await page.getByRole('link',{name:'Learn',exact:true}).click();await page.getByRole('link',{name:'Fix a problem',exact:true}).first().click();await expect(page.locator('#error-input')).toContainText(marker);
 expect(await page.evaluate(()=>({x:window.privateFailure,storage:JSON.stringify({...localStorage,...sessionStorage})}))).toEqual({x:undefined,storage:'{}'});
 expect(requests.join('\n')).not.toContain(marker);expect(page.url()).not.toContain(marker);expect(await page.locator('main img').count()).toBe(0);
 await page.locator('#clear-input').click();await expect(page.locator('#error-input')).toHaveValue('');
});
test('simulator changes proposals and mode persists without losing the current route',async({page})=>{
 await page.goto('#lesson/mental-model');await page.locator('[data-scenario="rename"]').click();await expect(page.locator('#sim-output')).toContainText('1 to destroy');
 await page.locator('#advanced-mode').click();await expect(page.locator('.advanced-only')).toBeVisible();expect(page.url()).toContain('#lesson/mental-model');await page.locator('#theme-toggle').click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.locator('html')).toHaveAttribute('data-mode','advanced');
});
