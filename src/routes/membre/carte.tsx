import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Watermark } from "@/components/Watermark";
import logo from "@/assets/mugec-logo.png";
import { Download, Printer, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const Route = createFileRoute("/membre/carte")({
  component: Page,
});

type Member = {
  nom?: string;
  prenoms?: string;
  email?: string;
  telephone?: string;
  collectivite?: string;
  region?: string;
  fonction?: string;
  matricule?: string;
  cni?: string;
  date_naissance?: string;
  lieu_naissance?: string;
};

function Page() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Member>({});
  const [qr, setQr] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user && isSupabaseConfigured) nav({ to: "/login" });
  }, [loading, user, nav]);

  useEffect(() => {
    (async () => {
      if (user && isSupabaseConfigured) {
        const { data } = await supabase.from("members").select("*").eq("user_id", user.id).maybeSingle();
        if (data) setM(data as Member);
      } else {
        setM({
          nom: "DEMO",
          prenoms: "Utilisateur",
          email: "demo@mugec-ci.org",
          telephone: "+225 00 00 00 00",
          collectivite: "Mairie de Cocody",
          region: "Abidjan",
          fonction: "Agent administratif",
          matricule: "MUGEC-2026-0001",
          cni: "CI00000000",
          date_naissance: "1985-04-12",
          lieu_naissance: "Abidjan",
        });
      }
    })();
  }, [user]);

  useEffect(() => {
    const id = m.matricule ?? user?.id ?? "demo";
    QRCode.toDataURL(`https://mugec-ci.org/m/${id}`, { width: 200, margin: 0 }).then(setQr);
  }, [m, user]);

  async function downloadPDF() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`fiche-membre-${m.matricule ?? "mugec"}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Fiche officielle de membre</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Imprimer
            </Button>
            <Button onClick={downloadPDF} disabled={busy}>
              <Download className="mr-2 h-4 w-4" /> {busy ? "Génération…" : "Télécharger en PDF"}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Fiche imprimable avec FILIGRANE */}
            <div ref={ref} className="relative bg-white p-10 text-slate-800" style={{ minHeight: 1000 }}>
              <Watermark opacity={0.08} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between border-b-4 border-primary pb-4">
                  <img src={logo} alt="MUGEC-CI" className="h-20 w-auto" />
                  <div className="text-right text-xs">
                    <div className="font-semibold">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
                    <div>Union – Discipline – Travail</div>
                    <div className="mt-2 font-bold text-primary">FICHE D'ADHÉSION N° {m.matricule ?? "—"}</div>
                  </div>
                </div>

                <h2 className="mt-6 text-center text-xl font-bold uppercase tracking-wide text-primary">
                  Mutuelle Générale du Personnel des Collectivités Territoriales
                </h2>

                <div className="mt-8 grid grid-cols-3 gap-6">
                  {/* Photo */}
                  <div className="col-span-1">
                    <div className="flex h-44 w-36 items-center justify-center rounded border-2 border-dashed text-xs text-muted-foreground">
                      Photo
                    </div>
                    {qr && <img src={qr} alt="QR" className="mt-4 h-28 w-28" />}
                  </div>

                  {/* Infos */}
                  <div className="col-span-2 space-y-2 text-sm">
                    <Info label="Nom" v={m.nom} />
                    <Info label="Prénoms" v={m.prenoms} />
                    <Info label="Date & lieu de naissance" v={`${m.date_naissance ?? "—"} à ${m.lieu_naissance ?? "—"}`} />
                    <Info label="N° CNI" v={m.cni} />
                    <Info label="Téléphone" v={m.telephone} />
                    <Info label="E-mail" v={m.email} />
                    <Info label="Collectivité" v={m.collectivite} />
                    <Info label="Région" v={m.region} />
                    <Info label="Fonction" v={m.fonction} />
                    <Info label="Matricule mutuelle" v={m.matricule} />
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-12 grid grid-cols-2 gap-12 text-xs">
                  <div className="border-t pt-2 text-center">Signature du membre</div>
                  <div className="border-t pt-2 text-center">Cachet & signature MUGEC-CI</div>
                </div>

                <div className="mt-10 text-center text-[10px] text-muted-foreground">
                  Document généré électroniquement par la plateforme MUGEC-CI — Valable avec QR Code vérifiable.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </div>
  );
}

function Info({ label, v }: { label: string; v?: string }) {
  return (
    <div className="flex gap-2 border-b border-dotted pb-1">
      <span className="w-56 font-semibold text-primary">{label} :</span>
      <span>{v ?? "—"}</span>
    </div>
  );
}
