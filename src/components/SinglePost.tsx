import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { type Post } from "@/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ActionHeader } from "./ActionHeader";

export const SinglePost = () => {
    const authContext = useContext(AuthContext);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<Post | null>(null)
    const navigate = useNavigate();

    const getPostById = (token: string, id: string) => {
        return axios.get(`${baseURL}/posts/view/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    useEffect(() => {
        if (authContext?.token && id) {
            getPostById(authContext
                .token, id)
                .then((response) => {
                    setPost(response.data)
                })
        }
    }, [])

    return (
        <>
            <div className="w-full h-full flex gap-y-4 flex-col items-center">
                <ActionHeader action={() => {
                    navigate("/posts")
                }} actionBtnText="Back" />
                View Post
                <Card className="flex flex-col min-w-96 p-12 gap-y-8 bg-white">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <span className="font-semibold">
                                {post?.title}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p>
                            {post?.body}
                        </p>
                    </CardContent>
                    <CardFooter className="p-0 gap-x-2">
                        {post?.tags.map((tag) => (
                            <Badge variant={'primary-muted'}>
                                {tag}
                            </Badge>
                        ))}
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}