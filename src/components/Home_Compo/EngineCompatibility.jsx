const compatibilityData = [
  {
    title: "ChatGPT",
    subtitle: "GPT-4o / GPT-4",
    desc: "Complex reasoning, detailed programming architectures, logic refinement.",
    color: "text-emerald-400"
  },
  {
    title: "Gemini",
    subtitle: "Gemini 1.5 Pro",
    desc: "Ultra-long context windows, deep code analysis, Google Workspace syncing.",
    color: "text-cyan-400"
  },
  {
    title: "Claude",
    subtitle: "Claude 3.5 Sonnet",
    desc: "Premium programmatic output, highly natural copywriting, markdown structuring.",
    color: "text-orange-400"
  },
  {
    title: "Midjourney",
    subtitle: "Midjourney v6",
    desc: "Highly artistic rendering, aspect-ratio configuration, photo-realism parameters.",
    color: "text-violet-500"
  }
];

export default function EngineCompatibility() {
  return (
    <section className="bg-slate-950 py-16 px-4">
      <div className="container mx-auto text-center">
        <h3 className="text-violet-500 font-bold uppercase tracking-widest text-sm mb-2">Multi-Platform</h3>
        <h2 className="text-white text-4xl font-bold mb-4">Engine Compatibility</h2>
        <p className="text-slate-400 mb-12">Prompts on Aiverse are tailored for individual models to exploit distinct strengths.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {compatibilityData.map((item, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left">
              <h4 className={`${item.color} font-bold mb-2`}>{item.title}</h4>
              <p className="text-white font-semibold mb-4">{item.subtitle}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}