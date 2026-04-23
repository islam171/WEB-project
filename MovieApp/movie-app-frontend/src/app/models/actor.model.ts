export interface Actor {
  id: number;
  name: string;
  photo: string;
  popularity: number;
  desc?: string;
  likes?: number;

  isLiked?: boolean;
  is_liked?: boolean;
}
