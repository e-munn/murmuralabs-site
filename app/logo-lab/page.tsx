const variations = [
  { id: "v01-prism", label: "Prism (original)" },
  { id: "v02-prism-teeth-right", label: "Right shaft + teeth" },
  { id: "v03-prism-teeth-bottom", label: "Vertical shaft" },
  { id: "v04-prism-stepped-teeth", label: "Stepped teeth" },
  { id: "v05-prism-pin-teeth", label: "Pin teeth" },
  { id: "v06-prism-fang", label: "Fang teeth" },
  { id: "v07-prism-double-bit", label: "Double bit" },
  { id: "v08-prism-thin-shaft", label: "Thin lines" },
  { id: "v09-prism-cutout", label: "Cutout core" },
  { id: "v10-prism-comb", label: "Comb teeth" },
];

export default function LogoLab() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#190f0a] p-12">
      <h1 className="text-2xl font-medium mb-8">Silicon Key — Logo Variations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {variations.map((v) => (
          <div key={v.id} className="flex flex-col items-center gap-4 p-6 border border-[#190f0a]/10 rounded-lg bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/logo-variations/${v.id}.svg`} alt={v.label} className="h-32 w-auto" />
            <div className="text-lg tracking-widest">silicon key</div>
            <span className="text-xs opacity-50">{v.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
