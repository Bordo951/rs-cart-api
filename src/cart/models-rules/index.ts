import { CartItem } from '../../database/entities';
import { CartDTO } from '../services';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: CartDTO): number {
  return cart?.items ? cart.items.reduce((acc: number, {  count }: CartItem) => {
    return acc += (+count);
  }, 0) : 0;
}
