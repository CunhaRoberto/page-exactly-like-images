import marcas from "@/assets/marcas.jpg";

const stats = [
  { value: "+10", label: "Anos de Mercado" },
  { value: "+8.000", label: "Clientes Atendidos" },
  { value: "+20 Mil", label: "Pedidos Entregues" },
  { value: "+98,25%", label: "Clientes Satisfeitos" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src={marcas}
              alt="Tratamento estético"
              className="rounded-lg shadow-lg max-w-sm w-full object-cover"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Segurança e qualidade para quem leva a beleza a sério
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A DL Distribuidora é referência em soluções para estética avançada, com um portfólio completo de produtos de alta performance e procedência garantida.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Mais do que fornecer, somos parceiros, construindo de confiança, oferecendo qualidade, agilidade e suporte em cada etapa.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Toda nossa linha de produtos são registrados e certificados pela Anvisa.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="animate-fade-in-up">
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
