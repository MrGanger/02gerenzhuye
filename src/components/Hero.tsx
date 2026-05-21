import { ArrowRight, Award } from "lucide-react";
import { Profile } from "../types";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const handleLearnMoreScroll = () => {
    const elem = document.querySelector("#about");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative z-10 border-b border-white/5 overflow-hidden">

      {/* Full-width portrait photo as hero background — subject on the right, dark negative space on the left */}
      <div className="absolute inset-0">
        <img
          src="/avatar.png"
          alt={profile.name}
          className="w-full h-full object-cover object-[65%_calc(50%+100px)]"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, black 0%, black 85%, transparent 100%), linear-gradient(to top, black 0%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, black 0%, black 85%, transparent 100%), linear-gradient(to top, black 0%, black 80%, transparent 100%)",
          }}
        />
        {/* Dark gradient overlay — darkest on the left for text readability, fades toward the person */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* Ambient glow accents */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/8 rounded-full blur-[90px] pointer-events-none" />

      {/* Text content — overlaid on the dark left portion of the photo */}
      <div className="relative z-20 pl-4 md:pl-[150px] pr-4 md:pr-6 py-12 md:py-20">
        <div className="max-w-xl text-left space-y-5">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] font-bold text-indigo-300 tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            CG视觉艺术档案已就绪
          </div>

          <div className="space-y-3 font-sans">
            <span className="block text-slate-400 font-semibold text-sm md:text-base tracking-wider uppercase font-mono">
              你好，我是Mr.Ganger
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none font-display">
              {profile.name}
            </h1>
            <p className="text-base sm:text-lg text-indigo-300 font-bold tracking-widest font-display pt-1">
              {profile.title || "影视后期 & 三维创作者"}
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal max-w-lg font-sans pt-1">
            {profile.bio || "专注于影视后期制作、三维动画与视觉设计，用影像讲述故事，用画面传递价值。"}
          </p>

          <div className="pt-4">
            <button
              onClick={handleLearnMoreScroll}
              className="group px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-xs flex items-center gap-2.5 transition-all duration-300 border border-white/10 cursor-pointer shadow-md hover:shadow-indigo-500/5 select-none"
            >
              <span>关于我的详细履历</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
