import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import nabota from "@/assets/nabota.jpg";
import botox from "@/assets/botox.jpg";
import productPreenchedor from "@/assets/product-preenchedor.jpg";
import productBioestimulador from "@/assets/product-bioestimulador.jpg";
import productFios from "@/assets/product-fios.jpg";

const products = [
  {
    name: "Toxina Botulínica",
    description: "Atenua as linhas de expressão, harmoniza os traços faciais e oferece um efeito seguro, personalizado e com precisão para cada perfil individual.",
    images: [nabota,botox],
  },
  {
    name: "Bioestimuladores",
    description: "Ativam a produção de colágeno de forma natural, promovendo um rejuvenescimento gradual e contribuindo para uma pele mais firme e elástica.",
    images: [productBioestimulador],
  },
  {
    name: "Preenchedores",
    description: "Suavizam marcas de expressão, restauram o volume perdido e realçam os contornos do rosto, entregando uma aparência equilibrada e naturalmente rejuvenescida.",
    images: [productPreenchedor],
  },
  {
    name: "Fios de PDO",
    description: "Proporcionam efeito lifting instantâneo e estimulam o colágeno de forma progressiva, promovendo firmeza e redefinindo os contornos faciais.",
    images: [productFios],
  },
];

const ProductCardCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [hasMultiple, images.length]);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="aspect-square overflow-hidden bg-muted relative group/carousel">
      <img
        src={images[current]}
        alt={`${name} ${current + 1}`}
        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        width={512}
        height={512}
      />
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Próximo"
          >
            <ChevronRight size={16} className="text-foreground" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`}
                aria-label={`Imagem ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductsSection = () => {
  return (
    <section id="produtos" className="relative py-20">
      <div className="absolute inset-0 bg-primary" style={{ clipPath: "ellipse(85% 100% at 50% 100%)" }} />

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground text-center mb-12">
          Nossos principais produtos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <ProductCardCarousel images={product.images} name={product.name} />
              <div className="p-4">
                <h3 className="font-bold text-sm text-foreground mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{product.description}</p>
                <a
                  href="#contato"
                  className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded hover:bg-primary-light transition-colors"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
