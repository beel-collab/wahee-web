import {test,expect} from '@playwright/test';
test('all surahs open real content and directory filters by name or number',async({page})=>{
 await page.goto('/quran');await expect(page.locator('.surah-card')).toHaveCount(114);
 await page.getByRole('combobox',{name:'Sort surahs'}).selectOption('descending');await expect(page.locator('.surah-card').first()).toHaveAttribute('href','/surah/114');
 await page.getByRole('searchbox',{name:'Search surahs'}).fill('Baqara');await expect(page.locator('.surah-card')).toHaveCount(1);await page.locator('.surah-card').click();await expect(page).toHaveURL(/\/surah\/2$/);await expect(page.locator('article')).toHaveCount(30);await expect(page.locator('.hero h1')).toHaveText('Al-Baqara');
});
test('juz navigation opens the correct passage and resume shortcut remembers reading',async({page})=>{
 await page.goto('/quran');await page.getByRole('button',{name:'Juz / Para',exact:true}).click();await expect(page.locator('.juz-grid>a')).toHaveCount(30);await page.locator('.juz-grid>a').last().click();await expect(page).toHaveURL(/\/surah\/78#ayah-1/);await expect(page.locator('#ayah-1')).toBeVisible();await page.getByRole('link',{name:'Quran',exact:true}).click();await expect(page.locator('.start-reading')).toHaveAttribute('href',/\/surah\/78#ayah-/);
});
test('Quran search finds a direct reference and topics link to real ayahs',async({page})=>{
 await page.goto('/search?q=2%3A255');await expect(page.locator('.search-result')).toHaveCount(1);await page.locator('.search-result').click();await expect(page.locator('#ayah-255')).toBeVisible();await expect(page.locator('article')).toHaveCount(30);
 await page.goto('/search?tab=topics&chapter=2');await expect(page.locator('.topic-result').first()).toBeVisible();await expect(page.getByRole('combobox',{name:'Filter topics by surah'})).toHaveValue('2');await page.locator('.topic-result').first().click();await expect(page).toHaveURL(/surah\/2#ayah-1/);
});
test('mobile discovery has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/quran');await expect(page.locator('.surah-card')).toHaveCount(114);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
