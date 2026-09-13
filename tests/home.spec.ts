import {test,expect} from '@playwright/test';
test('directory lists 114 surahs, searches, sorts and opens reader',async({page})=>{
 await page.goto('/');await expect(page.locator('.surah-card')).toHaveCount(114);
 await page.getByRole('combobox',{name:'Sort surahs'}).selectOption('descending');await expect(page.locator('.surah-card').first()).toHaveAttribute('href','/surah/114');
 await page.getByRole('searchbox',{name:'Search surahs'}).fill('Fatih');await expect(page.locator('.surah-card')).toHaveCount(1);await page.locator('.surah-card').click();await expect(page).toHaveURL(/\/surah\/1$/);await expect(page.locator('article')).toHaveCount(7);
 await page.locator('.brand').click();await expect(page).toHaveURL('http://localhost:3001/');
});
test('unavailable surah has correct metadata and no unrelated verses',async({page})=>{
 await page.goto('/surah/2');await expect(page.getByRole('heading',{level:1})).toContainText('Al-Baqara');await expect(page.getByText('COMING NEXT',{exact:true})).toBeVisible();await expect(page.locator('article')).toHaveCount(0);await page.getByRole('link',{name:'Read Al-Fatihah'}).click();await expect(page.locator('article')).toHaveCount(7);
});
test('mobile directory and bookmark shortcut',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.surah-card')).toHaveCount(114);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.locator('.home-bookmarks').click();await expect(page.locator('.saved-ayahs-heading')).toBeVisible();
});
