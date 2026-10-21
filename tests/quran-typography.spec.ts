import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

test('Quran preserves source text, recitation marks, and the ruku code drawn by Noorehira',async({page,request})=>{
 for(const key of ['1:7','2:7','2:20','11:83']){const response=await request.get(`/api/v1/verses/${key}`);expect(response.ok()).toBeTruthy();const {data}=await response.json();expect(data.arabic).toContain('٪')}
 await page.goto('/surah/1#ayah-5');await expect(page.locator('#ayah-5 .arabic')).toContainText('اِہۡدِ');await expect(page.locator('#ayah-1 .arabic')).toContainText('ۙ');await expect(page.locator('#ayah-7 .arabic')).toContainText('٪');
});
test('Quran renders its two-eyed haa font, including word meanings, without changing Hadith',async({page})=>{
 await page.goto('/surah/1#ayah-5');await page.evaluate(()=>document.fonts.ready);
 const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');const {root}=await session.send('DOM.getDocument');
 for(const selector of ['#ayah-5 .arabic','#ayah-7 .arabic']){const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector});const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});expect(fonts.some((f:{familyName:string;isCustomFont:boolean;glyphCount:number})=>f.familyName==='noorehira'&&f.isCustomFont&&f.glyphCount>0)).toBeTruthy();expect(fonts.filter((f:{familyName:string;glyphCount:number})=>f.glyphCount>0&&f.familyName!=='noorehira')).toEqual([])}
 await page.getByRole('button',{name:'Word meanings ayah 5',exact:true}).click();await expect(page.locator('#ayah-5 .word-unit-arabic').first()).toBeVisible();expect(await page.locator('#ayah-5 .word-unit-arabic').first().evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Noorehira');await expect(page.locator('#ayah-5 .word-unit-arabic').first()).toContainText('ہ');
 await page.goto('/hadith/bukhari/1');await page.getByRole('combobox',{name:'Hadith translation'}).selectOption('ar');expect(await page.locator('.hadith-arabic-text').evaluate(el=>getComputedStyle(el).fontFamily)).not.toContain('Noorehira');
});
test('capture native haa forms and ruku markers at supported sizes',async({page})=>{
 test.skip(!process.env.WAHEE_HAA_CAPTURES,'Opt-in typography evidence');mkdirSync('.impeccable/review',{recursive:true});await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});await page.goto('/surah/1#ayah-5');await page.evaluate(()=>document.fonts.ready);
 await page.locator('#ayah-5 .arabic').screenshot({path:'.impeccable/review/noorehira-initial.png'});await page.locator('#ayah-6 .arabic').screenshot({path:'.impeccable/review/noorehira-medial.png'});
 for(const viewport of [{width:1440,height:1000,name:'desktop'},{width:719,height:724,name:'user-719'},{width:390,height:844,name:'mobile'}]){await page.setViewportSize(viewport);await page.locator('#ayah-5').scrollIntoViewIfNeeded();await page.screenshot({path:`.impeccable/review/noorehira-${viewport.name}.png`});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy()}
 await page.locator('#ayah-7').scrollIntoViewIfNeeded();await page.screenshot({path:'.impeccable/review/noorehira-ruku.png'});
 await page.getByRole('button',{name:'Word meanings ayah 5',exact:true}).click();await page.locator('#ayah-5').scrollIntoViewIfNeeded();await page.screenshot({path:'.impeccable/review/noorehira-words.png'});
 await page.goto('/quran');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'.impeccable/review/noorehira-directory.png'});
 await page.goto('/surah/1#ayah-5');await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:'dark',exact:true}).click();await page.getByRole('button',{name:'Close settings'}).click();await page.locator('#ayah-5').scrollIntoViewIfNeeded();await page.screenshot({path:'.impeccable/review/noorehira-dark-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Tafsir ayah 5',exact:true}).click();await expect(page.locator('.tafsir-panel')).toBeVisible();await page.screenshot({path:'.impeccable/review/noorehira-dark-study.png'});
});
