import { useState, useEffect } from "react";
import { Profile, VideoItem } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutAndSkills from "./components/AboutAndSkills";
import VideoCard from "./components/VideoCard";
import VideoDetailModal from "./components/VideoDetailModal";
import EditVideoModal from "./components/EditVideoModal";
import EditProfileModal from "./components/EditProfileModal";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { Search, Sparkles, FolderGit } from "lucide-react";

const categories = ["全部", "3D短片", "三维短片", "宣传视频", "创意动效", "工业视效", "视觉设计"];

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editorMode, setEditorMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // Check URL for admin mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("admin")) {
      setEditorMode(true);
    }
  }, []);

  // Fetch initial profile and videos list
  useEffect(() => {
    async function initData() {
      try {
        const [profRes, vidsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/videos")
        ]);

        if (profRes.ok && vidsRes.ok) {
          const profData = await profRes.json();
          const vidsData = await vidsRes.json();
          setProfile(profData);
          setVideos(vidsData);
        }
      } catch (err) {
        console.error("Failed to load initial portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Update backend profile
  const handleUpdateProfile = async (updated: Profile): Promise<boolean> => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setProfile(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Reset profile to original system defaults
  const handleResetProfile = async () => {
    if (window.confirm("确定要将个人信息重置为默认值吗？")) {
      try {
        const res = await fetch("/api/profile/reset");
        if (res.ok) {
          const resetData = await res.json();
          setProfile(resetData);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Upload/Add dynamic video (Hits multi-part form endpoint)
  const handleAddVideo = async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const newVideo = await res.json();
        setVideos((prev) => [newVideo, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Edit/Update existing video
  const handleUpdateVideo = async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        body: formData
      });
      if (res.ok) {
        const updated = await res.json();
        setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
        if (selectedVideo?.id === id) setSelectedVideo(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete live video by ID
  const handleDeleteVideo = async (id: string, title: string) => {
    if (window.confirm(`确定要从服务器彻底删除视频作品《${title}》吗？\n如果属于已上传视频，对应物理视频文件亦将被清除。`)) {
      try {
        const res = await fetch(`/api/videos/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setVideos((prev) => prev.filter((v) => v.id !== id));
          if (selectedVideo?.id === id) {
            setSelectedVideo(null);
          }
        } else {
          alert("删除操作失败，请重试。");
        }
      } catch (err) {
        console.error(err);
        alert("网络请求出错，请检查服务端连接。");
      }
    }
  };

  // Filtering + Searching logic
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "全部" || video.category === selectedCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.tools && video.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (video.role && video.role.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 text-slate-350">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="space-y-4 text-center relative z-10">
          <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-mono text-[11px] font-semibold tracking-widest uppercase">
            正在载入 CG 视觉艺术家档案...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-300 selection:bg-indigo-500/35 selection:text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Decorative Star/Ambient overlays to resemble the dark glowing photograph environment */}
      <div className="fixed top-[5%] left-[8%] w-96 h-96 glow-cyan rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[15%] right-[5%] w-[450px] h-[450px] glow-purple rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[45%] right-[20%] w-72 h-72 glow-orange rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Embedded application layout wrap modeled after high end glass UI components */}
      <div className="w-full relative z-10 border border-white/5 bg-[#0d1323]/35 backdrop-blur-3xl shadow-2xl overflow-hidden glass-container flex flex-col transition-all">
        
        {/* Navigation Headbar Panel */}
        {profile && (
          <Navbar
            profile={profile}
            editorMode={editorMode}
          />
        )}

        {/* Dynamic Biographical Hero section */}
        {profile && <Hero profile={profile} />}

        {/* Selected Projects / Videos Collection Workspace */}
        <section id="works" className="px-6 py-12 border-b border-white/5 bg-slate-900/15 space-y-8 relative z-10 text-left">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">
                PORTFOLIO • 精选作品录
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                <FolderGit className="w-5 h-5 text-indigo-400" />
                原创视频精选 ({filteredVideos.length} 部)
              </h2>
            </div>

            {/* Sub Filter Category Pills & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full xl:w-auto">
              
              {/* Category buttons tab pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 border cursor-pointer shrink-0 select-none ${
                      selectedCategory === cat
                        ? "bg-indigo-600 border-indigo-550 text-white shadow-md shadow-indigo-600/25"
                        : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/5 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filtering Keyword Input */}
              <div className="relative w-full md:w-56 shrink-0">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-550">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="搜索标题、担当角色、软件..."
                  className="w-full bg-white/5 border border-white/5 focus:border-indigo-500 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-2.5 flex items-center text-[10px] text-slate-500 hover:text-slate-350"
                  >
                    清除
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Quick Creator Interactive Banner */}
          {editorMode && (
            <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-250">
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  管理模式已展开
                </p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  您可以即时向本地文件夹补充3D渲染素材、更新项目，或直接删除已有的演示案例。
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setIsEditingProfile(true)} className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-300 rounded-lg text-[10px] font-bold transition cursor-pointer">编辑资料</button>
                <button onClick={handleResetProfile} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-red-400 rounded-lg text-[10px] font-bold transition cursor-pointer">重置数据</button>
                <AdminPanel onAddVideo={handleAddVideo} />
                <button onClick={() => setEditorMode(false)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-[10px] font-bold transition cursor-pointer">退出管理</button>
              </div>
            </div>
          )}

          {/* Grid Layout of Cards */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/25 border border-white/5 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
              <p className="text-sm font-bold text-slate-300">当前筛选分类下无作品</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {searchQuery
                  ? "请检查您的输入字眼或切换其他分类重试。"
                  : "当前库中空空如也，开启管理模式录入首个作品吧！"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-2">
              {filteredVideos.map((video) => (
                <div key={video.id} className="h-full">
                  <VideoCard
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                    editorMode={editorMode}
                    onDelete={handleDeleteVideo}
                    onEdit={(v) => setEditingVideo(v)}
                  />
                </div>
              ))}
            </div>
          )}

        </section>

        {/* Detailed counter statistics & interactive Skill charts */}
        <AboutAndSkills />

        {/* Clean responsive glassy footer containing credits, copyrights, copyable WeChat widgets, and credentials */}
        {profile && <Footer profile={profile} />}

      </div>

      {/* Cinematic Detail Lightbox Overlay */}
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Video Edit Overlay */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSave={handleUpdateVideo}
        />
      )}

      {/* Profile Modification Overlay Form */}
      {isEditingProfile && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleUpdateProfile}
        />
      )}

    </div>
  );
}
