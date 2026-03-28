import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/lpz-logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("Email ou senha incorretos");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="Los Santos Barber" className="h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl text-foreground">PAINEL ADMIN</h1>
          <p className="text-muted-foreground text-sm mt-1">Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-card border-border"
              required
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-card border-border"
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-5 font-display text-lg tracking-wider"
          >
            <LogIn size={18} />
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-6 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          ← Voltar ao site
        </button>
      </motion.div>
    </div>
  );
}
