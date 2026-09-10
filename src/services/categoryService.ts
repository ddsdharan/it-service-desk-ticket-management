import { api } from "./api";
import type { Category } from "../types/category";

const slugifyCategoryName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateCategoryId = (
  name: string,
  existingCategories: Category[],
): string => {
  const slug = slugifyCategoryName(name);

  if (!slug) {
    throw new Error(
      "Category name must contain at least one letter or number.",
    );
  }

  const baseId = `cat-${slug}`;

  const existingIds = new Set(
    existingCategories.map((category) => category.id),
  );

  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let counter = 2;

  while (existingIds.has(`${baseId}-${counter}`)) {
    counter += 1;
  }

  return `${baseId}-${counter}`;
};

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories");

    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);

    return response.data;
  },

  createCategory: async (
    category: Omit<Category, "id">,
  ): Promise<Category> => {
    const existingCategories = await categoryService.getCategories();

    const normalizedName = category.name.trim().toLowerCase();

    const duplicateName = existingCategories.some(
      (existingCategory) =>
        existingCategory.name.trim().toLowerCase() === normalizedName,
    );

    if (duplicateName) {
      throw new Error(
        `A category named "${category.name.trim()}" already exists.`,
      );
    }

    const id = generateCategoryId(category.name, existingCategories);

    const payload: Category = {
      id,
      name: category.name.trim(),
      description: category.description.trim(),
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    console.log("Creating category:", payload);

    const response = await api.post<Category>("/categories", payload);

    return response.data;
  },

  updateCategory: async (
    id: string,
    category: Partial<Category>,
  ): Promise<Category> => {
    const response = await api.patch<Category>(
      `/categories/${id}`,
      category,
    );

    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};