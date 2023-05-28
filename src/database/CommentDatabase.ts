import { CommentDB } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";

  //Insert Comment
  insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  //Get All Comments by postId
  getAllCommentsPostId = async (
    id: string
  ): Promise<CommentDB[] | undefined> => {
    const commentDB: CommentDB[] | undefined = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    ).where({ post_id: id });

    return commentDB;
  };

  //Update Comment
  updateComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: commentDB.id });
  };

  //Delete Comment
  deleteComment = async (id: string): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id });
  };
}
