import { motion } from "framer-motion";
import ownerPhoto from "../assets/owner-photo.png";

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden px-5 py-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-center gap-6 max-w-lg mx-auto">
        {/* Texto à esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-left flex-1"
        >
          <h1 className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            LOS SANTOS
            <br />
            <span className="text-primary">BARBER</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-xs tracking-widest uppercase">
            Premium Barber Experience
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-4 h-px w-20 bg-primary origin-left"
          />
        </motion.div>

        {/* Foto do dono em oval */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex-shrink-0"
        >
          <div className="w-28 h-36 md:w-36 md:h-44 rounded-[50%] overflow-hidden border-2 border-primary shadow-lg shadow-primary/20">
            <img
              src={ownerPhoto}
              alt="Dono do Los Santos Barber"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
