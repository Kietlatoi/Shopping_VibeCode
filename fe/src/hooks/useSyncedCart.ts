import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuthStore, useCartStore } from '@/store';
import type { CartItem } from '@/types/cart';

const cartQueryKey = ['cart'];

export function useSyncedCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const setItems = useCartStore((state) => state.setItems);
  const addLocalItem = useCartStore((state) => state.addItem);
  const updateLocalQuantity = useCartStore((state) => state.updateQuantity);
  const removeLocalItem = useCartStore((state) => state.removeItem);
  const clearLocalCart = useCartStore((state) => state.clearCart);

  const cartQuery = useQuery({
    queryKey: cartQueryKey,
    queryFn: apiService.getCart,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cartQuery.data) {
      setItems(cartQuery.data);
    }
  }, [cartQuery.data, setItems]);

  const invalidateCart = () => {
    if (isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    }
  };

  const addMutation = useMutation({
    mutationFn: (item: CartItem) => apiService.addCartItem(item.variantId ?? item.id, item.quantity),
    onSuccess: invalidateCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiService.updateCartItem(id, quantity),
    onSuccess: invalidateCart,
  });

  const removeMutation = useMutation({
    mutationFn: apiService.removeCartItem,
    onSuccess: invalidateCart,
  });

  const addItem = (item: CartItem) => {
    addLocalItem(item);
    if (isAuthenticated) {
      addMutation.mutate(item);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    updateLocalQuantity(id, quantity);
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      removeMutation.mutate(id);
    } else {
      updateMutation.mutate({ id, quantity });
    }
  };

  const removeItem = (id: string) => {
    removeLocalItem(id);
    if (isAuthenticated) {
      removeMutation.mutate(id);
    }
  };

  const clearCart = () => {
    const ids = items.map((item) => item.id);
    clearLocalCart();
    if (isAuthenticated) {
      ids.forEach((id) => removeMutation.mutate(id));
    }
  };

  return {
    items,
    totalItems,
    totalPrice,
    isSyncing: cartQuery.isFetching || addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
