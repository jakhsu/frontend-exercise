import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import pwgLogo from "../assets/pwgLogo.svg"
import { useNavigate } from "react-router-dom";
import { Post } from "@/types";


export const PostCard = ({ post, onEdit, onDelete }: { post: Post, onEdit: (post: Post) => void, onDelete: (post: Post) => void }) => {
    const navigate = useNavigate();
    const parseDateToYYYYMMDD = (date: string) => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`;
        const day = dateObj.getDate() > 9 ? dateObj.getDate() : `0${dateObj.getDate()}`;
        return `${year}-${month}-${day}`;
    }
    return (
        <Card className="w-[230px] h-[245px] overflow-y-hidden flex flex-col">
            <CardHeader className="relative pb-2">
                <span className="text-primary">
                    {parseDateToYYYYMMDD(post.date)}
                </span>
                <div className="absolute top-[6px] right-[4px]">
                    <img src={pwgLogo}></img>
                </div>
                <CardTitle className="truncate font-normal text-sm capitalize">
                    {post.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[75px]">
                <p className="break-words line-clamp-5 text-xs">
                    {post.body}
                </p>
            </CardContent>
            <CardFooter className="flex-col space-y-2 mt-3">
                <div className="truncate w-full">
                    {
                        post.tags.map((tag, index) => {
                            return (
                                <Badge key={index} variant={'primary-muted'} className="[&:not(:first-child)]:ml-2">
                                    {tag}
                                </Badge>
                            )
                        })
                    }
                </div>
                <div className="gap-x-4 flex w-full">
                    <button onClick={() => {
                        onEdit(post)
                    }}>
                        <Badge variant={'secondary'}>
                            Edit
                        </Badge>
                    </button>
                    <button onClick={() => {
                        navigate('/post/' + post.id)
                    }}>
                        <Badge>
                            View
                        </Badge>
                    </button>
                    <button onClick={() => {
                        onDelete(post)
                    }}>
                        <Badge variant={'destructive'}>
                            Delete
                        </Badge>
                    </button>
                </div>
            </CardFooter>
        </Card>
    )
}