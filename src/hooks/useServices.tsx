import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceRow {
  id: string;
  name: string;
  duration: number;
  price: number;
  icon: string;
  sort_order: number;
  active: boolean;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ServiceRow[];
    },
  });
}
