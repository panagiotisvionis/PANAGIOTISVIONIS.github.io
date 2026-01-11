
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  description: string;
  techStack: string[];
  link?: string;
}

// Added Artist interface to fix import error in ArtistCard.tsx
export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  day: string;
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  WORK = 'work',
  ABOUT = 'about',
  SERVICES = 'services',
}
