import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWhitUsername,
  LikeDislikeDB,
} from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";

  //Insert Comment
  insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  //Find Comment by Id
  findCommentById = async (id: string): Promise<CommentDB | undefined> => {
    const [commentDB]: CommentDB[] | undefined = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    ).where({ id });

    return commentDB;
  };

  findCommentByIdWithUsername = async (
    id: string
  ): Promise<CommentDBWhitUsername | undefined> => {
    const [result]: CommentDBWhitUsername[] | undefined =
      await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .select(
          `${CommentDatabase.TABLE_COMMENTS}.*`,
          `${UserDatabase.TABLE_USERS}.username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${CommentDatabase.TABLE_COMMENTS}.user_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        )
        .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id });

    return result;
  };

  //Get All Comments by postId
  getAllCommentsForPostIdWithUsername = async (
    id: string
  ): Promise<CommentDBWhitUsername[]> => {
    const commentsDB: CommentDBWhitUsername[] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.*`,
        `${UserDatabase.TABLE_USERS}.username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.user_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${CommentDatabase.TABLE_COMMENTS}.post_id`]: id });

    return commentsDB;
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

  //Like or Dislike
  findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const [result]: LikeDislikeDB[] | undefined = await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).where({
      user_id: likeDislikeDB.user_id,
      comment_id: likeDislikeDB.comment_id,
    });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(likeDislikeDB);
  };
}
