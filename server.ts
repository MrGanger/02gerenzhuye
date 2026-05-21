import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const ffmpegPath = ffmpegInstaller.path;

const PORT = process.env.PORT || 3000;
const app = express();

// Set up JSON body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure required directories exist
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const THUMBS_DIR = path.join(process.cwd(), "public", "thumbnails");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBS_DIR)) {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
}

const PROFILE_FILE = path.join(DATA_DIR, "profile.json");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");

// Default template profile data
const defaultProfile = {
  name: "张伟 (Artisan)",
  title: "3D视觉艺术家 / 影视宣传片导演",
  bio: "专注于卓越的3D视觉特效与创意视频制作。拥有5年的CG创作实力，擅长在Blender、Unreal Engine以及After Effects中将创意构思转化为精妙的动态画面。参与过多部知名品牌宣传视频和3D短片的完整生命周期制作，致力于用光影讲好每一个故事。",
  avatarUrl: "",
  skills: ["3D 建模与材质", "场景光影设计", "Unreal Engine 渲染", "影视后期合成", "Blender 动效", "创意概念设计"],
  contactEmail: "artisan_design@example.com",
  wechat: "Artisan_3D",
  github: "github.com"
};

// Default template videos containing high-quality sample video streams (using free-to-use direct video URLs so the workspace works immediately!)
const defaultVideos = [
  {
    id: "v1",
    title: "《溯光》- 3D赛博朋克科幻科创概念短片",
    category: "3D短片",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "",
    shortDesc: "一部展现未来都市霓虹与赛博科技碰撞的3D概念概念设计片，荣获CG创意概念奖。",
    description: "本片《溯光》是一个个人练习作品，探讨未来高科技与人类生存底色之间奇妙平衡。整部短片全部在Blender中进行多通道建模，并在Unreal Engine 5中全动态渲染完成。采用极简主义科幻的冷色调打光，配合高饱和度冷暖对比，重塑具有秩序感和流动美感的赛博夜景。后期在After Effects和DaVinci中进行了精细的调色和高光控制，音效由自研合成器渲染，打造沉浸式视听。本项目由我个人独立完成了从叙事脚本、镜头构图、资产建模、着色器到最终渲染、混音剪辑的全部工作。",
    creationDate: "2025-11-12",
    role: "导演 / 概念设计 / 3D美术与材质",
    tools: ["Blender", "Unreal Engine 5", "After Effects", "DaVinci Resolve"]
  },
  {
    id: "v2",
    title: "《自然印记》- 极简自然美学宣传视频",
    category: "宣传视频",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "",
    shortDesc: "为某知名独立生活美学品牌量身打造的艺术感宣传视频，用镜头捕捉细腻质感。",
    description: "《自然印记》是为生活美学品牌设计制作的一档轻奢调性视觉短片。影片主要通过慢镜头和精细微距摄影，抓取粗粝陶土、有机亚麻以及大理石本身的自然生长肌理，呼应品牌对质朴归真生活的极致追求。视频音画配合默契，呼吸感的渐进节奏旨在带领观众进入一个隔绝世俗喧嚣、回归内心宁静的空灵时空。在项目中，我主要负责导演、摄像方案策划、现场自然打光指导，以及后期的三维微小沙粒动画注入与全片色彩管理。",
    creationDate: "2026-02-15",
    role: "导演 / 剪辑 / 调色 / 特效合成",
    tools: ["Premiere Pro", "After Effects", "Cinema 4D", "Redshift"]
  }
];

// Initialize profile file
if (!fs.existsSync(PROFILE_FILE)) {
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2), "utf-8");
}
// Initialize videos file
if (!fs.existsSync(VIDEOS_FILE)) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(defaultVideos, null, 2), "utf-8");
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for video uploads in browser
  }
});

// Configure static routes for serving uploads and thumbnails
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/thumbnails", express.static(THUMBS_DIR));

// Multer storage for thumbnail images
const thumbStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, THUMBS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `thumb-${uniqueSuffix}${ext}`);
  }
});

const uploadThumb = multer({
  storage: thumbStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB for images
});

// ---------------------- API ENDPOINTS ----------------------

// 1. Get profile
app.get("/api/profile", (req, res) => {
  try {
    const data = fs.readFileSync(PROFILE_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "读取个人简介失败" });
  }
});

// 2. Update profile
app.get("/api/profile/reset", (req, res) => {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2), "utf-8");
    res.json(defaultProfile);
  } catch (error) {
    res.status(500).json({ error: "重置个人信息失败" });
  }
});

app.put("/api/profile", (req, res) => {
  try {
    const updated = req.body;
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(updated, null, 2), "utf-8");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "更新个人简介失败" });
  }
});

// 3. Get videos
app.get("/api/videos", (req, res) => {
  try {
    const data = fs.readFileSync(VIDEOS_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "读取视频列表失败" });
  }
});

// 4. Create/Upload dynamic video
app.post("/api/videos", upload.single("videoFile"), (req, res) => {
  try {
    const {
      title,
      category,
      shortDesc,
      description,
      role,
      tools,
      creationDate,
      isLocalUrl,
      manualUrl,
      duration,
      thumbnailUrl
    } = req.body;

    let videoUrl = "";

    if (req.file) {
      const originalPath = req.file.path;
      const transcodedFilename = `h264-${req.file.filename}`;
      const transcodedPath = path.join(UPLOADS_DIR, transcodedFilename);

      // Transcode to browser-compatible H.264 + AAC
      try {
        execSync(
          `"${ffmpegPath}" -i "${originalPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart -y "${transcodedPath}"`,
          { stdio: "pipe", timeout: 300000 }
        );
        // Remove the original non-transcoded file to save space
        fs.unlinkSync(originalPath);
        videoUrl = `/uploads/${transcodedFilename}`;
      } catch (transcodeErr) {
        console.error("FFmpeg transcode failed, using original:", transcodeErr);
        videoUrl = `/uploads/${req.file.filename}`;
      }
    } else if (isLocalUrl === "true" || manualUrl) {
      videoUrl = manualUrl || "";
    } else {
      return res.status(400).json({ error: "请上传视频文件或填写视频链接/文件路径" });
    }

    const currentData = fs.readFileSync(VIDEOS_FILE, "utf-8");
    const videos = JSON.parse(currentData);

    const newVideo = {
      id: "v-" + Date.now(),
      title: title || "未命名视频",
      category: category || "其他",
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl || "",
      shortDesc: shortDesc || "",
      description: description || "",
      creationDate: creationDate || new Date().toISOString().split("T")[0],
      role: role || "",
      tools: tools ? tools.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      duration: duration || "02:30"
    };

    videos.unshift(newVideo);
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf-8");

    res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "保存视频失败" });
  }
});

// 4b. Edit/Update existing video
app.put("/api/videos/:id", uploadThumb.single("thumbnailFile"), (req, res) => {
  try {
    const id = req.params.id;
    const currentData = fs.readFileSync(VIDEOS_FILE, "utf-8");
    const videos = JSON.parse(currentData);

    const videoIndex = videos.findIndex((v: any) => v.id === id);
    if (videoIndex === -1) {
      return res.status(404).json({ error: "找不到该视频" });
    }

    const {
      title,
      category,
      shortDesc,
      description,
      role,
      tools,
      creationDate,
      duration,
      thumbnailUrl
    } = req.body;

    // If a new thumbnail file was uploaded, use it; otherwise keep existing or use provided URL
    let finalThumbnail = videos[videoIndex].thumbnailUrl || "";
    if (req.file) {
      finalThumbnail = `/thumbnails/${req.file.filename}`;
    } else if (thumbnailUrl !== undefined) {
      finalThumbnail = thumbnailUrl;
    }

    videos[videoIndex] = {
      ...videos[videoIndex],
      title: title || videos[videoIndex].title,
      category: category || videos[videoIndex].category,
      shortDesc: shortDesc !== undefined ? shortDesc : videos[videoIndex].shortDesc,
      description: description !== undefined ? description : videos[videoIndex].description,
      role: role !== undefined ? role : videos[videoIndex].role,
      tools: tools !== undefined ? tools.split(",").map((s: string) => s.trim()).filter(Boolean) : videos[videoIndex].tools,
      creationDate: creationDate || videos[videoIndex].creationDate,
      duration: duration || videos[videoIndex].duration,
      thumbnailUrl: finalThumbnail
    };

    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf-8");

    res.json(videos[videoIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "更新视频失败" });
  }
});

// 5. Delete video
app.delete("/api/videos/:id", (req, res) => {
  try {
    const id = req.params.id;
    const currentData = fs.readFileSync(VIDEOS_FILE, "utf-8");
    const videos = JSON.parse(currentData);

    const videoIndex = videos.findIndex((v: any) => v.id === id);
    if (videoIndex === -1) {
      return res.status(404).json({ error: "找不到该视频" });
    }

    const videoToDelete = videos[videoIndex];

    // If it's a file saved under uploads, physically delete it
    if (videoToDelete.videoUrl.startsWith("/uploads/")) {
      const filename = videoToDelete.videoUrl.replace("/uploads/", "");
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    videos.splice(videoIndex, 1);
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf-8");

    res.json({ success: true, message: "视频删除成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "删除视频失败" });
  }
});

// ---------------------- VITE & SITE BOOT ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted and running on http://localhost:${PORT}`);
  });
}

startServer();
