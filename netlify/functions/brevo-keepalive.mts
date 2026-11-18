// Tâche planifiée Netlify : chaque lundi à 7 h (heure UTC), elle utilise la clé
// Brevo pour la garder active (Brevo la désactive après 90 jours sans usage) et
// vérifie que tout fonctionne. En cas de problème, elle vous alerte :
//   1. par e-mail via Brevo (si l'envoi fonctionne encore) ;
//   2. en secours, via un formulaire Netlify (Netlify vous envoie la notification),
//      utile si la clé Brevo ne fonctionne plus du tout.
// Lancement manuel possible : Netlify > Logs > Functions > brevo-keepalive > « Run now ».

import { brevoHealthCheck, describe, sendEmail, type HealthReport } from "../../src/lib/brevo";

export default async function brevoKeepalive(): Promise<Response> {
  const report = await brevoHealthCheck();
  console.log("[brevo-keepalive]", JSON.stringify(report));
  if (!report.ok) await alert(report);
  return Response.json(report, { status: report.ok ? 200 : 500 });
}

export const config = { schedule: "0 7 * * 1" };

async function alert(report: HealthReport) {
  const to = process.env.ALERT_EMAIL || "contact@champagnedelaube.fr";
  const subject = "⚠️ Site Champagne de l'Aube : la clé Brevo demande votre attention";
  const message = [
    "La vérification hebdomadaire de Brevo a détecté un problème :",
    "",
    `• Accès aux contacts : ${report.contacts}`,
    `• Envoi d'e-mails : ${report.envoi}`,
    `• Échéance de la clé : ${report.echeance}`,
    "",
    "Tant que ce n'est pas réglé, les formulaires du site risquent de ne plus envoyer d'e-mails.",
    "Marche à suivre : README du projet, section « Renouveler la clé Brevo ».",
  ].join("\n");

  // 1. Par Brevo.
  try {
    await sendEmail({ to, subject, text: message });
  } catch (e) {
    console.error("[brevo-keepalive] Alerte Brevo impossible :", describe(e));
  }

  // 2. En secours, par un formulaire Netlify (public/__forms.html).
  const site = process.env.URL;
  if (!site) return;
  try {
    const res = await fetch(`${site}/__forms.html`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": "alerte-technique", sujet: subject, message }).toString(),
    });
    if (!res.ok) console.error("[brevo-keepalive] Alerte Netlify Forms refusée :", res.status);
  } catch (e) {
    console.error("[brevo-keepalive] Alerte Netlify Forms impossible :", describe(e));
  }
}
