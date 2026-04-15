import { MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background text-center relative overflow-hidden">
      {/* Um detalhe sutil de fundo para dar sofisticação */}
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
        <a
          href="https://wa.me/5517992071482"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          <MessageCircle size={20} />
          Fale com um consultor
        </a>
      </div>
    </section>
  );
};

export default CTASection;
