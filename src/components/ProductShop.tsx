import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export default function ProductShop() {
  const { selectedProducts, toggleProduct } = useStore();
  const { data: products = [], isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["Todos", ...Array.from(cats)];
  }, [products]);

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (isLoading) {
    return (
      <section className="px-5 py-8">
        <h2 className="font-display text-3xl text-foreground mb-4">PRODUTOS</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-8">
      <h2 className="font-display text-3xl text-foreground mb-4">PRODUTOS</h2>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((product, i) => {
          const isSelected = selectedProducts.some((p) => p.id === product.id);
          return (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleProduct({ id: product.id, name: product.name, price: Number(product.price), category: product.category, image: product.image })}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-xl border transition-all text-center",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <span className="text-3xl mb-2">{product.image}</span>
              <span className="text-xs font-medium text-foreground leading-tight">{product.name}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{product.category}</span>
              <span className="mt-2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">
                R$ {Number(product.price).toFixed(2)}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
