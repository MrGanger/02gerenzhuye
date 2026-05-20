import React, { useState, useRef } from "react";
import { X, Save, Upload, Image } from "lucide-react";
import { VideoItem } from "../types";

interface EditVideoModalProps {
  video: VideoItem;
  onClose: () => void;
  onSave: (id: string, formData: FormData) => Promise<boolean>;
}

export default function EditVideoModal({ video, onClose, onSave }: EditVideoModalProps) {
  const [title, setTitle] = useState(video.title);
  const [category, setCategory] = useState(video.category);
  const [customCategory, setCustomCategory] = useState("");
  const [shortDesc, setShortDesc] = useState(video.shortDesc);
  const [description, setDescription] = useState(video.description);
  const [role, setRole] = useState(video.role);
  const [tools, setTools] = useState(video.tools.join(", "));
  const [creationDate, setCreationDate] = useState(video.creationDate);
  const [duration, setDuration] = useState(video.duration || "02:30");
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl || "");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const activeCategory = category === "自定义" ? customCategory.trim() : category;
    if (!activeCategory) {
      setFeedback({ type: "error", msg: "请输入自定义类别名称" });
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", activeCategory);
    formData.append("shortDesc", shortDesc.trim());
    formData.append("description", description.trim());
    formData.append("role", role.trim());
    formData.append("tools", tools.trim());
    formData.append("creationDate", creationDate);
    formData.append("duration", duration.trim() || "02:30");
    formData.append("thumbnailUrl", thumbnailUrl.trim());

    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    const success = await onSave(video.id, formData);
    setSaving(false);

    if (success) {
      setFeedback({ type: "success", msg: "视频信息已更新！" });
      setTimeout(() => onClose(), 800);
    } else {
      setFeedback({ type: "error", msg: "更新失败，请重试。" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 glass-modal text-slate-200">

        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-920/40">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">编辑视频作品</h3>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 font-sans">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">作品名称</label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">作品类别</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="3D短片">3D短片</option>
                  <option value="宣传视频">宣传视频</option>
                  <option value="创意动效">创意动效</option>
                  <option value="工业视效">工业视效</option>
                  <option value="三维短片">三维短片</option>
                  <option value="视觉设计">视觉设计</option>
                  <option value="自定义">自定义分类...</option>
                </select>
                {category === "自定义" && (
                  <input
                    type="text"
                    required
                    placeholder="分类名称"
                    className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">视频封面图</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">封面图片链接</label>
                <input
                  type="text"
                  placeholder="https://... 或留空使用默认"
                  className="w-full bg-[#0f1620] border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">或上传本地图片</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-indigo-500 rounded-xl p-3 text-center cursor-pointer bg-[#0f1620] hover:bg-[#0f1620]/80 transition duration-300 flex items-center justify-center gap-2 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbChange}
                  />
                  <Upload className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                  <span className="text-xs text-slate-500 group-hover:text-indigo-300">
                    {thumbnailFile ? thumbnailFile.name : "选择图片文件"}
                  </span>
                </div>
              </div>
            </div>
            {(thumbnailUrl || video.thumbnailUrl) && !thumbnailFile && (
              <div className="flex items-center gap-2 pt-1">
                <img
                  src={thumbnailUrl || video.thumbnailUrl}
                  alt="封面预览"
                  className="w-16 h-10 object-cover rounded border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-slate-500">当前封面预览</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">卡片摘要简介</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">详尽创作理念简介</label>
            <textarea
              rows={4}
              required
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-normal leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">项目角色</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">工具 (逗号分隔)</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-semibold"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">完成日期</label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">时长</label>
              <input
                type="text"
                placeholder="02:30"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              <span>{feedback.msg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "保存中..." : "保存修改"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
