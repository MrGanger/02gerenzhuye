export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  contactEmail: string;
  wechat: string;
  github: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  shortDesc: string;
  description: string;
  creationDate: string;
  role: string;
  tools: string[];
  duration?: string;
}
