import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "../assets/lpz-logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="w-10" />
      <img src={logo} alt="LPZ Barber" className="h-12 object-contain" />
      <button
        onClick={() => navigate(isAdmin ? "/admin" : "/login")}
        className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <User size={18} />
      </button>
    </motion.header>
  );
}
