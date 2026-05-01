import type { Cart, CartItem } from "@/types";

export type { Cart, CartItem };

const CART_KEY = "shop-more-cart";

// Get cart from sessionStorage
export function getCart(): Cart {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save cart to sessionStorage
export function saveCart(cart: Cart): void {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart (merge if same productId+color+size exists)
export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) => i.productId === item.productId &&
             i.color === item.color &&
             i.size === item.size
  );

  if (existingIndex >= 0) {
    // Merge quantities (cap at availableQty)
    cart[existingIndex].quantity = Math.min(
      cart[existingIndex].quantity + item.quantity,
      item.availableQty
    );
  } else {
    cart.push(item);
  }

  saveCart(cart);
  // Trigger storage event for cross-component updates
  window.dispatchEvent(new Event("storage"));
}

// Remove specific item from cart
export function removeFromCart(productId: number, color: string, size: string): void {
  const cart = getCart();
  const filtered = cart.filter(
    (i) => !(i.productId === productId && i.color === color && i.size === size)
  );
  saveCart(filtered);
}

// Update item quantity
export function updateCartQuantity(
  productId: number,
  color: string,
  size: string,
  quantity: number
): void {
  const cart = getCart();
  const item = cart.find(
    (i) => i.productId === productId && i.color === color && i.size === size
  );
  if (item) {
    item.quantity = Math.min(Math.max(1, quantity), item.availableQty);
    saveCart(cart);
  }
}

// Clear all items from cart
export function clearCart(): void {
  sessionStorage.removeItem(CART_KEY);
}

// Get total number of items in cart (sum of quantities)
export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get cart total price (prices are already discounted when added to cart)
export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
