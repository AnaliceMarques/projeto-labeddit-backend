import {
  LikeDislikeDB,
  POST_LIKE,
  PostDB,
  PostDBWhitUsername,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";

  //Insert Post
  insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB);
  };

  //Get All Posts
  public getPostsWithUsername = async (): Promise<PostDBWhitUsername[]> => {
    const result: PostDBWhitUsername[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select(
        `${PostDatabase.TABLE_POSTS}.*`,
        `${UserDatabase.TABLE_USERS}.username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.user_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return result;
  };

  //Find Post by Id
  findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });

    return postDB;
  };

  findPostByIdWithUsername = async (
    id: string
  ): Promise<PostDBWhitUsername | undefined> => {
    const [result]: PostDBWhitUsername[] | undefined =
      await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
        .select(
          `${PostDatabase.TABLE_POSTS}.*`,
          `${UserDatabase.TABLE_USERS}.username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${PostDatabase.TABLE_POSTS}.user_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        )
        .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id });

    return result;
  };

  //Update Post
  updatePost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  };

  //Delete Post
  deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({ id });
  };

  //Like or Dislike
  findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result]: LikeDislikeDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POSTS
    ).where({
      user_id: likeDislikeDB.user_id,
      post_id: likeDislikeDB.post_id,
    });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  updateLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  insertLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
    await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POSTS
    ).insert(likeDislikeDB);
  };
}
