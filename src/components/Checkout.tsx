import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, Clock, Scissors, Phone, User, ExternalLink, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

export default function Checkout() {
  const store = useStore();
  const {
    selectedServices, selectedProducts, selectedDate, selectedTime,
    customerName, setCustomerName, customerWhatsApp, setCustomerWhatsApp,
    currentStep, setStep, totalPrice, totalDuration, productsTotal, grandTotal, reset,
  } = store;

  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        customer_name: customerName,
        customer_whatsapp: customerWhatsApp,
        appointment_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        appointment_time: selectedTime || "",
        services: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
        products: selectedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })),
        total_price: grandTotal(),
      });
      if (error) {
        if (error.code === "23505") {
          toast.error("Este horário já foi reservado! Escolha outro.");
        } else {
          toast.error("Erro ao agendar. Tente novamente.");
        }
        setSubmitting(false);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
      setStep("confirmed");
    } catch {
      toast.error("Erro ao agendar.");
    }
    setSubmitting(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá LPZ Barber! Agendamento confirmado:\n` +
    `📋 Serviços: ${selectedServices.map(s => s.name).join(", ")}\n` +
    `📅 ${selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ""} às ${selectedTime}\n` +
    `💰 Total: R$ ${grandTotal().toFixed(2)}\n` +
    `👤 ${customerName}`
  );

  const calendarUrl = selectedDate && selectedTime
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("LPZ Barber - Agendamento")}&dates=${format(selectedDate, "yyyyMMdd")}T${selectedTime.replace(":", "")}00/${format(selectedDate, "yyyyMMdd")}T${selectedTime.replace(":", "")}00&details=${encodeURIComponent(`Serviços: ${selectedServices.map(s => s.name).join(", ")}`)}`
    : "#";

  const pixPayload = `00020126580014BR.GOV.BCB.PIX0136828299964091715204000053039865802BR5913LOS SANTOS6009ARAPIRACA62070503***6304`;

  if (currentStep === "confirmed") {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-5 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="text-primary" size={32} />
        </motion.div>
        <h2 className="font-display text-4xl text-foreground mb-2">AGENDAMENTO CONFIRMADO!</h2>
        <p className="text-muted-foreground text-sm mb-6">Escaneie o QR Code para pagar via PIX</p>

        <div className="bg-foreground rounded-2xl p-6 inline-block mb-6">
          <QRCodeSVG value={pixPayload} size={200} bgColor="hsl(0,0%,95%)" fgColor="hsl(0,0%,5%)" />
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Após o pagamento, o barbeiro será notificado automaticamente
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-foreground text-sm hover:border-primary transition-colors"
          >
            <Calendar size={16} /> Salvar no Google Calendar
            <ExternalLink size={12} />
          </a>
            <a
              href={`https://wa.me/5582996409171?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(142_71%_35%)] text-foreground text-sm font-medium"
            >
            <Phone size={16} /> Enviar via WhatsApp
          </a>
          <button
            onClick={reset}
            className="text-muted-foreground text-sm underline mt-2"
          >
            Fazer novo agendamento
          </button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-8"
    >
      <h2 className="font-display text-3xl text-foreground mb-6">FINALIZAR</h2>

      {/* Ticket summary */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl text-primary">TICKET</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">LPZ Barber</span>
        </div>
        <div className="h-px bg-border mb-4" />

        {selectedServices.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Scissors size={12} /> Serviços
            </p>
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between text-sm text-foreground py-1">
                <span>{s.icon} {s.name}</span>
                <span>R$ {s.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>⏱ {totalDuration()} min total</span>
              <span className="font-semibold text-foreground">R$ {totalPrice().toFixed(2)}</span>
            </div>
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">🛒 Produtos</p>
            {selectedProducts.map((p) => (
              <div key={p.id} className="flex justify-between text-sm text-foreground py-1">
                <span>{p.image} {p.name}</span>
                <span>R$ {p.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-end text-xs mt-1">
              <span className="font-semibold text-foreground">R$ {productsTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Calendar size={14} className="text-primary" />
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground mt-1">
              <Clock size={14} className="text-primary" />
              {selectedTime}
            </div>
          </div>
        )}

        <div className="h-px bg-border my-4" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-display text-2xl text-primary">
            R$ {grandTotal().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Customer form */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Seu nome"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="WhatsApp (ex: 11999999999)"
            value={customerWhatsApp}
            onChange={(e) => setCustomerWhatsApp(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      {/* Confirm CTA */}
      <button
        onClick={handleConfirm}
        disabled={submitting || !customerName || !customerWhatsApp || selectedServices.length === 0 || !selectedDate || !selectedTime}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display text-xl tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_hsl(45_100%_50%/0.3)] transition-all"
      >
        {submitting ? "AGENDANDO..." : "CONFIRMAR HORÁRIO"}
      </button>
    </motion.section>
  );
}
