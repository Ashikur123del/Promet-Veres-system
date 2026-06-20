// components/Testimonials.tsx

import { IoIosStarOutline } from "react-icons/io";


const testimonials = [
  {
    name: "Sarah Connor",
    role: "Content Strategist",
    text: "Aiverse completely changed how I interact with Claude. The prompts are highly refined and save me hours every day.",
  },
  {
    name: "Alex Rivera",
    role: "Software Engineer",
    text: "I found an incredible prompt that debugs React code and writes unit tests in seconds. Simply amazing!",
  },
  {
    name: "Elena Rostova",
    role: "Digital Artist",
    text: "The Midjourney prompts here are pure gold. The parameters and keywords are so detailed. Highly recommend!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="container mx-auto text-center">
        <h3 className="text-violet-500 font-bold uppercase tracking-widest text-sm mb-2">Testimonials</h3>
        <h2 className="text-white text-4xl font-bold mb-16">What Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-left">
              <div className="flex text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => <IoIosStarOutline key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-slate-300 italic mb-8">"{t.text}"</p>
              <div className="border-t border-slate-800 pt-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full" /> {/* Placeholder for image */}
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}