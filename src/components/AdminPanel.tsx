import React, { useState, useRef } from "react";
import { PlusCircle, Upload, X, CheckCircle, AlertCircle, FileVideo } from "lucide-react";

interface AdminPanelProps {
  onAddVideo: (formData: FormData) => Promise<boolean>;
}

export default function AdminPanel({ onAddVideo }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("3D短片");
  const [customCategory, setCustomCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [tools, setTools] = useState(""); // Comma-separated list
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("02:30");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Media source parameters
  const [sourceType, setSourceType] = useState<"upload" | "path">("upload");
  const [manualUrl, setManualUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      // Pre-fill Title from file name if empty
      if (!title) {
        const nameWithoutExt = e.target.files[0].name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("3D短片");
    setCustomCategory("");
    setShortDesc("");
    setDescription("");
    setRole("");
    setTools("");
    setCreationDate(new Date().toISOString().split("T")[0]);
    setDuration("02:30");
    setThumbnailUrl("");
    setVideoFile(null);
    setManualUrl("");
    setSourceType("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const activeCategory = category === "自定义" ? customCategory.trim() : category;
    if (!activeCategory) {
      setFeedback({ type: "error", msg: "请输入自定义类别名称" });
      setLoading(false);
      return;
    }

    if (sourceType === "upload" && !videoFile) {
      setFeedback({ type: "error", msg: "请选择一个要上传的视频文件" });
      setLoading(false);
      return;
    }

    if (sourceType === "path" && !manualUrl.trim()) {
      setFeedback({ type: "error", msg: "请输入视频的文件路径或在线链接" });
      setLoading(false);
      return;
    }

    // Pack FormData
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

    if (sourceType === "upload" && videoFile) {
      formData.append("videoFile", videoFile);
      formData.append("isLocalUrl", "false");
    } else {
      formData.append("isLocalUrl", "true");
      formData.append("manualUrl", manualUrl.trim());
    }

    const success = await onAddVideo(formData);
    setLoading(false);
    
    if (success) {
      setFeedback({ type: "success", msg: "成功发布新视频作品！列表已同步。" });
      setTimeout(() => {
        resetForm();
        setFeedback(null);
        setIsOpen(false);
      }, 1550);
    } else {
      setFeedback({ type: "error", msg: "上传视频或保存失败，请检查视频大小是否合适(上限100MB)" });
    }
  };

  return (
    <div className="z-40">
      {/* Floating Plus button on list layout */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-600/20 duration-300 transform active:scale-95 hover:scale-105 border border-indigo-500/10 cursor-pointer"
      >
        <PlusCircle className="w-5 h-5 animate-pulse" />
        <span>添加新的视频作品</span>
      </button>

      {/* Admin Panel Overlay Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white/95 border border-slate-200/80 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 glass-modal">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-indigo-505" />
                <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">添加新的项目视频作品</h3>
              </div>
              <button
                onClick={() => {
                  if (!loading) {
                    setIsOpen(false);
                    setFeedback(null);
                  }
                }}
                className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Workspace */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1 font-sans">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">作品名称 / 标题 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 探索自然三维先导片"
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Category selectors */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">作品类别 *</label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="3D短片">3D短片</option>
                      <option value="宣传视频">宣传视频</option>
                      <option value="创意动效">创意动效</option>
                      <option value="工业视效">工业视效</option>
                      <option value="自定义">自定义分类...</option>
                    </select>
                    
                    {category === "自定义" && (
                      <input
                        type="text"
                        required
                        placeholder="分类名称"
                        className="flex-1 bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none animate-in slide-in-to-right-2 duration-150"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Source selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="block text-xs font-semibold text-slate-500 font-sans">视频存放位置方式 *</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-sans select-none">
                      <input
                        type="radio"
                        name="sourceType"
                        checked={sourceType === "upload"}
                        onChange={() => setSourceType("upload")}
                        className="accent-indigo-600 cursor-pointer"
                      />
                      <span className="font-semibold">网页视频上传</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-sans select-none">
                      <input
                        type="radio"
                        name="sourceType"
                        checked={sourceType === "path"}
                        onChange={() => setSourceType("path")}
                        className="accent-indigo-600 cursor-pointer"
                      />
                      <span className="font-semibold">本地路径或外部网络链接</span>
                    </label>
                  </div>
                </div>

                {sourceType === "upload" ? (
                  <div className="pt-1.5">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer bg-white/60 hover:bg-white transition duration-300 flex flex-col items-center justify-center space-y-2 group shadow-sm"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition" />
                      <div className="text-xs text-slate-600">
                        {videoFile ? (
                          <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                            已选择视频: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        ) : (
                          <span>拖拽文件至此 或 <span className="text-indigo-600 font-semibold group-hover:underline">浏览电脑文件</span></span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-450 font-mono">支持 100MB 以内的 MP4, WebM, OGG 视频常用格式</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1.5">
                    <input
                      type="text"
                      placeholder="例如: /videos/render_film.mp4 或在线链接"
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none font-mono"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      💡 适合超大视频文件。你可以将视频放在本项目根下的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-slate-700">public/</code> 文件夹中（例如创建 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-slate-700">public/videos/intro.mp4</code>），然后在此输入路径为：<code className="bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-mono text-[9px] font-semibold">/videos/intro.mp4</code> 即可直接引用。
                    </p>
                  </div>
                )}
              </div>

              {/* Short Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">作品卡片摘要简介 (最多2行) *</label>
                <input
                  type="text"
                  required
                  placeholder="展示在列表卡片上的简短介绍，如 50 字以内的特色说明"
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                />
              </div>

              {/* Detailed introduction descriptions */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">详尽创作理念简介 *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="项目的大背景，主要的灵感来源，创作过程，镜头调度，以及遇到的难点解决，全方位展示你的专业技能。"
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">视频封面图链接 (可选)</label>
                <input
                  type="text"
                  placeholder="https://... 或留空使用默认封面"
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors font-mono"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">你在项目中的主要角色</label>
                  <input
                    type="text"
                    placeholder="如: 3D艺术家 / CG导演"
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none transition-colors"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                {/* Tools */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">设计/技术工具 (逗号隔开)</label>
                  <input
                    type="text"
                    placeholder="Blender, UE5, AE"
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none transition-colors"
                    value={tools}
                    onChange={(e) => setTools(e.target.value)}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">项目完成时间</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-mono"
                      value={creationDate}
                      onChange={(e) => setCreationDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">作品时长 (Duration)</label>
                  <input
                    type="text"
                    placeholder="例如: 02:45"
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-mono"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              {/* Form Feedback Alerts */}
              {feedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    feedback.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {feedback.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span>{feedback.msg}</span>
                </div>
              )}

              {/* Submit panel buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition cursor-pointer duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      正在上传发布中...
                    </span>
                  ) : (
                    "确认添加并发布"
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
