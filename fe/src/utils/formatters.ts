import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
};

export const formatShortDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
};
