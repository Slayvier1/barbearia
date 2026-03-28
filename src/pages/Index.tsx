import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ServiceGrid from "@/components/ServiceGrid";
import Portfolio from "@/components/Portfolio";
import DateTimeSelector from "@/components/DateTimeSelector";
import ProductShop from "@/components/ProductShop";
import Checkout from "@/components/Checkout";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const Index = () => {
  const { currentStep } = useStore();

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      <Header />

      <AnimatePresence mode="wait">
        {currentStep === "services" && (
          <motion.div key="services" {...pageVariants} transition={{ duration: 0.3 }}>
            <HeroBanner />
            <ServiceGrid />
            <Portfolio />
          </motion.div>
        )}

        {currentStep === "schedule" && (
          <motion.div key="schedule" {...pageVariants} transition={{ duration: 0.3 }}>
            <DateTimeSelector />
          </motion.div>
        )}

        {currentStep === "products" && (
          <motion.div key="products" {...pageVariants} transition={{ duration: 0.3 }}>
            <ProductShop />
          </motion.div>
        )}

        {(currentStep === "checkout" || currentStep === "confirmed") && (
          <motion.div key="checkout" {...pageVariants} transition={{ duration: 0.3 }}>
            <Checkout />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
