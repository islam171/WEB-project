export interface Actor {
  id: number,
  name: string,
  photo: string,
  desc: string,
  popularity: number;
  isLiked?: boolean;
  likes: number;
}
