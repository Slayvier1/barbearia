import { Instagram, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border px-5 py-8 text-center pb-24">
      <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
        <MapPin size={12} /> Rua Antônio Feliciano, 927A - Canafístula 📍 - AL
      </p>
      <a
        href="https://instagram.com/lpzbarber"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 text-sm text-foreground hover:text-primary transition-colors"
      >
        <Instagram size={16} /> @lpzbarber
      </a>
      <p className="text-muted-foreground/50 text-[10px] mt-4">© 2026 Los Santos Barber. Todos os direitos reservados.</p>
      
      <div className="mt-4 inline-block border border-border bg-black/80 rounded-md px-4 py-2">
        <span className="text-muted-foreground text-[10px] tracking-wider">creator: <a href="https://instagram.com/welltin.st" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@welltin.st</a></span>
      </div>
    </footer>
  );
}
