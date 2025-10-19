import z from "zod";


export const postSchema={
body: z.object({
  content: z.union([
    z.string().min(1).max(5000),
    z.object({
      text: z.string().min(1).max(5000),
    }),
  ]).optional(),
})

}
export const updatePostSchema={
    body: z.object({
        content: z.string().min(1).max(5000),
    }),
    params: z.object({
        postId: z.string().trim().length(24),
    })
}

export const reactionSchema={
    body: z.object({
        reaction: z.number().min(0).max(6),
    }),
    params: z.object({
        postId: z.string().trim().length(24),
    })
}
