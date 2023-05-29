import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CreateCommentSchema } from "../dtos/comment/createComment.dto";
import { GetCommentsByPostIdSchema } from "../dtos/comment/getCommentsByPostId.dto";
import { EditCommentSchema } from "../dtos/comment/editComment.dto";
import { DeleteCommentSchema } from "../dtos/comment/deleteComment.dto";
import { LikeOrDislikeCommentSchema } from "../dtos/comment/likeOrDislikeComment.dto";

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  //createComment
  createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
        postId: req.params.id,
      });

      const output = await this.commentBusiness.createComment(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //getCommentsByPostId
  getCommentsByPostId = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsByPostIdSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
      });

      const output = await this.commentBusiness.getCommentsByPostId(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //editComment
  editComment = async (req: Request, res: Response) => {
    try {
      const input = EditCommentSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idToEdit: req.params.id,
      });

      const output = await this.commentBusiness.editComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //deleteComment
  deleteComment = async (req: Request, res: Response) => {
    try {
      const input = DeleteCommentSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      const output = await this.commentBusiness.deleteComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //likeOrDislikeComment
  likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.id,
        like: req.body.like,
      });

      const output = await this.commentBusiness.likeOrDislikeComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
