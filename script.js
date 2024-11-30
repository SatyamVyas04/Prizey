// script.ts
import { db } from './prisma/db';

// 1
export const createproduct = async (product) => {
  // 2 & 3
  return await db.product.create({
    data: product,
  });
};

export const getproduct = async () => {
  return await db.product.findMany();
};

export const createList = async (listData) => {
  return await db.list.create({
    data: listData,
  });
};

export const getList = async () => {
  return await db.list.findMany();
};

export const getListWithProducts = async (listId) => {
  return await db.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      products: true, // This fetches the related products
    },
  });
};

export const updateList = async (listId, newData) => {
  return await db.list.update({
    where: { id: listId },
    data: newData,
  });
};

export const deleteList = async (listId) => {
  return await db.list.delete({
    where: { id: listId },
  });
};
