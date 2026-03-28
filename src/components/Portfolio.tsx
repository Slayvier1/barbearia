import { motion } from "framer-motion";
import { portfolioImages } from "@/lib/data";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Portfolio() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: dbPhotos = [] } = useQuery({
    queryKey: ["portfolio-photos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("portfolio_photos")
        .select("*")
        .order("sort_order");
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const images = dbPhotos.length > 0
    ? dbPhotos.map((p: any) => {
        const { data } = supabase.storage.from("portfolio").getPublicUrl(p.storage_path);
        return { url: data.publicUrl, caption: p.caption };
      })
    : portfolioImages.map((url) => ({ url, caption: "" }));

  return (
    <section className="py-8">
      <h2 className="font-display text-3xl text-foreground mb-6 px-5">NOSSOS CORTES</h2>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-56 h-56 rounded-xl overflow-hidden snap-center border border-border"
          >
            <PortfolioImage src={img.url} alt={img.caption || `Corte ${i + 1}`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PortfolioImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-card flex items-center justify-center text-muted-foreground text-3xl">
        ✂️
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
