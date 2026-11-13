import { expect, test } from '@playwright/test'

test('sin sesión, una ruta privada lleva al login con redirect', async ({ page }) => {
  await page.goto('/ligas')
  await expect(page).toHaveURL(/\/login\?redirect=(%2F|\/)ligas/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
})

test('el login cambia a registro y a recuperar contraseña', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Crea tu cuenta de Entrenador' }).click()
  await expect(page.getByLabel('Nombre de Entrenador')).toBeVisible()
  await page.getByRole('button', { name: 'Inicia Sesión' }).click()
  await page.getByRole('button', { name: '¿Olvidaste tu contraseña?' }).click()
  await expect(page.getByLabel('Contraseña')).toHaveCount(0)
})

test('se puede cambiar de idioma', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.getByRole('button', { name: /Create your Coach account/i })).toBeVisible()
})
