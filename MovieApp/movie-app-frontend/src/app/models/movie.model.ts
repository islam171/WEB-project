import { Actor } from './actor.model';

export interface Category {
  id: number;
  name: string;
}

export interface Movie {
  id: number;

  title: string;
  author?: string;
  year?: number | string;
  duration?: string;

  likes: number;
  rating: number | string;

  short_description?: string;
  description?: string;

  poster?: string;
  backdrop?: string;

  categories?: Category[];
  videoUrl?: string;
  actors?: Actor[];

  inWatchlist?: boolean;
  is_liked?: boolean;
}

export interface IReview {
  id: number;
  username: string;
  user_id: number;
  text: string;
  rating: number;
  timeLeft?: string;
  time_left?: string;
}
