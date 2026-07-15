import { useEffect, useState } from 'react';
import {
  addCategoryOption,
  addSubcategoryOption,
  getCategoryOptions,
  getCategoryTree,
  getSubcategoryOptions,
  removeCategoryOption,
  removeSubcategoryOption,
} from '../utils/reportOptions';

export function useReportOptions() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryTree, setCategoryTree] = useState<Record<string, string[]>>({});

  const refresh = () => {
    setCategories(getCategoryOptions());
    setCategoryTree(getCategoryTree());
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    categories,
    categoryTree,
    refresh,
    addCategory: (value: string) => {
      addCategoryOption(value);
      refresh();
    },
    removeCategory: (value: string) => {
      removeCategoryOption(value);
      refresh();
    },
    addSubcategory: (category: string, value: string) => {
      addSubcategoryOption(category, value);
      refresh();
    },
    removeSubcategory: (category: string, value: string) => {
      removeSubcategoryOption(category, value);
      refresh();
    },
    getSubcategoriesForCategory: (category: string) => getSubcategoryOptions(category),
  };
}
