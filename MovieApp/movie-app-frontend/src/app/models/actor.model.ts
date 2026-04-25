import { Movie } from './movie.model';

export interface Actor {
  id: number;
  name: string;
  photo: string;
  popularity: number;
  desc?: string;
  movies?: Movie[];
}
