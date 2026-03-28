export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export const services: Service[] = [
  { id: "s1", name: "Corte", duration: 45, price: 45, icon: "✂️" },
  { id: "s2", name: "Barba", duration: 30, price: 35, icon: "🪒" },
  { id: "s3", name: "Combo", duration: 60, price: 70, icon: "💈" },
  { id: "s4", name: "Sobrancelha", duration: 15, price: 20, icon: "👁️" },
  { id: "s5", name: "Degradê", duration: 50, price: 50, icon: "🔥" },
  { id: "s6", name: "Pigmentação", duration: 40, price: 60, icon: "🎨" },
];

export const products: Product[] = [
  { id: "p1", name: "Minoxidil 60ml", price: 89.90, category: "Tratamento", image: "💊" },
  { id: "p2", name: "Pomada Modeladora", price: 45.90, category: "Finalização", image: "🫙" },
  { id: "p3", name: "Máquina de Corte Pro", price: 299.90, category: "Equipamento", image: "⚡" },
  { id: "p4", name: "Kit Giletes (10un)", price: 25.90, category: "Acessório", image: "🔪" },
  { id: "p5", name: "Água Mineral", price: 5.00, category: "Bebida", image: "💧" },
  { id: "p6", name: "Guaraná Lata", price: 7.00, category: "Bebida", image: "🥤" },
  { id: "p7", name: "Pipoca Gourmet", price: 12.00, category: "Snack", image: "🍿" },
  { id: "p8", name: "Bala de Menta", price: 3.00, category: "Snack", image: "🍬" },
  { id: "p9", name: "Óleo para Barba", price: 55.90, category: "Tratamento", image: "🧴" },
  { id: "p10", name: "Shampoo Anticaspa", price: 39.90, category: "Tratamento", image: "🧴" },
];

export const portfolioImages = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=400&fit=crop",
];

export const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];

// Simulated booked slots
export const bookedSlots: Record<string, string[]> = {
  "0": ["09:00", "10:30", "14:00", "16:00"],
  "1": ["08:30", "11:00", "15:00"],
  "2": ["09:30", "13:00", "17:00", "18:00"],
  "3": ["10:00", "14:30"],
  "4": ["08:00", "11:30", "16:30", "19:00"],
  "5": ["09:00", "13:30", "15:30"],
  "6": ["10:30", "14:00", "17:30"],
};
