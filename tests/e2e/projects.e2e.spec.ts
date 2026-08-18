import { test, expect } from '@playwright/test'

test.describe('Projects window', () => {
  test('lists live sites with favicons and a story pane', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Start' }).click()
    await page.locator('.desktop-shell').waitFor()

    await page.locator('.taskbar__start').click()
    await page.getByRole('menuitem', { name: 'Projects' }).click()

    const window = page.locator('.projects-window')
    await expect(window).toBeVisible()
    await expect(window.getByRole('button', { name: /Delta Rootz Rock Radio/ })).toBeVisible()
    await expect(window.getByRole('button', { name: /Refined K-9/ })).toBeVisible()
    await expect(window.getByRole('button', { name: /Blue Rose Nails/ })).toBeVisible()
    await expect(window.getByRole('button', { name: /Walkies Quest/ })).toBeVisible()

    const favicons = page.locator('.projects-window__favicon')
    await expect(favicons).toHaveCount(4)
    await expect(favicons.nth(0)).toHaveAttribute('src', '/icons/projects/delta-rootz.png')
    await expect(favicons.nth(1)).toHaveAttribute('src', '/icons/projects/refined-k9.png')
    await expect(favicons.nth(2)).toHaveAttribute('src', '/icons/projects/blue-rose.png')
    await expect(favicons.nth(3)).toHaveAttribute('src', '/icons/projects/walkies-quest.png')

    await expect(page.getByRole('heading', { name: 'Delta Rootz Rock Radio' })).toBeVisible()
    await expect(window.getByRole('link', { name: 'Visit site' })).toHaveAttribute(
      'href',
      'https://www.dtripler.com/',
    )

    await window.getByRole('button', { name: /Walkies Quest/ }).click()
    await expect(page.getByRole('heading', { name: 'Walkies Quest' })).toBeVisible()
    await expect(window.getByText(/rain map/i)).toBeVisible()
    await expect(window.getByRole('link', { name: 'Visit site' })).toHaveAttribute(
      'href',
      'https://walkies.quest/',
    )
  })
})
