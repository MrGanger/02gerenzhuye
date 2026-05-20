import { useState } from "react";
import { VideoItem } from "../types";
import { X, Calendar, Wrench, UserRound, Tag, AlertTriangle, RefreshCw } from "lucide-react";

interface VideoDetailModalProps {
  video: VideoItem;
  onClose: () => void;
}

export default function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
  const [videoError, setVideoError] = useState(false);
  const isLocalFileUrl = video.videoUrl.startsWith("/uploads/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      
      {/* Centered Modal Container */}
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-250 glass-modal text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-920/40">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">
              {video.category} • 作品创意档案
            </span>
            <h2 className="text-base md:text-lg font-bold text-white truncate max-w-lg md:max-w-2xl mt-0.5 font-display">
              {video.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            title="关闭 (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden border-b border-white/5">
          {video.videoUrl && !videoError ? (
            <video
              key={video.videoUrl}
              src={video.videoUrl}
              controls
              autoPlay
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full max-h-[50vh] object-contain"
            >
              您的浏览器不支持 HTML5 视频播放。
            </video>
          ) : video.videoUrl && videoError ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
              <p className="text-sm font-medium text-slate-300">视频无法在此浏览器中播放</p>
              <p className="text-xs text-slate-500 max-w-sm">可能是视频编码格式不兼容。您可以尝试下载后用本地播放器打开。</p>
              <div className="flex gap-3 pt-2">
                <a
                  href={video.videoUrl}
                  download
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  下载视频文件
                </a>
                <button
                  onClick={() => setVideoError(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  重试
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-2" />
              <p className="text-sm font-medium text-slate-300">未设置有效的视频播放地址</p>
            </div>
          )}
        </div>

        {/* Explanations and description rows */}
        <div className="p-6 md:p-8 space-y-6 max-h-[35vh] overflow-y-auto custom-scrollbar font-sans">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/5 pb-5">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mt-0.5 animate-pulse">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">创作周期</span>
                <span className="text-xs font-semibold text-slate-200 font-mono mt-0.5 block">{video.creationDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 mt-0.5">
                <UserRound className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">项目职能角色</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{video.role || "全栈主导设计 / 3D特效"}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 mt-0.5">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">资产存放形式</span>
                <span className="text-xs font-semibold text-slate-200 font-mono mt-0.5 block truncate" title={video.videoUrl}>
                  {isLocalFileUrl ? "本地项目资产库 (已挂载)" : "外部融媒体链接"}
                </span>
              </div>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side column: detailed description */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                创作理念与内容简介 (Concept & Summary)
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                {video.description || "暂无更多的创作花絮文字，您可以通过开启管理模式随时为此设计补充灵感起源。"}
              </p>
            </div>

            {/* Right side column: tools information */}
            <div className="space-y-4 bg-white/5 p-4 border border-white/5 rounded-xl max-h-fit">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  设计/研发工具链
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  该项目在渲染与剪辑流程中应用了以下数字设计软件工具：
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {video.tools && video.tools.length > 0 ? (
                  video.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold font-mono rounded-lg shadow-sm"
                    >
                      {tool}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">未标注设计工具</span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 flex justify-end gap-3 text-xs justify-between items-center font-sans">
          <span className="text-slate-500 font-mono text-[10px]">
            ID: {video.id}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/15 text-xs cursor-pointer"
          >
            完成阅读
          </button>
        </div>

      </div>

    </div>
  );
}
