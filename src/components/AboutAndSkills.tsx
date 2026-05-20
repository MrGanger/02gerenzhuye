import { Smile, Zap, Server, ShieldCheck } from "lucide-react";

export default function AboutAndSkills() {
  const stats = [
    { value: "5+", label: "项目设计经验" },
    { value: "20+", label: "制作完成作品" },
    { value: "10+", label: "优质合作客户" },
    { value: "100%", label: "专注度与实干" }
  ];

  const skillTracks = [
    { name: "三维动画 (C4D / Blender)", percentage: 90, color: "bg-indigo-500 shadow-indigo-500/35" },
    { name: "影视后期 (AE / PR / DaVinci)", percentage: 85, color: "bg-teal-500 shadow-teal-500/35" },
    { name: "创意视觉设计 (PS / AI / Figma)", percentage: 80, color: "bg-purple-500 shadow-purple-500/35" },
    { name: "合成特效与渲染 (Nuke / UE5)", percentage: 75, color: "bg-sky-500 shadow-sky-500/35" }
  ];

  return (
    <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-12 border-b border-white/5 bg-slate-900/10 relative z-10">
      
      {/* Absolute back decor */}
      <div className="absolute right-10 bottom-10 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Left Column - Biography Summary and Stats */}
      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">
            BIOGRAPHY • 个人履历简介
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            专注于影像生产与空间美学
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-normal">
          高年资三维动画与视频后期视觉主脑，拥有独立主导影视短片、3D宣传片和创意网页视觉全周期的丰富实战经验。在长久的数字艺术设计生涯中，始终秉持「用光影讲述故事、用画面传递价值」的核心创作信念。
        </p>

        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-normal">
          热衷于前沿数字创意技术的发掘与整合，通过将高效的三维渲染管线（Cinema 4D / Blender）与极致的影视级调色、微观特效剪辑紧密粘合，为诸多科技品牌及融媒体集团输出具备宏观视野与微观细节的超一流创意音像资产。
        </p>

        {/* 4 Stats Grid - Extremely clean */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-center select-none shadow-sm">
              <span className="block text-2xl font-black text-white font-display leading-tight">
                {stat.value}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Skills Stack Indicators */}
      <div id="skills" className="space-y-6 text-left lg:border-l lg:border-white/5 lg:pl-10">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">
            CORE STACK • 专业硬技能储备
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            精雕细琢的 CG 技术堆栈
          </h2>
        </div>

        <div className="space-y-5 pt-2 font-sans">
          {skillTracks.map((skill, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 font-mono text-[11px]">{skill.name}</span>
                <span className="text-indigo-300 font-mono text-[11px]">{skill.percentage}%</span>
              </div>
              
              {/* Animated Progress bar tract */}
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${skill.color}`}
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Micro Badges inside skillset */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 tracking-wider font-mono">
            <Zap className="w-3 h-3 text-indigo-400" /> C4D OC/Redshift
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-300 tracking-wider font-mono">
            <Smile className="w-3 h-3 text-teal-400" /> AE Element 3D
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300 tracking-wider font-mono">
            <Server className="w-3 h-3 text-purple-400" /> UE5 Sequencer
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold text-sky-300 tracking-wider font-mono">
            <ShieldCheck className="w-3 h-3 text-sky-400" /> DaVinci HDR
          </span>
        </div>
      </div>

    </section>
  );
}
