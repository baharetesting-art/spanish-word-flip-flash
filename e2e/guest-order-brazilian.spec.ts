import { test, expect } from '@playwright/test';

// E2E test for guest checkout and order verification

test('Guest can order Brazilian Santos and verify order', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Add Brazilian Santos to cart
  await page.getByRole('button', { name: 'Add to Cart', exact: false }).first().click();
  await page.getByRole('button', { name: /^1$/ }).click(); // Go to cart

  // Proceed to checkout
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();

  // Fill contact and shipping info
  await page.locator('[data-test-id="checkout-firstname-input"]').fill('Test');
  await page.locator('[data-test-id="checkout-lastname-input"]').fill('User');
  await page.locator('[data-test-id="checkout-email-input"]').fill('testuser@example.com');
  await page.locator('[data-test-id="checkout-address-input"]').fill('123 Test Lane');
  await page.locator('[data-test-id="checkout-city-input"]').fill('Testville');
  await page.locator('[data-test-id="checkout-zipcode-input"]').fill('12345');
  await page.locator('[data-test-id="checkout-country-input"]').fill('United States');
  await page.locator('[data-test-id="checkout-cardname-input"]').fill('Test User');

  // Fill card number, expiry, and CVC
  await page.locator('[data-test-id="checkout-cardnumber-input"]').fill('1234 5678 9101 1234');
  await page.locator('[data-test-id="checkout-cardexpiry-input"]').fill('12/30');
  await page.locator('[data-test-id="checkout-cardcvc-input"]').fill('123');
  await page.getByRole('button', { name: 'Place Order' }).click();

  // Confirm order placed
  await expect(page.getByText('Order Confirmed!')).toBeVisible();
  const orderId = await page.getByText('Your Order ID is:').locator('..').locator('p').nth(1).textContent();
  await expect(page.getByText('testuser@example.com')).toBeVisible();

  // Track order
  await page.getByRole('link', { name: 'Track Your Order' }).click();
  await page.getByPlaceholder('e.g., ABC123XYZ').fill(orderId!.trim());
  await page.getByPlaceholder('The email used when placing the order').fill('testuser@example.com');
  await page.getByRole('button', { name: 'Track Order' }).click();

  // Verify order details
  await expect(page.getByText('Brazilian Santos')).toBeVisible();
  await expect(page.getByText('$22.99')).toBeVisible();
  await expect(page.getByText('Qty: 1')).toBeVisible();
  await expect(page.getByText('Test User')).toBeVisible();
  await expect(page.getByText('testuser@example.com')).toBeVisible();
});
