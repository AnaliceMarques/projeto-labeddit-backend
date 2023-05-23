export interface CommentDB {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface CommentDBWhitUsername {
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

export interface CommentModel {
  id: string;
  postId: string;
  content: string;
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
  comment_id: string;
  like: number;
}

export enum COMMENT_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKE",
}

export class Comment {
  constructor(
    private id: string,
    private postId: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private userId: string,
    private username: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getPostId(): string {
    return this.postId;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(value: string): void {
    this.content = value;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(value: number): void {
    this.likes = value;
  }

  public addLike = (): void => {
    this.likes++;
  };

  public removeLike = (): void => {
    this.likes--;
  };

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(value: number): void {
    this.dislikes = value;
  }

  public addDislike = (): void => {
    this.dislikes++;
  };

  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      user_id: this.userId,
      post_id: this.postId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      postId: this.postId,
      content: this.content,
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
