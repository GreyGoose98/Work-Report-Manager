export type CategoryTree = Record<string, string[]>;

const CATEGORY_TREE_KEY = 'wrm_category_tree';

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function loadTree(): CategoryTree {
  const raw = localStorage.getItem(CATEGORY_TREE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const tree = parsed as Record<string, unknown>;
    const normalized: CategoryTree = {};

    for (const [category, values] of Object.entries(tree)) {
      if (!Array.isArray(values)) {
        continue;
      }
      normalized[category] = uniqueSorted(values.filter((value): value is string => typeof value === 'string'));
    }

    return normalized;
  } catch {
    return {};
  }
}

function saveTree(tree: CategoryTree) {
  localStorage.setItem(CATEGORY_TREE_KEY, JSON.stringify(tree));
}

export function getCategoryTree(): CategoryTree {
  return loadTree();
}

export function getCategoryOptions(): string[] {
  return Object.keys(getCategoryTree()).sort((left, right) => left.localeCompare(right));
}

export function getSubcategoryOptions(category: string): string[] {
  return getCategoryTree()[category] || [];
}

export function addCategoryOption(value: string) {
  const category = value.trim();
  if (!category) return;

  const tree = getCategoryTree();
  if (!tree[category]) {
    tree[category] = [];
    saveTree(tree);
  }
}

export function removeCategoryOption(value: string) {
  const tree = getCategoryTree();
  if (tree[value]) {
    delete tree[value];
    saveTree(tree);
  }
}

export function addSubcategoryOption(category: string, value: string) {
  const subcategory = value.trim();
  if (!category || !subcategory) return;

  const tree = getCategoryTree();
  tree[category] = uniqueSorted([...(tree[category] || []), subcategory]);
  saveTree(tree);
}

export function removeSubcategoryOption(category: string, value: string) {
  const tree = getCategoryTree();
  if (!tree[category]) return;
  tree[category] = tree[category].filter((item) => item !== value);
  saveTree(tree);
}
