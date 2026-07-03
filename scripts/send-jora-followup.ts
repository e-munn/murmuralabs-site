// One-off warm follow-up to Jora Atienza Washington after the 2026-05-14
// in-person meeting at 440 Civic Center Plaza. Murmur-only branding.
// No Aretian mention. Single test target by default (elijah@munn.studio).
//
// Usage:
//   npx tsx --env-file=.env scripts/send-jora-followup.ts --dry-run
//   npx tsx --env-file=.env scripts/send-jora-followup.ts                    # sends to elijah@munn.studio
//   npx tsx --env-file=.env scripts/send-jora-followup.ts --to <addr>        # override recipient
//   npx tsx --env-file=.env scripts/send-jora-followup.ts --real             # sends to Jora's real address

import { Resend } from "resend";

const FROM = "Eli Munn <elijah@murmuralabs.com>";
const REPLY_TO = "elijah@munn.studio";
const TEST_TO = "elijah@munn.studio";
const JORA_TO = "Jora_AtienzaWashington@richmondca.gov";
const VIDEO_URL = "https://youtu.be/67aNyscPWbM";

const SUBJECT = "Following up — yesterday";

const TEXT = `Jora —

Really appreciated the conversation yesterday. As promised, here's a short look at murmur: ${VIDEO_URL}. It's a tool for modeling how a planning decision in one Richmond neighborhood ripples into outcomes a few blocks over — schools, families, air, displacement — the kind of compound effects your office tracks. No follow-up needed from your end; I'll check back when I'm next in Richmond.

— Eli

Eli Munn
Murmura Labs
murmuralabs.com`;

const HTML = `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#190f0a;max-width:560px;line-height:1.6;font-size:15px;padding:0;margin:0;">
<p style="margin:0 0 18px 0;">Jora —</p>
<p style="margin:0 0 18px 0;">Really appreciated the conversation yesterday. As promised, here's a short look at murmur: <a href="${VIDEO_URL}" style="color:#190f0a;border-bottom:1px solid #d4d8e2;text-decoration:none;">${VIDEO_URL}</a>. It's a tool for modeling how a planning decision in one Richmond neighborhood ripples into outcomes a few blocks over — schools, families, air, displacement — the kind of compound effects your office tracks. No follow-up needed from your end; I'll check back when I'm next in Richmond.</p>
<p style="margin:0 0 18px 0;">— Eli</p>
<hr style="border:0;border-top:1px solid #d4d8e2;margin:28px 0 20px 0;">
<p style="margin:16px 0 4px 0;color:#190f0a;font-weight:600;letter-spacing:0.01em;">Eli Munn</p>
<p style="margin:0;color:#3d4163;font-size:14px;line-height:1.5;">Murmura Labs<br>
<a href="https://murmuralabs.com" style="color:#190f0a;text-decoration:none;border-bottom:1px solid #d4d8e2;">murmuralabs.com</a></p>
</body></html>`;

interface Args {
  to: string;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const has = (flag: string): boolean => argv.includes(flag);
  const overrideTo = get("--to");
  const real = has("--real");
  const to = overrideTo ?? (real ? JORA_TO : TEST_TO);
  return { to, dryRun: has("--dry-run") };
}

async function main() {
  const args = parseArgs();

  console.log("───────────────────────────────────────");
  console.log(`To:      ${args.to}`);
  console.log(`From:    ${FROM}`);
  console.log(`ReplyTo: ${REPLY_TO}`);
  console.log(`Subject: ${SUBJECT}`);
  console.log("───────────────────────────────────────");
  console.log(TEXT);
  console.log("───────────────────────────────────────");

  if (args.dryRun) {
    console.log("[dry-run] No email sent.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not set. Add it to .env (or your shell) before sending.");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: SUBJECT,
    text: TEXT,
    html: HTML,
    replyTo: REPLY_TO,
    tags: [
      { name: "campaign", value: "jora-followup-2026-05" },
      { name: "kind", value: "warm-followup" },
    ],
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(1);
  }
  console.log(`Sent. Resend id: ${data?.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
