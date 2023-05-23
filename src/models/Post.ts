export interface PostDB {
  id: string;
  user_id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface PostDBWhitUsername {
  id: string;
  user_id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  username: string;
}

export interface PostModel {
  id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface LikeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKE",
}

export class Post {
  constructor(
    private id: string,
    private content: string,
    private comments: number,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private userId: string,
    private username: string
  ) {}

  getId(): string {
    return this.id;
  }

  getContent(): string {
    return this.content;
  }

  setContent(value: string): void {
    this.content = value;
  }

  getComments(): number {
    return this.comments;
  }

  setComments(value: number): void {
    this.comments = value;
  }

  getLikes(): number {
    return this.likes;
  }

  setLikes(value: number): void {
    this.likes = value;
  }

  addLike = (): void => {
    this.likes++;
  };

  removeLike = (): void => {
    this.likes--;
  };

  getDislikes(): number {
    return this.dislikes;
  }

  setDislikes(value: number): void {
    this.dislikes = value;
  }

  addDislike = (): void => {
    this.dislikes++;
  };

  removeDislike = (): void => {
    this.dislikes--;
  };

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }

  toDBModel(): PostDB {
    return {
      id: this.id,
      user_id: this.userId,
      content: this.content,
      comments: this.comments,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      comments: this.comments,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      user: {
        id: this.userId,
        name: this.username,
      },
    };
  }
}
