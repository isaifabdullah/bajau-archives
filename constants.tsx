
import React from 'react';
import { Song, TeamMember, CommunityStory } from './types';

// Using public sample audio files for demonstration
export const SONGS_MOCK: Song[] = [
  {
    id: '1',
    title: 'Igal Igal - The Sea Dance',
    genre: 'Traditional Dance',
    performer: 'Semporna Heritage Group',
    description: 'A rhythmic accompaniment for traditional dance, symbolizing the movement of sea waves.',
    duration: '4:20',
    origin: 'Semporna, Sabah',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Lullaby of the Nomads',
    genre: 'Vocal',
    performer: 'Hajah Aminah',
    description: 'An oral history passed down through generations, sung to soothe infants on houseboats.',
    duration: '3:15',
    origin: 'Sitangkai',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Kulintangan Ensemble',
    genre: 'Instrumental',
    performer: 'Bajau Laut Ensemble',
    description: 'The iconic gong ensemble music used during weddings and community festivities.',
    duration: '12:05',
    origin: 'Mabul Island',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Mohammad Fuad Awwad',
    role: 'Team Leader',
    email: '23083220@siswa.um.edu.my',
    description: 'Overseeing project coordination and direction for the digital archive.'
  },
  {
    name: 'Nur Husna Binti Muhammad Ridzwan',
    role: 'Secretary',
    email: '24004494@siswa.um.edu.my',
    description: 'Managing administrative tasks and organizing project documentation.'
  },
  {
    name: 'Nur Aisyah Binti Mohd Hafizan',
    role: 'Content and Documentation',
    email: '23002256@siswa.um.edu.my',
    description: 'Curating cultural narratives and managing oral history compilation.'
  },
  {
    name: 'Shi Nian',
    role: 'Content and Documentation',
    email: '23118051@siswa.um.edu.my',
    description: 'Focusing on the preservation of Bajau linguistic heritage and content translation.'
  },
  {
    name: 'Hussin Mahmoud Abdelaal Mahmoud',
    role: 'Content and Documentation',
    email: '22120218@siswa.um.edu.my',
    description: 'Exploring the cultural significance of maritime folk traditions.'
  },
  {
    name: 'Md Saif Abdullah Biswas',
    role: 'Technical Team',
    email: '23092298@siswa.um.edu.my',
    description: 'Developing the digital infrastructure and ensuring platform accessibility.'
  },
  {
    name: 'Ling Lit Ren Rennon',
    role: 'Technical Team',
    email: '23088902@siswa.um.edu.my',
    description: 'Optimizing web performance and technical processing of audio materials.'
  },
  {
    name: 'Darshini Timi A/P V Vasanthan',
    role: 'Media Processing',
    email: '23001002@siswa.um.edu.my',
    description: 'Handling multi-media synthesis and visual layout of project findings.'
  },
  {
    name: 'Tu Chaiyucheng',
    role: 'Media Processing',
    email: '23057019@siswa.um.edu.my',
    description: 'Specializing in digital media editing and visual storytelling for the archive.'
  }
];

export const STORIES: CommunityStory[] = [
  {
    id: 's1',
    title: 'The Resilience of the Sea Nomads',
    author: 'Daniel',
    date: 'Oct 12, 2026',
    excerpt: 'Understanding the deep connection between Bajau music and the rhythmic pulse of the ocean.',
    content: 'The Sama-Bajau people, often referred to as Sea Nomads, possess a culture that is inextricably linked to the maritime environment...',
    image: 'https://images.unsplash.com/photo-1589197331516-4d84593e64e6?q=80&w=800'
  }
];

export const ACCESS_KEY = 'UM-BAJAU-2026';
export const ADMIN_KEY = 'bajauarchives-admin';
