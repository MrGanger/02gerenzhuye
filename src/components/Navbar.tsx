import React from "react";
import { Sun, Eye, EyeOff, Edit, RefreshCw } from "lucide-react";
import { Profile } from "../types";

interface NavbarProps {
  profile: Profile;
  editorMode: boolean;
  setEditorMode: (mode: boolean) => void;
  onEditProfileTrigger: () => void;
  onResetTrigger: () => void;
}

export default function Navbar({
  profile,
  editorMode,
  setEditorMode,
  onEditProfileTrigger,
  onResetTrigger
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

      {/* Right control utilities including Admin portal mode switches */}
      <div className="flex items-center gap-3">
        {/* Subtle Admin Mode Indicator inline */}
        <button
          onClick={() => setEditorMode(!editorMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all selection:bg-transparent cursor-pointer ${
            editorMode
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
          }`}
          title={editorMode ? "当前：管理作品模式" : "开启管理模式"}
        >
          {editorMode ? (
            <>
              <Eye className="w-3 h-3 text-amber-400 shrink-0" />
              <span>管理中</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 text-slate-500 shrink-0" />
              <span>设计端</span>
            </>
          )}
        </button>

        {editorMode && (
          <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
            <button
              onClick={onEditProfileTrigger}
              className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="修改背景及文案"
            >
              <Edit className="w-3 h-3" />
              <span>改文案</span>
            </button>
            <button
              onClick={onResetTrigger}
              className="p-1 hover:text-red-400 bg-white/5 border border-white/5 rounded-full text-slate-400 hover:bg-white/10 transition duration-200 cursor-pointer"
              title="重置预存数值"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Sun theme controller toggle matching top-right of the image */}
        <div className="w-9 h-9 bg-white/5 hover:bg-white/10 transition border border-white/5 rounded-full flex items-center justify-center text-slate-300 cursor-pointer hover:text-white">
          <Sun className="w-4 h-4 fill-none" />
        </div>
      </div>

    </nav>
  );
}
