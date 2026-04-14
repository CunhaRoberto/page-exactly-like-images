import { Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <img src={logo} alt="logo" className="w-full h-full object-cover" width={1920} height={768} />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-foreground leading-tight">LU TOXINAS</p>
              <p className="text-xs text-primary-foreground/70 leading-tight">Produtos HOF</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-primary-foreground/70">
            <a href="#" className="flex items-center gap-1 hover:text-primary-foreground transition-colors">
              <Instagram size={14} /> Instagram
            </a>
           
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-primary-foreground/70">© 2026 – Todos os direitos reservados</p>
            <p className="text-xs text-primary-foreground/70">LU TOXINAS | Produtos HOF</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
