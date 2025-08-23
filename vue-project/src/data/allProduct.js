import { Shirt } from '../data/shirt.js';
import { Hoodie } from '../data/hoodies.js';
import { Pants } from '../data/pants.js';
import { Accesorie } from '../data/accesorie.js';

// Combine with category tags
export const allProduct = [
    ...Shirt.map(item => ({ ...item, category: 'Shirt' })),
    ...Hoodie.map(item => ({ ...item, category: 'Hoodie' })),
    ...Pants.map(item => ({ ...item, category: 'Pants' })),
    ...Accesorie.map(item => ({ ...item, category: 'Accesorie' }))
];

// OR — Sort by category, then by name
allProduct.sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    return a.name.localeCompare(b.name);
});

