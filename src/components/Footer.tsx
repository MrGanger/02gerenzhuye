import React from "react";
import { MessageSquare, Mail, Github, Heart } from "lucide-react";
import { Profile } from "../types";

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const emailToShow = profile.contactEmail || "liyuxuan_cg@example.com";
  const wechatToShow = profile.wechat || "LI_YUXUAN_CG";

  return (
    <footer id="contact" className="px-6 py-10 relative z-10 bg-slate-950/40 text-left font-sans flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* Absolute ambient bottom lights */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-96 h-20 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />

      {/* Left Column: Social channels (Frosted capsules) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4.5">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-550 tracking-widest block sm:border-r sm:border-white/5 sm:pr-4">
          CONTACT CHANNEL • 建立合作
        </span>
        
        <div className="flex items-center gap-3">
          {/* Email Frosted link */}
          <a
            href={`mailto:${emailToShow}`}
            className="w-8.5 h-8.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 flex items-center justify-center transition duration-200 cursor-pointer"
            title={`发送邮件: ${emailToShow}`}
          >
            <Mail className="w-4 h-4" />
          </a>

          {/* WeChat indicator */}
          <div
            className="w-8.5 h-8.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 flex items-center justify-center transition duration-200 cursor-pointer relative group"
            title={`微信号: ${wechatToShow}`}
            onClick={() => {
              navigator.clipboard.writeText(wechatToShow);
              alert(`微信号 ${wechatToShow} 已成功复制到您的温度剪贴板！`);
            }}
          >
            <MessageSquare className="w-4 h-4" />
            
            {/* Hover tooltip showing actual ID */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-950/90 border border-white/10 text-[9px] font-mono text-slate-200 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
              复制微信: {wechatToShow}
            </span>
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/liyuxuan-cg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8.5 h-8.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 flex items-center justify-center transition duration-200 cursor-pointer"
            title="阅览我的开源与特效引擎仓"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Right Column: Statement signature and credits */}
      <div className="space-y-1.5 md:text-right">
        <p className="text-xs font-semibold text-slate-400 font-sans tracking-wide">
          用影像记录世界，用创意点亮生活。
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-1.5 text-[10px] text-slate-500 font-mono">
          <span>
            © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1 justify-start sm:justify-end">
            由 CG 影视级磨砂质感架构驱动 <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500/30 shrink-0" />
          </span>
        </div>
      </div>

    </footer>
  );
}
