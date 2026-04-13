import heroBg from "@/assets/hero-bg.jpg";

const brands = ["LTHREAD", "SAYPHA", "BOTULIFT", "RADIESSE", "SCULPTRA"];

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[500px] flex items-center justify-center text-center pt-20"
    >
      <div className="absolute inset-0">
        <img src={heroBg} alt="Clínica estética" className="w-full h-full object-cover" width={1920} height={768} />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight max-w-3xl mx-auto">
          Produtos HOF para profissionais de estética. Pronta entrega para São José do Rio Preto, Mirassol e Bady Bassitt.
        </h1>
        <p className="mt-4 text-sm md:text-base text-primary-foreground/80 max-w-xl mx-auto">
          Somos distribuidores das melhores marcas do mercado
        </p>

        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-primary-foreground/70 text-sm md:text-base font-semibold tracking-widest"
            >
              {brand}
            </span>
          ))}
        </div>

        <a
          href="#produtos"
          className="mt-8 inline-block bg-primary-foreground text-primary font-semibold text-sm px-6 py-3 rounded-md hover:bg-primary-foreground/90 transition-colors"
        >
          Nossos Produtos
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
