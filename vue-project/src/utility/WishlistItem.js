const WISHLIST_KEY = 'wishlistItems';

export function getWishlist() {
    const items = localStorage.getItem(WISHLIST_KEY);
    return items ? JSON.parse(items) : [];
}

export function isInWishlist(id) {
    const list = getWishlist();
    return list.some(item => item.id === id);
}

export function toggleWishlist(item) {
    let list = getWishlist();
    const exists = list.find(i => i.id === item.id);
    if (exists) {
        list = list.filter(i => i.id !== item.id);
    } else {
        list.push(item);
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return list;
}
