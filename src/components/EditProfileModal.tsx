import React, { useState } from "react";
import { X, Save, Sparkles } from "lucide-react";
import { Profile } from "../types";

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updated: Profile) => Promise<boolean>;
}

export default function EditProfileModal({
  profile,
  onClose,
  onSave
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || "");
  const [wechat, setWechat] = useState(profile.wechat || "");
  const [github, setGithub] = useState(profile.github || "");
  const [skillsStr, setSkillsStr] = useState(profile.skills.join(", "));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse skill tags
    const skills = skillsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated: Profile = {
      ...profile,
      name,
      title,
      bio,
      contactEmail,
      wechat,
      github,
      skills
    };

    const success = await onSave(updated);
    setSaving(false);
    if (success) {
      onClose();
    } else {
      alert("更新失败，请重试或检查后台连接。");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      
      {/* Container Frame */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200 glass-modal text-slate-200">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-920/40">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide font-display">
              编辑艺术家背景资料
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
          
          {/* Name Field */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              艺术家大名 (Display Name)
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-semibold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Title Field */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              核心创意头衔 (Subtitle/Role)
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-semibold"
              value={title}
              placeholder="e.g., 影视后期 & 三维创作者"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              个人简介哲学 (Creative Philosophy / Biography)
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-normal leading-relaxed whitespace-pre-wrap"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Skills separated with comma */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              亮点技能栈 (Skills - 英文逗号区分键值)
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-semibold"
              value={skillsStr}
              placeholder="e.g., 场景光影渲染, 粒子动力学, Unreal 5 视频合成"
              onChange={(e) => setSkillsStr(e.target.value)}
            />
          </div>

          {/* Contacts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider">
                工作合作邮箱 (Email)
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider">
                微信号码 (WeChat ID)
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
                value={wechat}
                onChange={(e) => setWechat(e.target.value)}
              />
            </div>
          </div>

          {/* Save Action Row */}
          <div className="pt-4 border-t border-white/5 flex justify-end gap-3.5">
            <button
              onClick={onClose}
              type="button"
              className="px-4.5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-820 text-white rounded-xl font-bold flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "正在储存..." : "确认保存资料"}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
