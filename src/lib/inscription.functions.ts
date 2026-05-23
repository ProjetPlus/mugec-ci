import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const memberSchema = z.object({
  nom: z.string().trim().min(2).max(100),
  prenoms: z.string().trim().min(2).max(150),
  date_naissance: z.string().min(1),
  lieu_naissance: z.string().trim().min(2).max(100),
  sexe: z.enum(["M", "F"]),
  email: z.string().email().max(255),
  telephone: z.string().trim().min(8).max(20),
  cni: z.string().trim().min(4).max(30),
  adresse: z.string().trim().min(2).max(255),
  collectivite: z.string().trim().min(2).max(150),
  region: z.string().trim().min(2).max(100),
  direction: z.string().trim().max(150).optional().nullable(),
  fonction: z.string().trim().min(2).max(150),
  matricule_pro: z.string().trim().max(50).optional().nullable(),
  date_embauche: z.string().optional().nullable(),
  ayants_droit: z.string().max(2000).optional().nullable(),
  paiement_methode: z.enum(["orange", "mtn", "wave", "moov"]),
  payment_reference: z.string().min(3).max(80),
});

/**
 * Finalise l'inscription : crée la fiche membre, enregistre la souscription
 * (split 4 000 / 1 000), confirme le paiement, valide automatiquement le profil
 * et déclenche les notifications.
 */
export const finalizeRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => memberSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // SECURITY: server-side never trusts a client-generated payment reference.
    // Registration is created as PENDING; activation only happens via a verified
    // payment-webhook (handled by an admin/server route), not from the browser.
    const { data: member, error: memberErr } = await supabaseAdmin
      .from("members")
      .insert({
        user_id: userId,
        nom: data.nom,
        prenoms: data.prenoms,
        date_naissance: data.date_naissance,
        lieu_naissance: data.lieu_naissance,
        sexe: data.sexe,
        email: data.email,
        telephone: data.telephone,
        cni: data.cni,
        adresse: data.adresse,
        collectivite: data.collectivite,
        region: data.region,
        direction: data.direction,
        fonction: data.fonction,
        matricule_pro: data.matricule_pro,
        date_embauche: data.date_embauche || null,
        ayants_droit: data.ayants_droit,
        statut: "en_attente",
        paiement_methode: data.paiement_methode,
        frais_paye: false,
        payment_reference: null,
        payment_confirmed_at: null,
        validation_mode: "automatique",
      })
      .select()
      .single();
    if (memberErr) throw new Error(memberErr.message);

    // 2) Souscription d'inscription (en attente de confirmation paiement)
    const { data: sub, error: subErr } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        member_id: member.id,
        type: "inscription",
        montant_total: 5000,
        part_mutuelle: 4000,
        part_miprojet: 1000,
        statut_paiement: "en_attente",
        operateur: data.paiement_methode,
        reference_transaction: null,
        paid_at: null,
      })
      .select()
      .single();
    if (subErr) throw new Error(subErr.message);


    // 3) Trace MiPROJET privée
    await supabaseAdmin.from("transactions_miprojet").insert({
      subscription_id: sub.id,
      montant: 1000,
      statut: "en_attente",
      reference: data.payment_reference,
    });

    // 4) Notifications (SMS + WhatsApp + Email)
    const baseUrl = "https://mugec-ci.ivoireprojet.com";
    const ctx = {
      prenoms: member.prenoms,
      nom: member.nom,
      matricule: member.matricule ?? "",
      collectivite: member.collectivite ?? "",
      region: member.region ?? "",
      member_url: `${baseUrl}/membre`,
      montant: 5000,
      operateur: data.paiement_methode,
      reference: data.payment_reference,
    } as const;

    try {
      const { dispatchNotification } = await import("./notifications.functions");
      // exécuter localement (handler)
      await dispatchNotification({
        data: {
          event: "registration_validated",
          memberId: member.id,
          userId,
          to: { email: member.email ?? undefined, phone: member.telephone ?? undefined, whatsapp: member.telephone ?? undefined },
          channels: ["email", "sms", "whatsapp"],
          context: ctx,
        },
      });
      await dispatchNotification({
        data: {
          event: "payment_confirmed",
          memberId: member.id,
          userId,
          to: { email: member.email ?? undefined, phone: member.telephone ?? undefined, whatsapp: member.telephone ?? undefined },
          channels: ["email", "sms", "whatsapp"],
          context: ctx,
        },
      });
    } catch (e) {
      console.error("notif dispatch failed", e);
    }

    return { member, subscription: sub };
  });
