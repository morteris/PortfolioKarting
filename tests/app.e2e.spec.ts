import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { ACCOUNTS } from '../src/domain/booking'
import type { Role } from '../src/domain/booking'

async function login(page: Page, role: Role) {
  await page.goto(`/#/login?role=${role}`)
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue(ACCOUNTS[role].email)
  await page.getByRole('button', { name: 'Войти в кабинет', exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: role === 'pilot' ? 'Мои брони' : 'Управление заявками',
      exact: true,
    }),
  ).toBeVisible()
}
async function reserve(page: Page, slot = '11:30') {
  await page.goto('/#/booking?track=ring&plan=sprint')
  await page.getByRole('button', { name: slot, exact: true }).click()
  await page.getByRole('button', { name: 'Оформить демобронь' }).click()
  await expect(page.getByRole('status')).toContainText('Бронь создана')
}

test('home sign-in, invalid credentials, session refresh and logout', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('footer')).toContainText(ACCOUNTS.admin.password)
  await expect(page.locator('footer')).toContainText(ACCOUNTS.pilot.password)
  await page.getByRole('link', { name: 'Войти', exact: true }).click()
  await page.getByLabel('Email', { exact: true }).fill(ACCOUNTS.pilot.email)
  await page.getByLabel('Пароль', { exact: true }).fill('incorrect')
  await page.getByRole('button', { name: 'Войти в кабинет' }).click()
  await expect(page.getByRole('alert')).toContainText('Email или пароль не совпадают')
  await page.getByRole('button', { name: 'Пилот', exact: true }).click()
  await page.getByRole('button', { name: 'Войти в кабинет' }).click()
  await expect(page.getByRole('heading', { name: 'Мои брони' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Броней пока нет')).toBeVisible()
  await page.getByRole('button', { name: 'Выйти', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Вход в кабинет')
  await page.goto('/#/profile')
  await expect(page.locator('h1')).toHaveText('Вход в кабинет')
})

test('guest selections survive login; request persists and can be reviewed across tabs', async ({
  page,
  context,
}) => {
  await page.goto('/#/tracks')
  await page.getByRole('link', { name: 'Выбрать трассу: Дрифт Паддок' }).click()
  const track = page.getByRole('combobox', { name: /^Трасса/ }),
    plan = page.getByRole('combobox', { name: /^Тариф/ }),
    count = page.getByRole('combobox', { name: /^Число пилотов/ })
  await expect(track).toHaveValue('drift')
  await plan.selectOption('sprint')
  await count.selectOption('3')
  await page.getByRole('button', { name: '14:30', exact: true }).click()
  const day = await page.getByLabel('Дата заезда').inputValue()
  await page.getByRole('button', { name: 'Войти и продолжить' }).click()
  await page.getByRole('button', { name: 'Пилот', exact: true }).click()
  await page.getByRole('button', { name: 'Вернуться к бронированию' }).click()
  await expect(track).toHaveValue('drift')
  await expect(plan).toHaveValue('sprint')
  await expect(count).toHaveValue('3')
  await expect(page.getByLabel('Дата заезда')).toHaveValue(day)
  await expect(page.getByRole('button', { name: '14:30', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Оформить демобронь' }).click()
  await expect(page.getByRole('status')).toContainText('Бронь создана')
  const ticket = page.locator('.booking-ticket')
  await expect(ticket).toContainText('Дрифт Паддок')
  await expect(ticket).toContainText('На рассмотрении')
  await expect(ticket).toContainText(/4\s?500/)
  await page.reload()
  await expect(ticket).toHaveCount(1)
  const admin = await context.newPage()
  await login(admin, 'admin')
  await expect(admin.locator('.booking-ticket')).toContainText(ACCOUNTS.pilot.email)
  await admin.getByRole('button', { name: 'Подтвердить', exact: true }).click()
  await expect(ticket.locator('.status')).toHaveText('Подтверждена')
  await admin.getByRole('button', { name: 'Отменить бронь' }).click()
  await admin.getByRole('button', { name: 'Оставить', exact: true }).click()
  await expect(ticket.locator('.status')).toHaveText('Подтверждена')
  await admin.getByRole('button', { name: 'Отменить бронь' }).click()
  await admin.getByRole('button', { name: 'Да, отменить' }).click()
  await expect(ticket.locator('.status')).toHaveText('Отменена')
  await page.goto(`/#/booking?track=drift&plan=sprint&date=${day}`)
  await expect(page.getByRole('button', { name: '14:30', exact: true })).toBeEnabled()
})

test('pilot cannot view admin bookings; occupied slot reopens after admin cancellation', async ({
  page,
}) => {
  await login(page, 'admin')
  await reserve(page)
  await page.getByRole('button', { name: 'Выйти', exact: true }).click()
  await login(page, 'pilot')
  await expect(page.locator('.booking-ticket')).toHaveCount(0)
  await page.goto('/#/admin')
  await expect(page.locator('h1')).toHaveText('Мои брони')
  await expect(page).toHaveURL(/#\/profile/)
  await page.goto('/#/booking?track=ring&plan=sprint')
  await expect(page.getByRole('button', { name: '11:30', exact: true })).toBeDisabled()
  await page.goto('/#/login?role=admin')
  await page.getByRole('button', { name: 'Войти в кабинет' }).click()
  await page.getByRole('button', { name: 'Отменить бронь' }).click()
  await page.getByRole('button', { name: 'Да, отменить' }).click()
  await expect(page.locator('.booking-ticket .status')).toHaveText('Отменена')
  await page
    .getByRole('group', { name: 'Фильтр по статусу' })
    .getByRole('button', { name: 'На рассмотрении' })
    .click()
  await expect(page.getByText('Заявок с таким статусом нет')).toBeVisible()
  await page.goto('/#/booking?track=ring&plan=sprint')
  await expect(page.getByRole('button', { name: '11:30', exact: true })).toBeEnabled()
})

test('mobile menu, pricing deep-link, language persistence and no horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Войти', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Меню', exact: true }).click()
  await page.locator('#mobile-nav').getByRole('link', { name: 'Тарифы' }).click()
  await page.locator('.plan-row').last().getByRole('link', { name: 'Выбрать тариф' }).click()
  await expect(page.getByRole('combobox', { name: /^Тариф/ })).toHaveValue('team')
  await expect(page.getByRole('button', { name: '22:00', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('h1')).toHaveText('Book a session')
  await page.reload()
  await expect(page.locator('h1')).toHaveText('Book a session')
  for (const route of ['/', '/#/tracks', '/#/prices', '/#/about', '/#/login', '/#/booking']) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360)
  }
})

test('corrupt storage is reported; the original data is not silently discarded', async ({
  page,
}) => {
  await login(page, 'pilot')
  await page.evaluate(() => localStorage.setItem('kartrush:bookings:v1', 'not JSON'))
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Данные не перезаписаны')
  await page.goto('/#/booking')
  await page.getByRole('button', { name: '10:00', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Оформить демобронь' })).toBeDisabled()
  expect(await page.evaluate(() => localStorage.getItem('kartrush:bookings:v1'))).toBe('not JSON')
})
