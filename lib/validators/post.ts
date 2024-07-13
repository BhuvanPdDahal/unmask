import { z } from "zod";

export const CreatePostValidator = z.object({
    title: z.string().min(10, {
        message: "Title must be at least 10 characters long"
    }),
    description: z.string().min(40, {
        message: "Description must be at least 40 characters long"
    }),
    image: z.string().optional(),
    pollOptions: z.array(z.string()).min(2, {
        message: "Poll must have at least 2 options"
    }).max(6, {
        message: "Poll must have at most 6 options"
    }).optional().refine((options) => {
        if (!options) return true;
        const hasEmptyOption = options.findIndex((option) => option === "");
        if (hasEmptyOption === -1) return true;
        return false;
    }, {
        message: "Option cannot be empty"
    })
});

export const GetPostsValidator = z.object({
    page: z.number(),
    limit: z.number(),
    sort: z.enum(["hot", "recent", "views"]),
});

export const GetPostValidator = z.object({
    postId: z.string()
});

export const GetCommentsValidator = z.object({
    postId: z.string(),
    page: z.number(),
    commentsLimit: z.number(),
    repliesLimit: z.number(),
    sort: z.enum(["oldest", "newest", "top"])
});

export const CommentOnPostValidator = z.object({
    postId: z.string(),
    comment: z.string()
});

export type CreatePostPayload = z.infer<typeof CreatePostValidator>;
export type GetPostsPayload = z.infer<typeof GetPostsValidator>;
export type GetPostPayload = z.infer<typeof GetPostValidator>;
export type GetCommentsPayload = z.infer<typeof GetCommentsValidator>;
export type CommentOnPostPayload = z.infer<typeof CommentOnPostValidator>;