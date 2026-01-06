
export interface Song {
  id: string;
  title: string;
  genre: string;
  performer: string;
  description: string;
  duration: string;
  origin: string;
  audioUrl?: string; // URL for the audio file (base64 or external link)
  lyrics?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  description: string;
}

export interface CommunityStory {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
}
