import DOMPurify from "isomorphic-dompurify";
import { useState } from "react";
import { Dot } from "lucide-react";
import { format, formatRelative } from "date-fns";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

import ReplyInput from "./ReplyInput";
import CommentEdit from "./CommentEdit";
import CommentOptions from "./CommentOptions";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";
import { useLikeOrUnlikeComment } from "@/hooks/useLikeOrUnlikeComment";

interface CommentProps {
    postId: string;
    commentId: string;
    commenterId: string;
    commenterUsername: string;
    commenterImage: string | null;
    comment: string;
    initialLikesCount: number;
    commentedAt: Date;
    updatedAt: Date;
    initialIsLiked: boolean;
}

const Comment = ({
    postId,
    commentId,
    commenterId,
    commenterUsername,
    commenterImage,
    comment,
    initialLikesCount,
    commentedAt,
    updatedAt,
    initialIsLiked
}: CommentProps) => {
    const currentUser = useCurrentUser();
    const isCommenter = currentUser?.id === commenterId;
    const isSignedIn = !!(currentUser && currentUser.id);
    const isEdited = new Date(updatedAt) > new Date(commentedAt);
    const title = `Commented on ${format(commentedAt, "PPp")}${isEdited ? "\nLast edited on " + format(updatedAt, "PPp") : ""}`;
    const { open, setPathToRedirect } = useSigninModal();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    const {
        likeOrUnlikeComment,
        likesCount,
        isLiked
    } = useLikeOrUnlikeComment(
        commentId,
        initialLikesCount,
        initialIsLiked
    );

    return (
        <>
            <li className="flex items-start gap-2">
                <UserAvatar
                    image={commenterImage}
                    username={commenterUsername}
                />
                <div className="w-full">
                    <div className="relative bg-accent w-full p-4 rounded-md rounded-ss-none">
                        <div className="text-xs flex items-center gap-0.5">
                            <div className="text-zinc-500 dark:text-zinc-400 font-semibold">
                                {commenterUsername}
                            </div>
                            <Dot className="size-4 text-zinc-800 dark:text-zinc-200" />
                            <span
                                title={title}
                                className="capitalize text-zinc-400 font-semibold"
                            >
                                {formatRelative(commentedAt, new Date())}
                                {isEdited && " (Edited)"}
                            </span>
                        </div>
                        {isCommenter && (
                            <CommentOptions
                                postId={postId}
                                commentId={commentId}
                                commenterUsername={commenterUsername}
                                comment={comment}
                                commentedAt={commentedAt}
                                isEdited={isEdited}
                                isEditOpen={isEditOpen}
                                setIsEditOpen={setIsEditOpen}
                            />
                        )}
                        {isEditOpen ? (
                            <CommentEdit
                                postId={postId}
                                commentId={commentId}
                                currentComment={comment}
                                setIsEditOpen={setIsEditOpen}
                            />
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }}
                                className="text-sm leading-6 text-zinc-800 dark:text-zinc-200 font-medium mt-0.5 [&_p]:min-h-4"
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-x-3 mt-2">
                        <div
                            className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                            onClick={() => {
                                if (isSignedIn) likeOrUnlikeComment();
                                else {
                                    setPathToRedirect(`/post/${postId}`);
                                    open();
                                }
                            }}
                        >
                            {isLiked ? (
                                <HiHeart className="size-4" />
                            ) : (
                                <HiOutlineHeart className="size-4" />
                            )}
                            {likesCount}
                        </div>
                        <Separator orientation="vertical" className="h-5" />
                        <Button
                            size="sm"
                            className="bg-transparent p-0 border-0 text-black dark:text-white font-semibold hover:bg-transparent hover:text-accent-foreground"
                            onClick={() => setIsReplyOpen((prev) => !prev)}
                        >
                            {isReplyOpen ? "Close" : "Reply"}
                        </Button>
                    </div>
                </div>
            </li>
            {isReplyOpen && (
                <ReplyInput
                    postId={postId}
                    commentId={commentId}
                    setIsReplyOpen={setIsReplyOpen}
                />
            )}
        </>
    );
};

export default Comment;

export const CommentLoader = () => (
    <li className="flex gap-2">
        <Skeleton className="shrink-0 h-10 w-10 rounded-full" />
        <div className="w-full">
            <Skeleton className="h-[74px] w-full rounded-md rounded-ss-none" />
            <div className="flex items-center gap-x-3 mt-2">
                <div className="pl-2 pr-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                    <HiOutlineHeart className="size-4" />
                </div>
                <Separator orientation="vertical" className="h-5" />
                <Button
                    size="sm"
                    className="bg-transparent p-0 border-0 text-black dark:text-white font-semibold pointer-events-none"
                >
                    Reply
                </Button>
            </div>
        </div>
    </li>
);