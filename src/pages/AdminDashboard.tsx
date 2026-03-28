import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useServices } from "@/hooks/useServices";
import { useProducts } from "@/hooks/useProducts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Save, Plus, Trash2, Scissors, ShoppingBag, Camera, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import logo from "../assets/lpz-logo.png";

type Tab = "services" | "products" | "photos";

export default function AdminDashboard() {
  const { signOut, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: services = [], isLoading: sLoading } = useServices();
  const { data: products = [], isLoading: pLoading } = useProducts();
  const [tab, setTab] = useState<Tab>("services");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-5">
        <h1 className="font-display text-3xl text-foreground mb-2">ACESSO NEGADO</h1>
        <p className="text-muted-foreground text-sm mb-4">Você não tem permissão de administrador.</p>
        <Button onClick={() => navigate("/")} variant="outline">Voltar ao site</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
        <img src={logo} alt="Logo" className="h-10" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">ADMIN</span>
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("services")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === "services" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          <Scissors size={16} /> Serviços
        </button>
        <button
          onClick={() => setTab("products")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === "products" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          <ShoppingBag size={16} /> Produtos
        </button>
        <button
          onClick={() => setTab("photos")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === "photos" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          <Camera size={16} /> Fotos
        </button>
      </div>

      <div className="px-5 py-6">
        {tab === "services" ? (
          <ServiceEditor services={services} loading={sLoading} queryClient={queryClient} />
        ) : tab === "products" ? (
          <ProductEditor products={products} loading={pLoading} queryClient={queryClient} />
        ) : (
          <PhotoEditor queryClient={queryClient} />
        )}
      </div>
    </div>
  );
}

function ServiceEditor({ services, loading, queryClient }: { services: any[]; loading: boolean; queryClient: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", duration: 0, price: 0, icon: "" });

  if (loading) return <p className="text-muted-foreground text-sm">Carregando...</p>;

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, duration: s.duration, price: Number(s.price), icon: s.icon });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("services").update({
      name: form.name,
      duration: form.duration,
      price: form.price,
      icon: form.icon,
    }).eq("id", editingId);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Serviço atualizado!");
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const addNew = async () => {
    const { error } = await supabase.from("services").insert({
      name: "Novo Serviço",
      duration: 30,
      price: 0,
      icon: "✂️",
      sort_order: services.length + 1,
    });
    if (error) { toast.error("Erro ao adicionar"); return; }
    toast.success("Serviço adicionado!");
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("Erro ao deletar"); return; }
    toast.success("Serviço removido!");
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-foreground">SERVIÇOS</h2>
        <Button size="sm" onClick={addNew} className="gap-1"><Plus size={14} /> Novo</Button>
      </div>
      <div className="space-y-3">
        {services.map((s) => (
          <motion.div
            key={s.id}
            layout
            className="bg-card border border-border rounded-xl p-4"
          >
            {editingId === s.id ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} className="w-16 bg-secondary border-border text-center" placeholder="Emoji" />
                  <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border" placeholder="Nome" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground">Duração (min)</label>
                    <Input type="number" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 0 }))} className="bg-secondary border-border" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground">Preço (R$)</label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="gap-1"><Save size={14} /> Salvar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" onClick={() => startEdit(s)}>
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">R$ {Number(s.price).toFixed(2)}</span>
                  <button onClick={() => deleteService(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProductEditor({ products, loading, queryClient }: { products: any[]; loading: boolean; queryClient: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, category: "", image: "" });

  if (loading) return <p className="text-muted-foreground text-sm">Carregando...</p>;

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: Number(p.price), category: p.category, image: p.image });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("products").update({
      name: form.name,
      price: form.price,
      category: form.category,
      image: form.image,
    }).eq("id", editingId);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Produto atualizado!");
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const addNew = async () => {
    const { error } = await supabase.from("products").insert({
      name: "Novo Produto",
      price: 0,
      category: "Outros",
      image: "📦",
      sort_order: products.length + 1,
    });
    if (error) { toast.error("Erro ao adicionar"); return; }
    toast.success("Produto adicionado!");
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Erro ao deletar"); return; }
    toast.success("Produto removido!");
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-foreground">PRODUTOS</h2>
        <Button size="sm" onClick={addNew} className="gap-1"><Plus size={14} /> Novo</Button>
      </div>
      <div className="space-y-3">
        {products.map((p) => (
          <motion.div
            key={p.id}
            layout
            className="bg-card border border-border rounded-xl p-4"
          >
            {editingId === p.id ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} className="w-16 bg-secondary border-border text-center" placeholder="Emoji" />
                  <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border" placeholder="Nome" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground">Categoria</label>
                    <Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="bg-secondary border-border" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground">Preço (R$)</label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="gap-1"><Save size={14} /> Salvar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" onClick={() => startEdit(p)}>
                  <span className="text-2xl">{p.image}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">R$ {Number(p.price).toFixed(2)}</span>
                  <button onClick={() => deleteProduct(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PhotoEditor({ queryClient }: { queryClient: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["portfolio-photos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("portfolio_photos")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, file);
      if (uploadError) {
        toast.error(`Erro ao enviar ${file.name}`);
        continue;
      }

      const { error: dbError } = await supabase.from("portfolio_photos").insert({
        storage_path: path,
        sort_order: photos.length,
      });
      if (dbError) toast.error("Erro ao salvar registro");
    }

    toast.success("Fotos enviadas!");
    queryClient.invalidateQueries({ queryKey: ["portfolio-photos"] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deletePhoto = async (photo: any) => {
    await supabase.storage.from("portfolio").remove([photo.storage_path]);
    const { error } = await supabase.from("portfolio_photos").delete().eq("id", photo.id);
    if (error) { toast.error("Erro ao deletar"); return; }
    toast.success("Foto removida!");
    queryClient.invalidateQueries({ queryKey: ["portfolio-photos"] });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-foreground">FOTOS</h2>
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-1"
        >
          <Upload size={14} /> {uploading ? "Enviando..." : "Enviar"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {photos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Camera size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma foto ainda. Envie fotos dos seus cortes!</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo: any) => (
          <motion.div key={photo.id} layout className="relative group rounded-xl overflow-hidden border border-border aspect-square">
            <img
              src={getPublicUrl(photo.storage_path)}
              alt={photo.caption || "Portfolio"}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => deletePhoto(photo)}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
