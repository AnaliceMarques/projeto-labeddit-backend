import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import {
  GetAllPostsInputDTO,
  GetAllPostsOutputDTO,
} from "../dtos/post/getAllPosts.dto";
import {
  GetPostByIdInputDTO,
  GetPostByIdOutputDTO,
} from "../dtos/post/getPostById.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeOrDislike.dto";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/Unauthorizederror";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  //createPost
  createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const idExist = await this.postDatabase.findPostById(id);

    if (idExist) {
      throw new ConflictError();
    }
    console.log(payload);

    const post = new Post(
      id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.username
    );

    const postDB = post.toDBModel();
    await this.postDatabase.insertPost(postDB);

    const output: CreatePostOutputDTO = {
      message: "Post publicado com sucesso",
    };

    return output;
  };

  //getAllPosts
  getAllPosts = async (
    input: GetAllPostsInputDTO
  ): Promise<GetAllPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postsDBWithUsername = await this.postDatabase.getPostsWithUsername();

    const posts = postsDBWithUsername.map((postWithUsername) => {
      const post = new Post(
        postWithUsername.id,
        postWithUsername.content,
        postWithUsername.comments,
        postWithUsername.likes,
        postWithUsername.dislikes,
        postWithUsername.created_at,
        postWithUsername.updated_at,
        postWithUsername.user_id,
        postWithUsername.username
      );

      return post.toBusinessModel();
    });

    const output: GetAllPostsOutputDTO = { result: posts };

    return output;
  };

  //getPostById
  getPostById = async (
    input: GetPostByIdInputDTO
  ): Promise<GetPostByIdOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDBWithUsername = await this.postDatabase.findPostByIdWithUsername(
      postId
    );

    if (!postDBWithUsername) {
      throw new NotFoundError("não existe post com o id informado");
    }

    const post = new Post(
      postDBWithUsername.id,
      postDBWithUsername.content,
      postDBWithUsername.comments,
      postDBWithUsername.likes,
      postDBWithUsername.dislikes,
      postDBWithUsername.created_at,
      postDBWithUsername.updated_at,
      postDBWithUsername.user_id,
      postDBWithUsername.username
    );

    const postBusinessModel = post.toBusinessModel();
    const output: GetPostByIdOutputDTO = { result: postBusinessModel };

    return output;
  };

  //editPost
  editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDatabase.findPostById(idToEdit);

    if (!postDB) {
      throw new NotFoundError("não existe post com o id informado");
    }

    if (payload.id !== postDB.user_id) {
      throw new ForbiddenError("somente quem criou o post pode edita-lo");
    }

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

    post.setContent(content);
    post.setUpdatedAt(new Date().toISOString());

    const updatePostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatePostDB);

    const output: EditPostOutputDTO = {
      message: "Post atualizado com sucesso",
    };

    return output;
  };

  //deletePost
  deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDatabase.findPostById(idToDelete);

    if (!postDB) {
      throw new NotFoundError("não existe post com o id informado");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDB.user_id) {
        throw new ForbiddenError("somente quem criou o post pode excluí-lo");
      }
    }

    await this.postDatabase.deletePost(idToDelete);

    const output: DeletePostOutputDTO = {
      message: "Post excluído com sucesso",
    };

    return output;
  };

  //likeOrDislikePost
  likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, postId, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDBWithUsername = await this.postDatabase.findPostByIdWithUsername(
      postId
    );

    if (!postDBWithUsername) {
      throw new NotFoundError("não existe post com o id informado");
    }

    const post = new Post(
      postDBWithUsername.id,
      postDBWithUsername.content,
      postDBWithUsername.comments,
      postDBWithUsername.likes,
      postDBWithUsername.dislikes,
      postDBWithUsername.created_at,
      postDBWithUsername.updated_at,
      postDBWithUsername.user_id,
      postDBWithUsername.username
    );

    if (payload.id === postDBWithUsername.user_id) {
      throw new ForbiddenError(
        "Não é possível dar like ou dislike em seus posts"
      );
    }

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.postDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (!like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatePostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatePostDB);

    const output: LikeOrDislikePostOutputDTO = { message: "Reação enviada" };

    return output;
  };
}
