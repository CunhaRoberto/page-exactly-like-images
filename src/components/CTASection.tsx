import { MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
          Distribuímos Produtos
        </h2>
        <h3 className="text-lg md:text-xl font-bold text-primary mb-4">
          Entregamos Confiança
        </h3>
        <p className="text-sm text-muted-foreground mb-2">Entregamos em todo Brasil</p>
        <p className="text-sm text-muted-foreground mb-6">
          Fale com nosso time de vendas e faça seu pedido
        </p>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-primary-foreground font-semibold text-sm px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
        >
          <MessageCircle size={18} />
          Fale Conosco
        </a>
      </div>
    </section>
  );
};

export default CTASection;
