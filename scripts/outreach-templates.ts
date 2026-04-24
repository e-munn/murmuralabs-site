// Unified outreach email template for Richmond policymakers.
// One shared skeleton; per-target variables keep the voice consistent
// while preserving a single personalized sentence for each recipient.

export type TargetKey = "curl" | "velasco" | "robinson" | "jimenez" | "zepeda";

export interface Target {
  key: TargetKey;
  name: string;
  role: string;
  toEmail: string;
  salutation: string;
  subject: string;
  personalizedParagraph: string;
  corburnEligible?: boolean;
}

export const SENDER = {
  name: "Elijah Munn",
  email: "elijah@munn.studio",
  org: "Murmura Labs",
  site: "murmuralabs.com",
  toolUrl: "https://murmur.murmuralabs.com/scenarios",
  toolDisplay: "murmur.murmuralabs.com/scenarios",
  tagline: "Listen to the city.",
};

export const TARGETS: Record<TargetKey, Target> = {
  curl: {
    key: "curl",
    name: "Shasa Curl",
    role: "City Manager",
    toEmail: "shasa_curl@ci.richmond.ca.us",
    salutation: "City Manager Curl",
    subject: "Richmond neighborhood-level scenario modeling, built on your city's data",
    personalizedParagraph:
      "It may be useful as your office works through the major planning decisions on Richmond's plate this year, where understanding which neighborhoods benefit and which bear hidden costs often matters more than the headline of any single project.",
    corburnEligible: true,
  },
  velasco: {
    key: "velasco",
    name: "Lina Velasco",
    role: "Community Development Director",
    toEmail: "lina_velasco@ci.richmond.ca.us",
    salutation: "Director Velasco",
    subject: "Richmond neighborhood-level modeling, 118 data fields per hex cell",
    personalizedParagraph:
      "It may be particularly useful alongside your department's work on the sea level rise adaptation plan and the Reconnecting Communities implementation, where a quantitative layer on top of community input can sharpen where compounding risks actually concentrate.",
  },
  robinson: {
    key: "robinson",
    name: "Doria Robinson",
    role: "Councilmember, District 3",
    toEmail: "",
    salutation: "Councilmember Robinson",
    subject: "A Richmond equity and displacement modeling tool",
    personalizedParagraph:
      "Your work on the Black Resiliency Project and environmental justice in District 3 speaks to the kind of questions this tool is built to answer: how displacement pressure concentrates, where equity gaps widen or narrow, and who the most affected residents actually are in any scenario.",
  },
  jimenez: {
    key: "jimenez",
    name: "Claudia Jimenez",
    role: "Councilmember, District 6",
    toEmail: "",
    salutation: "Councilmember Jimenez",
    subject: "Neighborhood-level modeling for Richmond policy questions",
    personalizedParagraph:
      "It may be useful context for the allocation and equity questions that come up consistently in your work, where knowing how an investment ripples across neighborhoods often matters as much as the investment itself.",
  },
  zepeda: {
    key: "zepeda",
    name: "Cesar Zepeda",
    role: "Vice Mayor",
    toEmail: "",
    salutation: "Vice Mayor Zepeda",
    subject: "Modeling infrastructure impacts across Richmond neighborhoods",
    personalizedParagraph:
      "It aligns with your work on Richmond-San Rafael Bridge access and broader infrastructure investment, where modeling the ripple effects of a transit change or road project can show who gains access and who faces new costs at the block level.",
  },
};

const CORBURN_LINE =
  "Jason Corburn at UC Berkeley suggested we connect, given your collaboration on Health in All Policies. The health-equity analysis in murmur aligns closely with that framework.";

export function renderEmail(
  target: Target,
  opts: { includeCorburnIntro?: boolean } = {},
): { subject: string; text: string; html: string } {
  const corburn =
    opts.includeCorburnIntro && target.corburnEligible ? CORBURN_LINE : "";

  const intro = `I'm ${SENDER.name} from ${SENDER.org}, a small team working on urban analytics and network science. I wanted to share something we've built specifically on Richmond that may be useful to you.`;

  const platformParagraph = `murmur is a city intelligence platform that surfaces the second-order effects of urban decisions before they're made. We've modeled Richmond at the neighborhood level: 4,655 zones, each carrying 118 data fields covering demographics, health, pollution, housing, transit, and economic conditions. Apply a scenario (an investment, a rezoning, an infrastructure change) and the system computes cascading impacts across every zone.`;

  const ctaParagraph = `I'd welcome 15 minutes to walk you through the model on Richmond's data. If a live walkthrough is harder to schedule, I can follow up with a short demo video instead.`;

  const sigText = `Best regards,\n\n${SENDER.name}\n${SENDER.org}\n${SENDER.toolDisplay}\n${SENDER.tagline}`;
  const sigHtml = `<hr style="border:0;border-top:1px solid #e8dfd6;margin:28px 0 20px 0;">` +
    `<p style="margin:0 0 4px 0;color:#190f0a;">Best regards,</p>` +
    `<p style="margin:16px 0 4px 0;color:#7a4a2d;font-weight:600;letter-spacing:0.01em;">${SENDER.name}</p>` +
    `<p style="margin:0;color:#6b5a4e;font-size:14px;line-height:1.5;">${SENDER.org}<br>` +
    `<a href="${SENDER.toolUrl}" style="color:#7a4a2d;text-decoration:none;border-bottom:1px solid #e8dfd6;">${SENDER.toolDisplay}</a><br>` +
    `<span style="color:#9a8778;font-style:italic;">${SENDER.tagline}</span></p>`;

  const textParts = [
    `Dear ${target.salutation},`,
    intro,
    platformParagraph,
    target.personalizedParagraph,
    ctaParagraph,
    corburn,
    sigText,
  ].filter(Boolean);

  const text = textParts.join("\n\n");

  const bodyStyle = "margin:0 0 18px 0;";
  const htmlParts = [
    `<p style="${bodyStyle}">Dear ${escapeHtml(target.salutation)},</p>`,
    `<p style="${bodyStyle}">${escapeHtml(intro)}</p>`,
    `<p style="${bodyStyle}">${escapeHtml(platformParagraph)}</p>`,
    `<p style="${bodyStyle}">${escapeHtml(target.personalizedParagraph)}</p>`,
    `<p style="${bodyStyle}">${escapeHtml(ctaParagraph)}</p>`,
    corburn ? `<p style="${bodyStyle};color:#6b5a4e;font-style:italic;">${escapeHtml(corburn)}</p>` : "",
    sigHtml,
  ].filter(Boolean);

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#190f0a;max-width:560px;line-height:1.6;font-size:15px;padding:0;margin:0;">${htmlParts.join("")}</body></html>`;

  return { subject: target.subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
