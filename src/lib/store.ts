import { create } from 'zustand';
import type { Service, Product } from './data';

interface CartState {
  selectedServices: Service[];
  selectedProducts: Product[];
  selectedDate: Date | null;
  selectedTime: string | null;
  customerName: string;
  customerWhatsApp: string;
  currentStep: 'services' | 'schedule' | 'products' | 'checkout' | 'confirmed';

  toggleService: (service: Service) => void;
  toggleProduct: (product: Product) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerWhatsApp: (phone: string) => void;
  setStep: (step: CartState['currentStep']) => void;
  totalPrice: () => number;
  totalDuration: () => number;
  productsTotal: () => number;
  grandTotal: () => number;
  reset: () => void;
}

export const useStore = create<CartState>((set, get) => ({
  selectedServices: [],
  selectedProducts: [],
  selectedDate: null,
  selectedTime: null,
  customerName: '',
  customerWhatsApp: '',
  currentStep: 'services',

  toggleService: (service) =>
    set((state) => {
      const exists = state.selectedServices.find((s) => s.id === service.id);
      return {
        selectedServices: exists
          ? state.selectedServices.filter((s) => s.id !== service.id)
          : [...state.selectedServices, service],
      };
    }),

  toggleProduct: (product) =>
    set((state) => {
      const exists = state.selectedProducts.find((p) => p.id === product.id);
      return {
        selectedProducts: exists
          ? state.selectedProducts.filter((p) => p.id !== product.id)
          : [...state.selectedProducts, product],
      };
    }),

  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  setCustomerName: (name) => set({ customerName: name }),
  setCustomerWhatsApp: (phone) => set({ customerWhatsApp: phone }),
  setStep: (step) => set({ currentStep: step }),

  totalPrice: () => get().selectedServices.reduce((sum, s) => sum + s.price, 0),
  totalDuration: () => get().selectedServices.reduce((sum, s) => sum + s.duration, 0),
  productsTotal: () => get().selectedProducts.reduce((sum, p) => sum + p.price, 0),
  grandTotal: () => get().totalPrice() + get().productsTotal(),

  reset: () =>
    set({
      selectedServices: [],
      selectedProducts: [],
      selectedDate: null,
      selectedTime: null,
      customerName: '',
      customerWhatsApp: '',
      currentStep: 'services',
    }),
}));
