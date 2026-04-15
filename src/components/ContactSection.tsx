import { Phone, MapPin, Clock, Mail, Instagram } from "lucide-react";
import brandsBanner from "@/assets/brands-banner.jpg";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

const ContactSection = () => {
  
 

  return (
    
    <section id="contato" className="py-20 bg-muted">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,#primary_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-3xl">
        {/* Frase Principal - O Propósito */}
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
          Mais que produtos, entregamos a segurança que você precisa para transformar vidas.
        </h2>
        
        {/* Texto de Apoio - Logística e Parceria */}
        <div className="space-y-4 mb-10">
          <p className="text-lg text-muted-foreground font-medium">
            A distância não é barreira para a nossa parceria.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Sediados em São José do Rio Preto, contamos com uma logística especializada via Correios 
            para garantir que a excelência dos nossos produtos chegue com agilidade à sua região, 
            em qualquer lugar do Brasil.
          </p>
          <p className="text-sm md:text-base text-foreground font-semibold">
            Faça parte da nossa rede de parceiros e leve essa confiança para seus pacientes.
          </p>
        </div>
        
        {/* Botão de Ação - Mais limpo e focado */}
       
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">
          Nossos contatos
        </h2>

        {/* Contact info card */}
        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6 mb-12">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <span>Atendimento de Segunda a Sexta das 08h às 17h</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <span>Telefone/WhatsApp: (11) 99146-3008</span>
            </div>
             <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/lu_toxinasfast/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <Instagram size={14} /> Instagram
            </a>
            </div>         
                      
          </div>
        </div>        
      </div>
    </section>
  );
};

export default ContactSection;
