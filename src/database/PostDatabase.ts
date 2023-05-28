import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";

  //Insert Post
  insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB);
  };

  //Get All Posts
  getAllPosts = async (): Promise<PostDB[] | undefined> => {
    const postDB: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    );

    return postDB;
  };

  //Find Post by Id
  findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });

    return postDB;
  };

  //Find Post by userId
  findPostByUserId = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ user_id: id });

    return postDB;
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
}
