import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  DeleteCommentInputDTO,
  DeleteCommentOutputDTO,
} from "../dtos/comment/deleteComment.dto";
import {
  EditCommentInputDTO,
  EditCommentOutputDTO,
} from "../dtos/comment/editComment.dto";
import {
  GetCommentsByPostIdInputDTO,
  GetCommentsByPostIdOutputDTO,
} from "../dtos/comment/getCommentsByPostId.dto";
import {
  LikeOrDislikeCommentInputDTO,
  LikeOrDislikeCommentOutputDTO,
} from "../dtos/comment/likeOrDislikeComment.dto";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/Unauthorizederror";
import { COMMENT_LIKE, Comment, LikeDislikeDB } from "../models/Comment";
import { Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  //createComment
  createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { content, token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDatabase = new PostDatabase();
    const postDB = await postDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError("não existe post com o id informado");
    }

    const id = this.idGenerator.generate();

    const idExist = await this.commentDatabase.findCommentById(id);

    if (idExist) {
      throw new ConflictError();
    }
    console.log(payload);

    const comment = new Comment(
      id,
      postDB.id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.username
    );

    const commentDB = comment.toDBModel();
    await this.commentDatabase.insertComment(commentDB);

    const output: CreateCommentOutputDTO = {
      message: "Comentário publicado com sucesso",
    };

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.comments,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      postDB.user_id,
      payload.username
    );

    post.setComments(postDB.comments + 1);
    post.setUpdatedAt(new Date().toISOString());

    const updatePostDB = post.toDBModel();
    await postDatabase.updatePost(updatePostDB);

    return output;
  };

  //getCommentsByPostId
  getCommentsByPostId = async (
    input: GetCommentsByPostIdInputDTO
  ): Promise<GetCommentsByPostIdOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDatabase = new PostDatabase();
    const postDBWithUsername = await postDatabase.findPostByIdWithUsername(
      postId
    );

    if (!postDBWithUsername) {
      throw new NotFoundError("não existe post com o id informado");
    }

    const commentsDBWithUsername =
      await this.commentDatabase.getAllCommentsForPostIdWithUsername(postId);

    const comments = commentsDBWithUsername.map((commentWithUsername) => {
      const comment = new Comment(
        commentWithUsername.id,
        commentWithUsername.post_id,
        commentWithUsername.content,
        commentWithUsername.likes,
        commentWithUsername.dislikes,
        commentWithUsername.created_at,
        commentWithUsername.updated_at,
        commentWithUsername.user_id,
        commentWithUsername.username
      );

      return comment.toBusinessModel();
    });

    const output: GetCommentsByPostIdOutputDTO = { result: comments };

    return output;
  };

  //editComment
  editComment = async (
    input: EditCommentInputDTO
  ): Promise<EditCommentOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentDatabase.findCommentById(idToEdit);

    if (!commentDB) {
      throw new NotFoundError("não existe comentário com o id informado");
    }

    if (payload.id !== commentDB.user_id) {
      throw new ForbiddenError("somente quem criou o comentário pode edita-lo");
    }

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.user_id,
      payload.username
    );

    comment.setContent(content);
    comment.setUpdatedAt(new Date().toISOString());

    const updateCommentDB = comment.toDBModel();
    await this.commentDatabase.updateComment(updateCommentDB);

    const output: EditCommentOutputDTO = {
      message: "Comentário atualizado com sucesso",
    };

    return output;
  };

  //deleteComment
  deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentDatabase.findCommentById(idToDelete);

    if (!commentDB) {
      throw new NotFoundError("não existe post com o id informado");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentDB.user_id) {
        throw new ForbiddenError("somente quem criou o post pode excluí-lo");
      }
    }

    await this.commentDatabase.deleteComment(idToDelete);

    const output: DeleteCommentOutputDTO = {
      message: "Comentário excluído com sucesso",
    };

    return output;
  };

  //likeOrDislikeComment
  likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { token, commentId, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDBWithUsername =
      await this.commentDatabase.findCommentByIdWithUsername(commentId);

    if (!commentDBWithUsername) {
      throw new NotFoundError("não existe comentário com o id informado");
    }

    const comment = new Comment(
      commentDBWithUsername.id,
      commentDBWithUsername.post_id,
      commentDBWithUsername.content,
      commentDBWithUsername.likes,
      commentDBWithUsername.dislikes,
      commentDBWithUsername.created_at,
      commentDBWithUsername.updated_at,
      commentDBWithUsername.user_id,
      commentDBWithUsername.username
    );

    if (payload.id === commentDBWithUsername.user_id) {
      throw new ForbiddenError(
        "Não é possível dar like ou dislike em seus comentários"
      );
    }

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeLike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (!like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeDislike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentDatabase.insertLikeDislike(likeDislikeDB);
      like ? comment.addLike() : comment.addDislike();
    }

    const updateCommentDB = comment.toDBModel();
    await this.commentDatabase.updateComment(updateCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = { message: "Reação enviada" };

    return output;
  };
}
