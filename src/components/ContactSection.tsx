import { Phone, MapPin, Clock, Mail } from "lucide-react";
import brandsBanner from "@/assets/brands-banner.jpg";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", city: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Nome: ${formData.name}%0ATelefone: ${formData.phone}%0AEmail: ${formData.email}%0ACidade: ${formData.city}%0AMensagem: ${formData.message}`;
    window.open(`https://wa.me/5511999999999?text=${text}`, "_blank");
  };

  return (
    <section id="contato" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">
          Fale com nosso time
        </h2>

        {/* Contact info card */}
        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6 mb-12">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <span>Telefone/WhatsApp: (11) 99146-3008</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <span>Atendimento de Segunda a Sexta das 08h às 17h</span>
            </div>
            {/* <div className="flex items-center gap-3">
              <Mail size={16} className="text-primary shrink-0" />
              <span>sac@distribuidoradl.com.br</span>
            </div> */}
          </div>
        </div>

        {/* Contact form + brands */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          <div className="flex justify-center">
            <img
              src={brandsBanner}
              alt="Marcas parceiras"
              className="rounded-lg shadow-md max-w-sm w-full"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>

          {/* <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Envie-nos uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Seu Completo"
                  className="w-full px-3 py-2 text-sm rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Número (WhatsApp)"
                  className="w-full px-3 py-2 text-sm rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 text-sm rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Cidade"
                  className="w-full px-3 py-2 text-sm rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Mensagem"
                rows={4}
                className="w-full px-3 py-2 text-sm rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded hover:bg-primary-light transition-colors"
              >
                Enviar ✉
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
