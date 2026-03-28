import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Scissors, Calendar as CalIcon, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "services" as const, label: "Serviços", icon: Scissors },
  { key: "schedule" as const, label: "Horário", icon: CalIcon },
  { key: "products" as const, label: "Produtos", icon: ShoppingBag },
  { key: "checkout" as const, label: "Finalizar", icon: CreditCard },
];

export default function BottomNav() {
  const { currentStep, setStep, selectedServices, grandTotal } = useStore();

  if (currentStep === "confirmed") return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border"
    >
      {/* Cart summary */}
      <AnimatePresence>
        {selectedServices.length > 0 && currentStep !== "checkout" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 py-2 border-b border-border flex items-center justify-between"
          >
            <span className="text-xs text-muted-foreground">
              {selectedServices.length} serviço(s) selecionado(s)
            </span>
            <span className="text-sm font-bold text-primary">
              R$ {grandTotal().toFixed(2)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setStep(key)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
              currentStep === key ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon size={18} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
