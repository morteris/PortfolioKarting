import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

declare global {
  interface Window {
    kartMotionLog: { name: string; target: Element }[]
  }
}
async function recordMotion(page: Page) {
  await page.addInitScript(() => {
    window.kartMotionLog = []
    document.addEventListener('animationstart', (event) => {
      if (event.target instanceof Element && event.animationName.startsWith('kr-')) {
        window.kartMotionLog.push({ name: event.animationName, target: event.target })
      }
    })
  })
}

test('circuit cards enter once; a hover lap finishes and leaves the normal outline', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1200, height: 650 })
  await recordMotion(page)
  await page.goto('/')
  await expect
    .poll(() => page.evaluate(() => window.kartMotionLog.some((e) => e.name === 'kr-grid-start')))
    .toBe(true)
  const first = page.locator('.track-card').first()
  await first.scrollIntoViewIfNeeded()
  const enters = () =>
    first.evaluate(
      (el) => window.kartMotionLog.filter((e) => e.name === 'kr-rise' && e.target === el).length,
    )
  await expect.poll(enters).toBe(1)
  await first.hover()
  const lap = first.locator('.trace-lap')
  await expect
    .poll(() =>
      lap.evaluate(
        (el) => window.kartMotionLog.filter((e) => e.name === 'kr-lap' && e.target === el).length,
      ),
    )
    .toBe(1)
  await expect.poll(() => lap.evaluate((el) => el.getAnimations().length)).toBe(0)
  await expect(lap).toHaveCSS('opacity', '0')
  await page.mouse.move(1, 1)
  await page.locator('footer').scrollIntoViewIfNeeded()
  await first.scrollIntoViewIfNeeded()
  await first.evaluate(async (el) => {
    await Promise.allSettled(el.getAnimations().map((a) => a.finished))
  })
  await expect.poll(enters).toBe(1)
  await expect(first.locator('img')).toHaveCSS('transform', 'none')
})

test('booking feedback never delays or approximates the selected time and actual quote', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await recordMotion(page)
  await page.goto('/#/booking?plan=sprint')
  const time = page.getByRole('button', { name: '13:00', exact: true })
  await time.focus()
  await time.press('Enter')
  await expect(time).toHaveAttribute('aria-pressed', 'true')
  await expect
    .poll(() => page.evaluate(() => window.kartMotionLog.some((e) => e.name === 'kr-tick')))
    .toBe(true)
  await page.getByRole('combobox', { name: /^Число пилотов/ }).selectOption('3')
  const amount = page.locator('.quote-total strong')
  await expect(amount).toHaveText(/4\s?500\s?₽/)
  await expect
    .poll(() =>
      amount.evaluate((el) =>
        window.kartMotionLog.some((e) => e.name === 'kr-value-in' && e.target === el),
      ),
    )
    .toBe(true)
  await expect(page.getByRole('button', { name: 'Войти и продолжить' })).toBeEnabled()
})

test('reduced motion skips entrance, pointer, menu and form effects without hiding content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await recordMotion(page)
  await page.goto('/')
  await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1')
  const first = page.locator('.track-card').first()
  await first.hover()
  await expect(first).toHaveCSS('transform', 'none')
  await expect(first.locator('img')).toHaveCSS('transform', 'none')
  await expect(first.locator('.trace-lap')).toHaveCSS('opacity', '0')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Меню', exact: true }).click()
  await page.locator('#mobile-nav').getByRole('link', { name: 'Бронирование' }).click()
  await page.getByRole('button', { name: '13:00', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Войти и продолжить' })).toBeEnabled()
  expect(await page.evaluate(() => window.kartMotionLog.length)).toBe(0)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})
