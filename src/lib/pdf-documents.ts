/**
 * Génération côté client des documents pré-remplis (fiche d'adhésion +
 * autorisation de prélèvement) avec filigrane MUGEC-CI.
 */
import jsPDF from "jspdf";
import watermarkUrl from "@/assets/mugec-watermark.png";

export type DraftData = {
  nom?: string;
  prenoms?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  sexe?: "M" | "F";
  email?: string;
  telephone?: string;
  cni?: string;
  adresse?: string;
  collectivite?: string;
  region?: string;
  direction?: string;
  fonction?: string;
  matriculePro?: string;
  dateEmbauche?: string;
  ayantsDroit?: string;
};

let cachedWatermark: string | null = null;
async function loadWatermark(): Promise<string> {
  if (cachedWatermark) return cachedWatermark;
  const res = await fetch(watermarkUrl);
  const blob = await res.blob();
  cachedWatermark = await new Promise<string>((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.readAsDataURL(blob);
  });
  return cachedWatermark!;
}

function addWatermark(pdf: jsPDF, dataUrl: string) {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const w = pageW * 0.7;
  const h = w * 0.7; // ratio approximatif image
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  // @ts-expect-error setGState exists in jspdf runtime
  const g = pdf.GState ? new pdf.GState({ opacity: 0.08 }) : null;
  // @ts-expect-error setGState
  if (g) pdf.setGState(g);
  pdf.addImage(dataUrl, "PNG", x, y, w, h, undefined, "FAST");
  // @ts-expect-error reset
  if (g) pdf.setGState(new pdf.GState({ opacity: 1 }));
}

function header(pdf: jsPDF, title: string) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("RÉPUBLIQUE DE CÔTE D'IVOIRE", 105, 15, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Union – Discipline – Travail", 105, 20, { align: "center" });
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(20, 90, 50);
  pdf.text("MUGEC-CI", 105, 30, { align: "center" });
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  pdf.text("Mutuelle Générale du Personnel des Collectivités Territoriales", 105, 35, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.text(title, 105, 48, { align: "center" });
  pdf.setLineWidth(0.5);
  pdf.line(20, 51, 190, 51);
}

function field(pdf: jsPDF, label: string, value: string | undefined, x: number, y: number, w = 170) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(20, 90, 50);
  pdf.text(label, x, y);
  pdf.setFont("courier", "normal"); // proche d'une saisie manuscrite
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 180); // bleu manuscrit
  pdf.text(value && value.trim() ? value : "—", x, y + 5, { maxWidth: w });
  pdf.setTextColor(0, 0, 0);
  pdf.setDrawColor(180);
  pdf.line(x, y + 7, x + w, y + 7);
}

export async function generateFicheAdhesionPDF(d: DraftData): Promise<Blob> {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const wm = await loadWatermark();
  addWatermark(pdf, wm);
  header(pdf, "FICHE D'ADHÉSION");

  let y = 60;
  field(pdf, "Nom", d.nom, 20, y); field(pdf, "Prénoms", d.prenoms, 110, y, 80); y += 14;
  field(pdf, "Date de naissance", d.dateNaissance, 20, y, 80);
  field(pdf, "Lieu de naissance", d.lieuNaissance, 110, y, 80); y += 14;
  field(pdf, "Sexe", d.sexe === "M" ? "Masculin" : d.sexe === "F" ? "Féminin" : "", 20, y, 80);
  field(pdf, "N° CNI", d.cni, 110, y, 80); y += 14;
  field(pdf, "Téléphone", d.telephone, 20, y, 80);
  field(pdf, "E-mail", d.email, 110, y, 80); y += 14;
  field(pdf, "Adresse", d.adresse, 20, y, 170); y += 14;
  field(pdf, "Collectivité", d.collectivite, 20, y, 80);
  field(pdf, "Région", d.region, 110, y, 80); y += 14;
  field(pdf, "Direction / Service", d.direction, 20, y, 80);
  field(pdf, "Fonction", d.fonction, 110, y, 80); y += 14;
  field(pdf, "Matricule professionnel", d.matriculePro, 20, y, 80);
  field(pdf, "Date d'embauche", d.dateEmbauche, 110, y, 80); y += 16;
  field(pdf, "Ayants-droit", d.ayantsDroit, 20, y, 170); y += 22;

  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
  pdf.text(
    "Je soussigné(e), certifie l'exactitude des informations ci-dessus et sollicite mon adhésion à la MUGEC-CI. Je déclare avoir pris connaissance des statuts et du règlement intérieur.",
    20, y, { maxWidth: 170 },
  );
  y += 22;
  pdf.line(25, y, 90, y); pdf.text("Signature du membre", 35, y + 5);
  pdf.line(120, y, 185, y); pdf.text("Cachet MUGEC-CI", 135, y + 5);

  pdf.setFontSize(8); pdf.setTextColor(120);
  pdf.text("Document pré-rempli automatiquement — à imprimer, signer puis téléverser.", 105, 285, { align: "center" });

  return pdf.output("blob");
}

export async function generateAutorisationPrelevementPDF(d: DraftData): Promise<Blob> {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const wm = await loadWatermark();
  addWatermark(pdf, wm);
  header(pdf, "AUTORISATION DE PRÉLÈVEMENT");

  let y = 60;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
  pdf.text(
    "Je soussigné(e), agent des Collectivités Territoriales de Côte d'Ivoire, autorise par la présente la MUGEC-CI à effectuer un prélèvement mensuel sur mon salaire au titre de ma cotisation mutualiste.",
    20, y, { maxWidth: 170 },
  );
  y += 20;
  field(pdf, "Nom & Prénoms", `${d.nom ?? ""} ${d.prenoms ?? ""}`.trim(), 20, y, 170); y += 14;
  field(pdf, "N° CNI", d.cni, 20, y, 80);
  field(pdf, "Matricule professionnel", d.matriculePro, 110, y, 80); y += 14;
  field(pdf, "Collectivité employeur", d.collectivite, 20, y, 80);
  field(pdf, "Région", d.region, 110, y, 80); y += 14;
  field(pdf, "Fonction", d.fonction, 20, y, 80);
  field(pdf, "Téléphone", d.telephone, 110, y, 80); y += 14;
  field(pdf, "Adresse", d.adresse, 20, y, 170); y += 16;

  field(pdf, "Montant mensuel (FCFA)", "2 000", 20, y, 80);
  field(pdf, "Date d'effet", new Date().toLocaleDateString("fr-FR"), 110, y, 80); y += 20;

  pdf.setFontSize(10);
  pdf.text(
    "La présente autorisation reste valable jusqu'à ma démission régulièrement notifiée à la MUGEC-CI ou jusqu'à mon départ à la retraite. Mention obligatoire à reporter à la main : « Lu et approuvé ».",
    20, y, { maxWidth: 170 },
  );
  y += 24;

  pdf.line(25, y, 90, y); pdf.text("« Lu et approuvé » + Signature", 25, y + 5);
  pdf.line(120, y, 185, y); pdf.text("Fait à __________ le _______", 122, y + 5);

  pdf.setFontSize(8); pdf.setTextColor(120);
  pdf.text("Document pré-rempli automatiquement — à imprimer, signer puis téléverser.", 105, 285, { align: "center" });

  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
}
