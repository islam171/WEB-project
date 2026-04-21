interface Movie {
  id: number;
  title: string;
  poster: string;
  year: string;
  likes: number;
  rating: number;
  short_description: string;
  backdrop: string;
}

export interface MovieGenre {
  id: number;
  name: string,
  movies: Movie[];
}