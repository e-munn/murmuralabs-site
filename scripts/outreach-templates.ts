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
  name: "Eli Munn",
  email: "elijah@munn.studio",
  org: "Aretian",
  site: "aretian.com",
  toolUrl: "https://aretian.com",
  toolDisplay: "aretian.com",
  tagline: "Urban analytics and design",
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

  const intro = `I'm Eli with Aretian, working on a forecasting tool for urban planners.`;

  const platformParagraph = `murmur models the second-order effects of urban decisions before they're made.`;

  const demoUrl = "https://youtu.be/67aNyscPWbM";
  const ctaLead = `Here's a 2-minute demo: `;
  const ctaTrail = `. Happy to walk you through it on Richmond's data if useful.`;
  const ctaParagraph = `${ctaLead}${demoUrl}${ctaTrail}`;
  const ctaHtml = `${escapeHtml(ctaLead)}<a href="${demoUrl}" style="color:#010029;border-bottom:1px solid #d4d8e2;text-decoration:none;">${demoUrl}</a>${escapeHtml(ctaTrail)}`;

  const sigText = `Best regards,\n\n${SENDER.name}\n${SENDER.org}\n${SENDER.tagline}\n${SENDER.toolDisplay}`;
  const aretianLogo =
    `<a href="${SENDER.toolUrl}" style="display:inline-block;margin-top:14px;text-decoration:none;">` +
    `<svg viewBox="95 105 682 105" width="132" height="20" role="img" aria-label="Aretian" xmlns="http://www.w3.org/2000/svg">` +
    `<path fill="#010029" d="M 178.148438 203 L 163.199219 203 L 156.828125 184.410156 L 120.296875 184.410156 L 113.929688 203 L 98.976562 203 L 132.90625 110.441406 L 144.21875 110.441406 Z M 152.929688 172.449219 L 138.886719 131.371094 L 124.457031 172.449219 Z M 284.746094 203 L 268.367188 203 L 248.867188 164 L 231.316406 164 L 231.316406 203 L 217.277344 203 L 217.277344 110.441406 L 253.15625 110.441406 C 270.707031 110.441406 281.886719 121.75 281.886719 137.480469 C 281.886719 150.738281 273.828125 159.191406 263.429688 162.050781 Z M 267.847656 137.609375 C 267.847656 128.511719 261.476562 123.050781 252.117188 123.050781 L 231.316406 123.050781 L 231.316406 152.039062 L 252.117188 152.039062 C 261.476562 152.039062 267.847656 146.710938 267.847656 137.609375 Z M 387.613281 203 L 328.464844 203 L 328.464844 110.441406 L 387.613281 110.441406 L 387.613281 123.050781 L 342.503906 123.050781 L 342.503906 150.089844 L 380.984375 150.089844 L 380.984375 162.570312 L 342.503906 162.570312 L 342.503906 190.390625 L 387.613281 190.390625 Z M 489.601562 123.050781 L 464.125 123.050781 L 464.125 203 L 450.082031 203 L 450.082031 123.050781 L 424.601562 123.050781 L 424.601562 110.441406 L 489.601562 110.441406 Z M 545.578125 203 L 531.539062 203 L 531.539062 110.441406 L 545.578125 110.441406 Z M 663.871094 203 L 648.921875 203 L 642.550781 184.410156 L 606.019531 184.410156 L 599.652344 203 L 584.699219 203 L 618.628906 110.441406 L 629.941406 110.441406 Z M 638.652344 172.449219 L 624.609375 131.371094 L 610.179688 172.449219 Z M 772.679688 203 L 759.808594 203 L 717.039062 137.871094 L 717.039062 203 L 703 203 L 703 110.441406 L 715.871094 110.441406 L 758.640625 175.441406 L 758.640625 110.441406 L 772.679688 110.441406 Z" />` +
    `</svg></a>`;
  const sigHtml =
    `<hr style="border:0;border-top:1px solid #d4d8e2;margin:28px 0 20px 0;">` +
    `<p style="margin:0 0 4px 0;color:#010029;">Best regards,</p>` +
    `<p style="margin:16px 0 4px 0;color:#010029;font-weight:600;letter-spacing:0.01em;">${SENDER.name}</p>` +
    `<p style="margin:0;color:#3d4163;font-size:14px;line-height:1.5;">${SENDER.org}<br>` +
    `<span style="color:#5a5e7a;font-style:italic;">${SENDER.tagline}</span><br>` +
    `<a href="${SENDER.toolUrl}" style="color:#010029;text-decoration:none;border-bottom:1px solid #d4d8e2;">${SENDER.toolDisplay}</a></p>` +
    aretianLogo;

  const textParts = [
    `Dear ${target.salutation},`,
    intro,
    platformParagraph,
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
    `<p style="${bodyStyle}">${ctaHtml}</p>`,
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
