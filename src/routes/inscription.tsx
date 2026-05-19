import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Watermark } from "@/components/Watermark";
import { toast } from "sonner";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Check, CreditCard, User, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/inscription")({
  component: Page,
});

const step1Schema = z.object({
  nom: z.string().trim().min(2, "Nom requis").max(100),
  prenoms: z.string().trim().min(2, "Prénoms requis").max(150),
  dateNaissance: z.string().min(1, "Date de naissance requise"),
  lieuNaissance: z.string().trim().min(2).max(100),
  sexe: z.enum(["M", "F"]),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().min(8, "Numéro invalide").max(20),
  cni: z.string().trim().min(4).max(30),
  adresse: z.string().trim().min(2).max(255),
});

const step2Schema = z.object({
  collectivite: z.string().trim().min(2, "Collectivité requise").max(150),
  region: z.string().trim().min(2).max(100),
  fonction: z.string().trim().min(2).max(150),
  matricule: z.string().trim().max(50).optional().or(z.literal("")),
  dateEmbauche: z.string().optional().or(z.literal("")),
  ayantsDroit: z.string().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & {
  password: string;
  paiement: string;
};

const steps = [
  { id: 1, label: "Identité", icon: User },
  { id: 2, label: "Profession", icon: Briefcase },
  { id: 3, label: "Paiement", icon: CreditCard },
];

function Page() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<FormData>>({ sexe: "M", paiement: "orange" });
  const [submitting, setSubmitting] = useState(false);

  const upd = (k: keyof FormData, v: string) => setData((d) => ({ ...d, [k]: v }));

  function validateStep(): boolean {
    try {
      if (step === 1) step1Schema.parse(data);
      if (step === 2) step2Schema.parse(data);
      if (step === 3) {
        if (!data.password || data.password.length < 8) {
          toast.error("Le mot de passe doit contenir au moins 8 caractères.");
          return false;
        }
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      return false;
    }
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        // Mode démo : simulate
        await new Promise((r) => setTimeout(r, 1200));
        toast.success("Adhésion enregistrée (mode démo). Connectez Supabase pour activer.");
        nav({ to: "/membre" });
        return;
      }
      // 1. Create auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: data.email!,
        password: data.password!,
      });
      if (authErr) throw authErr;
      const uid = authData.user?.id;
      // 2. Insert membre profile
      const { error: insErr } = await supabase.from("members").insert({
        user_id: uid,
        nom: data.nom,
        prenoms: data.prenoms,
        date_naissance: data.dateNaissance,
        lieu_naissance: data.lieuNaissance,
        sexe: data.sexe,
        email: data.email,
        telephone: data.telephone,
        cni: data.cni,
        adresse: data.adresse,
        collectivite: data.collectivite,
        region: data.region,
        fonction: data.fonction,
        matricule: data.matricule,
        date_embauche: data.dateEmbauche || null,
        ayants_droit: data.ayantsDroit,
        statut: "en_attente",
        paiement_methode: data.paiement,
        frais_paye: true,
      });
      if (insErr) throw insErr;
      toast.success("Adhésion enregistrée avec succès !");
      nav({ to: "/membre" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Formulaire d'inscription</h1>
        <p className="mt-2 text-muted-foreground">
          Étape {step} sur 3 — durée moyenne 5 minutes. Frais d'inscription : <strong>5 000 FCFA</strong>.
        </p>

        <div className="mt-6">
          <Progress value={(step / 3) * 100} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
                  s.id === step ? "border-primary bg-primary/5 text-primary" : s.id < step ? "border-accent/40 bg-accent/5 text-accent" : "text-muted-foreground"
                }`}
              >
                {s.id < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire avec FILIGRANE */}
        <Card className="relative mt-8 overflow-hidden">
          <Watermark opacity={0.05} />
          <CardContent className="relative p-8">
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nom" v={data.nom} on={(v) => upd("nom", v)} />
                <Field label="Prénoms" v={data.prenoms} on={(v) => upd("prenoms", v)} />
                <Field label="Date de naissance" type="date" v={data.dateNaissance} on={(v) => upd("dateNaissance", v)} />
                <Field label="Lieu de naissance" v={data.lieuNaissance} on={(v) => upd("lieuNaissance", v)} />
                <div>
                  <Label>Sexe</Label>
                  <Select value={data.sexe} onValueChange={(v) => upd("sexe", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="N° CNI" v={data.cni} on={(v) => upd("cni", v)} />
                <Field label="E-mail" type="email" v={data.email} on={(v) => upd("email", v)} />
                <Field label="Téléphone" v={data.telephone} on={(v) => upd("telephone", v)} />
                <div className="md:col-span-2">
                  <Label>Adresse</Label>
                  <Textarea value={data.adresse ?? ""} onChange={(e) => upd("adresse", e.target.value)} rows={2} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Collectivité (mairie, conseil régional…)" v={data.collectivite} on={(v) => upd("collectivite", v)} />
                <Field label="Région" v={data.region} on={(v) => upd("region", v)} />
                <Field label="Fonction" v={data.fonction} on={(v) => upd("fonction", v)} />
                <Field label="Matricule (optionnel)" v={data.matricule} on={(v) => upd("matricule", v)} />
                <Field label="Date d'embauche" type="date" v={data.dateEmbauche} on={(v) => upd("dateEmbauche", v)} />
                <div className="md:col-span-2">
                  <Label>Ayants-droit (conjoint, enfants…)</Label>
                  <Textarea
                    value={data.ayantsDroit ?? ""}
                    onChange={(e) => upd("ayantsDroit", e.target.value)}
                    rows={3}
                    placeholder="Ex : Conjoint — Aya Koffi, née le 12/03/1988. Enfants : Marc (2015), Léa (2019)…"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Choisissez votre moyen de paiement (5 000 FCFA)</Label>
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { id: "orange", name: "Orange Money" },
                      { id: "mtn", name: "MTN MoMo" },
                      { id: "wave", name: "Wave" },
                      { id: "moov", name: "Moov Money" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => upd("paiement", m.id)}
                        className={`rounded-md border p-4 text-sm font-medium transition ${
                          data.paiement === m.id ? "border-primary bg-primary/10 text-primary" : "hover:bg-secondary"
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Numéro de téléphone du paiement" v={data.telephone} on={(v) => upd("telephone", v)} />
                <div>
                  <Label>Créez un mot de passe (8 caractères min.)</Label>
                  <Input type="password" value={data.password ?? ""} onChange={(e) => upd("password", e.target.value)} />
                </div>
                <div className="rounded-md bg-secondary/60 p-4 text-sm text-muted-foreground">
                  En cliquant sur <strong>Payer & finaliser</strong>, vous acceptez les statuts de la MUGEC-CI
                  et autorisez le débit de 5 000 FCFA sur le numéro renseigné.
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={() => validateStep() && setStep((s) => s + 1)}>
                  Continuer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={submitting}>
                  {submitting ? "Traitement…" : "Payer & finaliser"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  v,
  on,
  type = "text",
}: {
  label: string;
  v?: string;
  on: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v ?? ""} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
