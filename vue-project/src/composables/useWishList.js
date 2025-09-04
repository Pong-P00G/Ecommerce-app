import { ref, onMounted } from 'vue';

const wishlist = ref(new Set());

export function useWishList() {
  onMounted(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      wishlist.value = new Set(JSON.parse(savedWishlist));
    }
  });

  const add = (productId) => {
    wishlist.value.add(productId);
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist.value)));
  };

  const remove = (productId) => {
    wishlist.value.delete(productId);
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist.value)));
  };

  const clear = () => {
    wishlist.value.clear();
    localStorage.removeItem('wishlist');
  };

  return { wishlist, add, remove, clear };
}
