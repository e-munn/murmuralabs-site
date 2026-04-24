// Send a Richmond outreach email via Resend.
//
// Usage:
//   npx tsx --env-file=.env.local scripts/send-outreach-email.ts \
//     --target curl \
//     --to elijah@munn.studio \
//     [--from "Elijah Munn <onboarding@resend.dev>"] \
//     [--corburn] \
//     [--dry-run]

import { Resend } from "resend";
import { TARGETS, renderEmail, SENDER, type TargetKey } from "./outreach-templates.js";

interface Args {
  target: TargetKey;
  to: string;
  from: string;
  corburn: boolean;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const has = (flag: string): boolean => argv.includes(flag);

  const target = (get("--target") ?? "curl") as TargetKey;
  const to = get("--to") ?? "elijah@munn.studio";
  const from = get("--from") ?? `${SENDER.name} <elijah@murmuralabs.com>`;
  const corburn = has("--corburn");
  const dryRun = has("--dry-run");

  if (!(target in TARGETS)) {
    throw new Error(
      `Unknown --target "${target}". Valid: ${Object.keys(TARGETS).join(", ")}`,
    );
  }
  return { target, to, from, corburn, dryRun };
}

async function main() {
  const args = parseArgs();
  const target = TARGETS[args.target];
  const { subject, text, html } = renderEmail(target, {
    includeCorburnIntro: args.corburn,
  });

  console.log("───────────────────────────────────────");
  console.log(`Target:  ${target.name} (${target.role})`);
  console.log(`To:      ${args.to}`);
  console.log(`From:    ${args.from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Corburn intro: ${args.corburn ? "yes" : "no"}`);
  console.log("───────────────────────────────────────");
  console.log(text);
  console.log("───────────────────────────────────────");

  if (args.dryRun) {
    console.log("[dry-run] No email sent.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY not set. Put it in .env.local and run with --env-file=.env.local",
    );
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: args.from,
    to: args.to,
    subject,
    text,
    html,
    replyTo: SENDER.email,
    tags: [
      { name: "campaign", value: "richmond-outreach-v1" },
      { name: "target", value: args.target },
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
