import { VideoItem } from "../types";
import { Play, Trash2, Film, Pencil } from "lucide-react";

interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
  editorMode: boolean;
  onDelete: (id: string, title: string) => void;
  onEdit: (video: VideoItem) => void;
}

export default function VideoCard({
  video,
  onClick,
  editorMode,
  onDelete,
  onEdit
}: VideoCardProps) {
  // Extract custom gradient background based on video ID to make video placeholder look highly stylized
  const getGradientByVid = (id: string) => {
    const gradients = [
      "from-zinc-900/60 via-indigo-950/30 to-slate-950/50 border-white/5",
      "from-slate-900/60 via-purple-950/30 to-zinc-950/50 border-white/5",
      "from-neutral-900/60 via-emerald-950/30 to-slate-950/50 border-white/5",
      "from-blue-950/40 via-sky-950/20 to-stone-950/50 border-white/5",
    ];
    const index = typeof id === "string" ? id.charCodeAt(id.length - 1) % gradients.length : 0;
    return gradients[index];
  };

  // Safe wrapping of titles in Chinese brackets 《》 matching reference photo
  const formattedTitle = video.title.startsWith("《") && video.title.endsWith("》")
    ? video.title
    : `《${video.title}》`;

  const displayYear = video.creationDate ? video.creationDate.split("-")[0] : "2024";

  return (
    <div 
      onClick={onClick}
      className="group relative glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full border border-white/5 bg-slate-950/20 shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1.5"
    >
      
      {/* Thumbnail or cinematic custom preview */}
      <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${getGradientByVid(video.id)} flex items-center justify-center overflow-hidden border-b border-white/5`}>
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none bg-slate-950/60">
            <Film className="w-8 h-8 text-indigo-400 opacity-60 group-hover:scale-110 transition duration-300" />
            <span className="mt-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              {video.category}
            </span>
          </div>
        )}

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-all duration-300 pointer-events-none" />

        {/* Ambient Overlay border inside card */}
        <div className="absolute inset-0 border border-white/5 rounded-t-xl pointer-events-none" />

        {/* Center Play Button - Frosted Glass Circle (identically modeled to screenshot) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center transition-all duration-350 shadow-md group-hover:bg-white/25 group-hover:scale-110 shadow-black/40">
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          </div>
        </div>

        {/* Floating Category Tag - Left Top Corner */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-indigo-300 border border-white/10">
          {video.category}
        </div>

        {/* Admin Edit & Delete buttons */}
        {editorMode && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(video);
              }}
              className="p-1.5 bg-indigo-900/80 hover:bg-indigo-700 border border-indigo-500/30 text-indigo-200 rounded-lg hover:scale-105 transition duration-200 shadow-md"
              title="编辑作品"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.id, video.title);
              }}
              className="p-1.5 bg-red-900/80 hover:bg-red-700 border border-red-500/30 text-red-200 rounded-lg hover:scale-105 transition duration-200 shadow-md"
              title="删除作品"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Video details body - Matches the image metadata structure */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-gradient-to-b from-transparent to-slate-950/10 font-sans">
        <div className="space-y-1.5">
          <h3 className="text-[13px] font-bold text-white tracking-wide transition duration-250 group-hover:text-indigo-300">
            {formattedTitle}
          </h3>
          
          <div className="flex items-center justify-between text-[11px] text-slate-450 font-sans tracking-tight">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-medium">{video.role ? video.role.split(" / ")[0] : video.category}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-500 font-mono text-[10px]">{displayYear}</span>
            </div>
            {video.duration ? (
              <span className="text-slate-400 font-mono tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {video.duration}
              </span>
            ) : (
              <span className="text-slate-400 font-mono tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                02:30
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
