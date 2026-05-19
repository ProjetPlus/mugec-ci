import logo from "@/assets/mugec-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/40">
      <div className="container mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={logo} alt="MUGEC-CI" className="h-12 w-auto" />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Mutuelle Générale du Personnel des Collectivités Territoriales de Côte d'Ivoire — Solidarité, protection sociale et bien-être des agents.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Liens utiles</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Adhérer en ligne</li>
            <li>Espace membre</li>
            <li>Cotisations</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
          <p className="text-sm text-muted-foreground">
            Siège : Abidjan, Côte d'Ivoire
            <br />
            contact@mugec-ci.org
          </p>
        </div>
      </div>
      <div className="border-t bg-background/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MUGEC-CI. Tous droits réservés.
      </div>
    </footer>
  );
}
