import { expect, test, vi } from 'vitest';
import {
  createproduct,
  getproduct,
  createList,
  updateList,
  deleteList,
  getListWithProducts,
  getList,
} from '../script';

vi.mock('../prisma/db');

let new_list_id = null;

test('createproduct should return the generated product', async () => {
  const newproduct = {
    title:
      'boAt Lunar Discovery w/ 1.39" (3.5 cm) HD Display Smart Watch for Men & Women(Active Black)',
    asin: 'B0DFYL4657',
    brand: 'boAt',
    stars: 4,
    reviewsCount: 20915,
    thumbnailImage:
      'https://m.media-amazon.com/images/I/41uYSN1XJbL._SX300_SY300_QL70_ML2_.jpg',
    breadCrumbs: 'Electronics › Wearable Technology › Smart Watches',
    description: null,
    url: 'https://www.amazon.in/dp/B0DFYL4634',
  };

  const product = await createproduct(newproduct);
  expect(product).toBeDefined();
  expect(product.asin).toBe(newproduct.asin);
});

test('getproduct should return the list of all products', async () => {
  const product = await getproduct();
  expect(product).toBeDefined();
  expect(Array.isArray(product)).toBe(true);
});

test('createList should return the created list', async () => {
  const newList = {
    name: 'Top Tech Gadgets',
    userId: '6725d8d673a95438d920be56', // Example userId (ensure this exists in your test data or mock it)
    productIds: ['674aee30a26859d0337a1a2b', '674aee48401372bc1789fb15'], // Example productIds (ensure these products exist)
  };

  const list = await createList(newList);
  new_list_id = list.id;

  expect(list).toBeDefined();
  expect(list.name).toBe(newList.name);
  expect(list.productIds).toContain('674aee48401372bc1789fb15');
  expect(list.productIds).toContain('674aee30a26859d0337a1a2b');
});

test('getList should return all lists', async () => {
  const lists = await getList();
  expect(lists).toBeDefined();
  expect(Array.isArray(lists)).toBe(true);
  expect(lists.length).toBeGreaterThan(0); // Assuming there are lists in the database
});

test('getListWithProducts should return a list with its associated products', async () => {
  const listId = new_list_id; // Example list ID (ensure this exists in your test data or mock it)

  const listWithProducts = await getListWithProducts(listId);

  expect(listWithProducts).toBeDefined();
  expect(listWithProducts.products).toBeDefined();
  expect(listWithProducts.products.length).toBeGreaterThan(0);
  expect(listWithProducts.products[0].title).toBeDefined();
});

test('updateList should return the updated list', async () => {
  const listId = new_list_id; // Example list ID
  const newData = {
    name: 'Updated Tech Gadgets',
  };

  const updatedList = await updateList(listId, newData);

  expect(updatedList).toBeDefined();
  expect(updatedList.name).toBe(newData.name);
});

test('deleteList should remove the list from the database', async () => {
  const listId = new_list_id; // Example list ID

  const deletedList = await deleteList(listId);

  expect(deletedList).toBeDefined();
  expect(deletedList.id).toBe(listId);
});
