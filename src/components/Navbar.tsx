import React from "react";
import { Sun } from "lucide-react";
import { Profile } from "../types";

interface NavbarProps {
  profile: Profile;
  editorMode: boolean;
}

export default function Navbar({
  profile,
  editorMode
}: NavbarProps) {
  
  // Custom navigation items scrolling smoothly to their HTML anchors
  const navItems = [
    { label: "首页", target: "#home" },
    { label: "作品", target: "#works" },
    { label: "关于我", target: "#about" },
    { label: "技能", target: "#skills" },
    { label: "联系我", target: "#contact" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/10 backdrop-blur-md relative z-30 font-sans">
      
      {/* Brand Identity Branding matching the screenshot */}
      <div className="flex flex-col text-left select-none">
        <span className="text-white font-black text-base tracking-wide font-display">
          {profile.name}
        </span>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono mt-0.5">
          ZHU GANGGANG
        </span>
      </div>

      {/* Center Navigator Pill capsule */}
      <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-full p-1 shadow-inner relative z-10 glass-pill gap-1.5">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.target}
            onClick={(e) => handleScroll(e, item.target)}
            className={`px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-350 select-none cursor-pointer ${
              idx === 0
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {editorMode && (
          <span className="text-[10px] font-bold text-amber-400 tracking-wide font-mono">
            管理模式
          </span>
        )}
        <div className="w-9 h-9 bg-white/5 hover:bg-white/10 transition border border-white/5 rounded-full flex items-center justify-center text-slate-300 cursor-pointer hover:text-white">
          <Sun className="w-4 h-4 fill-none" />
        </div>
      </div>

    </nav>
  );
}
