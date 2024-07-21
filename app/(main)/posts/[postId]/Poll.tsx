import { useState } from "react";
import { Package2 } from "lucide-react";

import PollResult from "./PollResult";
import { PollOption } from "./PostContent";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { useVoteOnPoll } from "@/hooks/useVoteOnPoll";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

interface PollProps {
    postId: string;
    pollId: string;
    pollOptions: PollOption[];
}

const Poll = ({
    postId,
    pollId,
    pollOptions
}: PollProps) => {
    const user = useCurrentUser();
    const isSignedIn = !!(user && user.id);
    const pollResultData = pollOptions.map((option) => ({
        id: option.id,
        option: option.option,
        votesCount: option._count.votes
    }));
    const votedOption = pollOptions.find((option) => {
        return option.votes.length && option.votes[0].voterId === user?.id;
    });
    const pollVotesCount = pollOptions.reduce((acc, option) => {
        return acc + option._count.votes;
    }, 0);
    const { open } = useSigninModal();
    const [activePollOptionId, setActivePollOptionId] = useState<string | undefined>(votedOption?.id);

    const {
        voteOnPoll,
        isPending
    } = useVoteOnPoll(
        postId,
        pollId,
        activePollOptionId || ""
    );

    return (
        <div className="p-4 border rounded-md mt-4">
            <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1 text-primary">
                    <Package2 className="size-4 text-primary" />
                    <span className="font-semibold text-[13.5px]">Poll</span>
                </div>
                <Separator orientation="vertical" className="bg-zinc-400 h-5" />
                <p className="text-[13.5px] text-zinc-800 font-medium">
                    <span className="font-semibold">{pollVotesCount} </span>
                    {pollVotesCount === 1 ? "Participant" : "Participants"}
                </p>
            </div>
            <div className="text-[13px] text-slate-500 my-3">
                Select only one answer
            </div>
            <RadioGroup
                defaultValue={activePollOptionId}
                onValueChange={setActivePollOptionId}
            >
                {pollOptions.map((option, index) => (
                    <Label
                        key={option.id}
                        htmlFor={`option-${index}`}
                        className="bg-accent flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer"
                    >
                        <RadioGroupItem
                            value={option.id}
                            id={`option-${index}`}
                            className="shrink-0 size-[18px] border-black text-black focus-visible:ring-0 focus-visible:ring-transparent"
                        />
                        <p className="leading-6 text-zinc-800 cursor-pointer">
                            {option.option}
                        </p>
                    </Label>
                ))}
            </RadioGroup>
            <div className="mt-4 space-y-2">
                <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                        if (isSignedIn) voteOnPoll();
                        else open();
                    }}
                    isLoading={isPending}
                    disabled={!activePollOptionId || isPending}
                >
                    {isPending ? "Voting" : "Vote"}
                </Button>
                {isSignedIn ? (
                    <PollResult
                        data={pollResultData}
                        totalVotes={pollVotesCount}
                        votedOptionId={votedOption?.id}
                    />
                ) : (
                    <Button
                        size="lg"
                        variant="ghost"
                        className="w-full"
                        onClick={open}
                    >
                        View Result
                    </Button>
                )}
            </div>
        </div>
    )
};

export default Poll;