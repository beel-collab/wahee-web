import {test,expect} from '@playwright/test';
import path from 'node:path';
test('capture responsive Quran preview',async({page})=>{
 test.skip(process.env.WAHEE_SCREENSHOTS!=='1','Opt-in review captures');
 const dir=path.resolve('.impeccable/review');
 await page.setViewportSize({width:1440,height:1000});await page.goto('/quran');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'home-desktop.png')});await page.screenshot({path:path.join(dir,'home-full.png'),fullPage:true});
 await page.goto('/surah/1');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'desktop.png'),fullPage:true});
 await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.screenshot({path:path.join(dir,'study-desktop.png')});await page.getByRole('button',{name:'Close tafsir'}).click();
 await page.setViewportSize({width:390,height:844});await page.goto('/quran');await page.screenshot({path:path.join(dir,'home-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto('/surah/1');await page.getByRole('combobox',{name:'Translation edition'}).selectOption('urdu');await expect(page.locator('.translations').first()).toHaveAttribute('lang','ur');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();await expect(page.locator('.word-unit')).toHaveCount(4);await page.screenshot({path:path.join(dir,'study-mobile.png')});await page.getByRole('button',{name:'Close word by word 1:1'}).click();
 await page.setViewportSize({width:719,height:724});await page.goto('/surah/2');await expect(page.locator('.translations').first()).toHaveAttribute('lang','ur');await page.screenshot({path:path.join(dir,'user-719.png')});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/search?q=mercy');await page.getByRole('combobox',{name:'Search translation'}).selectOption('english');await expect(page.locator('.search-result').first()).toBeVisible();await page.screenshot({path:path.join(dir,'search-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.goto('/search?tab=topics&chapter=2');await expect(page.locator('.topic-result').first()).toBeVisible();await page.screenshot({path:path.join(dir,'topics-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('capture corrected Quran typography and neutral dark mode',async({page})=>{
 test.skip(process.env.WAHEE_SCREENSHOTS!=='1','Opt-in review captures');
 const dir=path.resolve('.impeccable/review');
 await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'font-light-desktop.png'),fullPage:true});
 await page.getByRole('button',{name:'Switch to dark mode'}).click();await page.screenshot({path:path.join(dir,'dark-desktop.png'),fullPage:true});await page.screenshot({path:path.join(dir,'dark-preview.png')});
 await page.getByRole('button',{name:'Tafsir ayah 1',exact:true}).click();await expect(page.locator('.tafsir-prose')).not.toBeEmpty();await page.screenshot({path:path.join(dir,'dark-study-desktop.png')});await page.getByRole('button',{name:'Close tafsir'}).click();
 await page.setViewportSize({width:390,height:844});await page.getByRole('combobox',{name:'Translation edition'}).selectOption('urdu');await expect(page.locator('.translations').first()).toHaveAttribute('lang','ur');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'dark-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Word meanings ayah 1',exact:true}).click();await expect(page.locator('.word-unit')).toHaveCount(4);await page.screenshot({path:path.join(dir,'dark-study-mobile.png')});expect(await page.locator('.inline-words').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
});
