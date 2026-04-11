export interface Category {
  id: number;
  name: string;
}

export interface Movie {
  id: number;

  title: string;
  author: string;
  year: number;
  duration?: string;

  likes?: number;
  rating?: string;

  short_description?: string;
  description: string;

  poster?: string;
  backdrop?: string;

  categories: Category[];
  videoUrl?: string;
  inWatchlist: boolean;
}


export interface IReview {
  id: number;
  username: string;
  text: string;
  rating: number;
  timeLeft: string;
}