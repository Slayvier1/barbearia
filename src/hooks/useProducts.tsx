import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sort_order: number;
  active: boolean;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return (data || []) as ProductRow[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
