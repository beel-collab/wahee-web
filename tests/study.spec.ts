import {test,expect} from '@playwright/test';
import path from 'node:path';

test('desktop tafsir remains beside an interactive Quran and can expand',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1');
 await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();
 const panel=page.locator('.tafsir-panel');await expect(panel).toHaveAttribute('role','region');await expect(panel.locator('.tafsir-prose')).not.toBeEmpty();
 await expect(page.locator('.reader-surface')).not.toHaveAttribute('inert');
 await page.getByRole('button',{name:'Bookmark ayah 2',exact:true}).click();await expect(page.getByRole('button',{name:'Bookmark ayah 2',exact:true})).toHaveAttribute('aria-pressed','true');
 await panel.getByRole('button',{name:'Expand tafsir'}).click();await expect(panel).toHaveAttribute('role','dialog');await expect(page.locator('.reader-surface')).toHaveAttribute('inert','');
 await panel.getByRole('button',{name:'Dock tafsir'}).click();await expect(panel).toHaveAttribute('role','region');
 const before=await panel.locator('.tafsir-prose').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));await panel.getByRole('button',{name:'Increase tafsir text size'}).click();await expect.poll(()=>panel.locator('.tafsir-prose').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBe(before+2);
 await panel.getByRole('button',{name:'Close tafsir'}).click();await expect(panel).toHaveCount(0);await expect(page).not.toHaveURL(/tafsir=/);
});

test('tafsir keeps separate scroll positions for sources and reopening',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/2#ayah-143');await page.getByRole('button',{name:'Tafsir ayah 143',exact:true}).click();
 const panel=page.locator('.tafsir-panel'),body=panel.locator('.tafsir-body');await expect(panel.locator('.tafsir-prose')).not.toBeEmpty();
 await body.evaluate(el=>{el.scrollTop=450;el.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await panel.getByRole('combobox',{name:'Tafsir source'}).selectOption('taqi');await expect(panel.locator('.tafsir-prose')).not.toBeEmpty();await body.evaluate(el=>{el.scrollTop=250;el.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await panel.getByRole('combobox',{name:'Tafsir source'}).selectOption('maududi');await expect.poll(()=>body.evaluate(el=>el.scrollTop)).toBe(450);
 await panel.getByRole('button',{name:'Close tafsir'}).click();await expect(panel).toHaveCount(0);
 await page.getByRole('button',{name:'Tafsir ayah 143',exact:true}).click();await expect.poll(()=>body.evaluate(el=>el.scrollTop)).toBe(450);
});

test('mobile study supports browser Back and preserves the reading position',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/surah/1#ayah-7');await page.evaluate(()=>document.fonts.ready);const trigger=page.getByRole('button',{name:'Tafsir ayah 7',exact:true});await expect(trigger).toBeInViewport();await trigger.scrollIntoViewIfNeeded();
 const scroll=await page.evaluate(()=>scrollY);await trigger.click();const panel=page.locator('.tafsir-panel');await expect(panel).toHaveAttribute('role','dialog');await expect(panel.locator('.tafsir-prose')).not.toBeEmpty();await expect(page).toHaveURL(/tafsir=7/);
 await page.goBack();await expect(panel).toHaveCount(0);await expect(trigger).toBeFocused();await expect.poll(async()=>Math.abs(await page.evaluate(()=>scrollY)-scroll)).toBeLessThan(4);
 await trigger.click();await panel.getByRole('button',{name:'Back to Quran'}).click();await expect(panel).toHaveCount(0);await expect(trigger).toBeInViewport();
});

test('direct tafsir links have a working return to the Quran',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/surah/1?tafsir=1');await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.getByRole('button',{name:'Back to Quran'}).click();await expect(page.locator('.tafsir-panel')).toHaveCount(0);await expect(page).toHaveURL(/\/surah\/1$/);await expect(page.locator('article')).toHaveCount(7);
});

test('word meanings are inline and details are revealed only on selection',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1');await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();const words=page.getByRole('region',{name:'Word by word 1:1'});await expect(words.locator('.word-unit')).toHaveCount(4);await expect(page.getByRole('dialog')).toHaveCount(0);await expect(words.locator('.word-detail-inline')).toHaveCount(0);
 await words.locator('.word-unit').first().click();await expect(words.getByRole('region',{name:'Word details'})).toContainText('ح م د');await words.getByRole('button',{name:'اردو',exact:true}).click();await expect(words.locator('.word-unit-meaning').first()).toHaveAttribute('lang','ur');await expect(words.locator('.word-unit-meaning').first()).toContainText('تعریف');
 await words.getByRole('button',{name:'Close word details'}).click();await expect(words.locator('.word-detail-inline')).toHaveCount(0);
});

test('mobile word roots use a compact sheet and restore word focus',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/surah/1');await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();const words=page.locator('.word-unit');await expect(words).toHaveCount(4);
 const positions=await words.evaluateAll(elements=>elements.slice(0,2).map(el=>el.getBoundingClientRect().right));expect(positions[0]).toBeGreaterThan(positions[1]);await words.first().click();const sheet=page.getByRole('dialog');await expect(sheet).toContainText('ح م د');expect(await sheet.evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(844*.76);await sheet.getByRole('button',{name:'Close word details'}).click();await expect(sheet).toHaveCount(0);await expect(words.first()).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test('word loading failures retain the ayah and can retry',async({page})=>{
 await page.goto('/surah/1');await page.route('**/api/v1/words/**',route=>route.fulfill({status:503,body:'unavailable'}));await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();const inline=page.locator('.inline-words');await expect(inline.getByRole('alert')).toBeVisible();await expect(inline.locator('.arabic')).not.toBeEmpty();await page.unroute('**/api/v1/words/**');await inline.getByRole('button',{name:'Try again'}).click();await expect(inline.locator('.word-unit')).toHaveCount(4);
});

test('capture responsive study redesign',async({page})=>{
 test.skip(process.env.WAHEE_STUDY_CAPTURES!=='1','Opt-in study captures');const dir=path.resolve('.impeccable/review');
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1');await page.getByRole('button',{name:'Switch to dark mode'}).click();await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'study-new-desktop.png'),fullPage:true});await page.screenshot({path:path.join(dir,'study-new-desktop-fold.png')});
 await page.getByRole('button',{name:'Close tafsir'}).click();await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();await expect(page.locator('.word-unit')).toHaveCount(4);await page.locator('.word-unit').first().click();await page.screenshot({path:path.join(dir,'words-new-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Close word details'}).click();await page.locator('.word-language').getByRole('button',{name:'اردو',exact:true}).click();await page.screenshot({path:path.join(dir,'words-new-mobile.png'),fullPage:true});await page.locator('.word-unit').first().click();await page.screenshot({path:path.join(dir,'word-detail-mobile.png')});await page.getByRole('button',{name:'Close word details'}).click();
 await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.screenshot({path:path.join(dir,'study-new-mobile.png')});
 await page.setViewportSize({width:719,height:724});await page.screenshot({path:path.join(dir,'study-new-user-719.png')});
});
test('resizing a desktop study session does not stack mobile study surfaces',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1');await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();await expect(page.locator('.word-unit')).toHaveCount(4);await page.locator('.word-unit').first().click();await expect(page.locator('.word-detail-inline')).toBeVisible();await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.setViewportSize({width:390,height:844});await expect(page.locator('.tafsir-panel')).toHaveAttribute('role','dialog');await expect(page.locator('.word-sheet')).toHaveCount(0);await page.getByRole('button',{name:'Back to Quran'}).click();await expect(page.locator('.tafsir-panel')).toHaveCount(0);await expect(page.locator('.word-sheet')).toHaveCount(0);
});
