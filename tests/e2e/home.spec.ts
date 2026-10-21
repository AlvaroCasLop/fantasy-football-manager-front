import { test, expect } from '@playwright/test'

test.describe('Home Page & Navigation', () => {
  test('should load the home page and show the Blood Bowl manager title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Blood Bowl|Fantasy Football Manager/i)
    await expect(page.locator('h1')).toContainText(/Blood Bowl|Manager/i)
  })

  test('should navigate to leagues catalog', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Ver Ligas')
    await expect(page).toHaveURL(/.*leagues/)
  })

  test('should navigate to hall of fame', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Salón de la Fama')
    await expect(page).toHaveURL(/.*hall-of-fame/)
  })
})
