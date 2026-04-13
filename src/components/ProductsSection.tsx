import productToxina from "@/assets/product-toxina.jpg";
import productPreenchedor from "@/assets/product-preenchedor.jpg";
import productBioestimulador from "@/assets/product-bioestimulador.jpg";
import productFios from "@/assets/product-fios.jpg";
import productSkinbooster from "@/assets/product-skinbooster.jpg";

const products = [
  {
    name: "Toxina Botulínica",
    description: "Atenua as linhas de expressão, harmoniza os traços faciais e oferece um efeito seguro, personalizado e com precisão para cada perfil individual.",
    image: productToxina,
  },
  {
    name: "Bioestimuladores",
    description: "Ativam a produção de colágeno de forma natural, promovendo um rejuvenescimento gradual e contribuindo para uma pele mais firme e elástica.",
    image: productBioestimulador,
  },
  {
    name: "Preenchedores",
    description: "Suavizam marcas de expressão, restauram o volume perdido e realçam os contornos do rosto, entregando uma aparência equilibrada e naturalmente rejuvenescida.",
    image: productPreenchedor,
  },
  {
    name: "Fios de PDO",
    description: "Proporcionam efeito lifting instantâneo e estimulam o colágeno de forma progressiva, promovendo firmeza e redefinindo os contornos faciais.",
    image: productFios,
  },
 
];

const ProductsSection = () => {
  return (
    <section id="produtos" className="relative py-20">
      {/* Curved blue background */}
      <div className="absolute inset-0 bg-primary" style={{ clipPath: "ellipse(85% 100% at 50% 100%)" }} />

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground text-center mb-12">
          Nossos principais produtos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={512}
                  height={512}
                />
              </div>
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
