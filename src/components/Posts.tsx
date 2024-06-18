import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Badge } from "./ui/badge";
import { PostCard } from "./PostCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import { useParams } from "react-router-dom";
import { Account, AllPostResponse, Post } from "@/types";
import { OverviewCard } from "./OverviewCard";
import { Textarea } from "./ui/textarea";
import { ActionHeader } from "./ActionHeader";

export const Posts = () => {
    const [newPostModalOpen, setNewPostModalOpen] = useState(false);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const authContext = useContext(AuthContext);
    const [allPostsResponse, setAllPostsResponse] = useState<AllPostResponse | null>(null);
    const [allMyPostsResponse, setAllMyPostsResponse] = useState<AllPostResponse | null>(null);
    const [accounts, setAccounts] = useState<Account[] | null>(null);
    const { page: pageParam } = useParams<{ page: string }>()
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const [editPostModalOpen, setEditPostModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const getAllPosts = (token: string, page: number, limit: number) => {
        return axios.get(`${baseURL}/posts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                limit
            }
        })
    }

    const getAllMyPosts = (token: string, page: number, limit?: number) => {
        return axios.post(`${baseURL}/posts/mypost`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                limit
            }
        })
    }

    const getAllAccounts = (token: string) => {
        return axios.get(`${baseURL}/accounts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }



    const createPost = (values: z.infer<typeof newPostFormSchema>) => {
        if (authContext) {
            const { token } = authContext;
            return axios.post(`${baseURL}/posts/create`, {
                title: values.title,
                body: values.content,
                tags: values.tags

            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
        }
    }

    const editPost = (values: z.infer<typeof newPostFormSchema>) => {
        if (authContext) {
            const { token } = authContext;
            return axios.put(`${baseURL}/posts/edit/${currentPost?.id}`, {
                title: values.title,
                body: values.content,
                tags: values.tags
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
    }

    const deletePost = (id: string) => {
        if (authContext) {
            const { token } = authContext;
            return axios.delete(`${baseURL}/posts/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
    }


    const allowedTags = [
        { label: "history", value: "history" },
        { label: "american", value: "american" },
        { label: "crime", value: "crime" },
        { label: "science", value: "science" },
        { label: "fiction", value: "fiction" },
        { label: "fantasy", value: "fantasy" },
        { label: "space", value: "space" },
        { label: "adventure", value: "adventure" },
        { label: "nature", value: "nature" },
        {
            label: "environment",
            value: "environment"
        }, {
            label: "philosophy",
            value: "philosophy"
        }, {
            label: "psychology",
            value: "psychology"
        },
        {
            label: "health",
            value: "health"
        }
    ] as const

    const newPostFormSchema = z.object({
        title: z.string().trim().min(1),
        content: z.string().trim().min(1),
        tags: z.array(z.string()).refine((tags) => {
            return tags.every(tag =>
                allowedTags.some(allowedTag => allowedTag.value === tag)
            );
        }, {
            message: "Invalid tags"
        })
    })


    const newPostForm = useForm<z.infer<typeof newPostFormSchema>>({
        resolver: zodResolver(newPostFormSchema),
        defaultValues: {
            tags: []
        }
    })

    const editPostForm = useForm<z.infer<typeof newPostFormSchema>>({
        resolver: zodResolver(newPostFormSchema),
        defaultValues: {
            title: currentPost?.title,
            content: currentPost?.body,
            tags: currentPost?.tags
        }
    })

    function onSubmit(values: z.infer<typeof newPostFormSchema>) {
        createPost(values)?.then(() => {
            setRefresh(!refresh)
            setNewPostModalOpen(false);
        })
    }

    function onEditSubmit(values: z.infer<typeof newPostFormSchema>) {
        editPost(values)?.then(() => {
            setRefresh(!refresh)
            setEditPostModalOpen(false);
        })
    }

    useEffect(() => {
        if (authContext) {
            const { token, role } = authContext;
            setRole(role);
            if (role === 'user') {
                token && getAllMyPosts(token, currentPage, 9).then(response => {
                    const typedResponse = response.data as AllPostResponse;
                    setAllPostsResponse(typedResponse);
                })
            } else if (role === 'admin') {
                token && getAllPosts(token, currentPage, 6).then(response => {
                    const typedResponse = response.data as AllPostResponse;
                    setAllPostsResponse(typedResponse);
                })
                token && getAllMyPosts(token, currentPage).then(response => {
                    const typedResponse = response.data as AllPostResponse;
                    setAllMyPostsResponse(typedResponse);
                })
                token && getAllAccounts(token).then(response => {
                    setAccounts(response.data.accounts as Account[])
                })
            }
        }

    }, [refresh, authContext]);

    useEffect(() => {
        if (currentPost) {
            editPostForm.reset({
                title: currentPost.title,
                content: currentPost.body,
                tags: currentPost.tags,
            });
        }
    }, [currentPost, editPostForm]);

    useEffect(() => {
        if (newPostForm.formState.isSubmitSuccessful) {
            newPostForm.reset();
        }
        if (editPostForm.formState.isSubmitSuccessful) {
            editPostForm.reset();
        }
    }, [newPostForm.formState.isSubmitSuccessful, editPostForm.formState.isSubmitSuccessful])


    return (
        <>
            <div className="w-full h-full flex gap-y-4 flex-col items-center">
                <ActionHeader action={() => {
                    setNewPostModalOpen(true)
                }} actionBtnText="Add New Post" />
                Post List
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {role === 'admin' && (<><OverviewCard
                        title="Total Account"
                        value={accounts?.length}
                        className="bg-primary-muted"
                    />
                        <OverviewCard
                            title="Total Post"
                            value={allPostsResponse?.totalPosts}
                            className="bg-destructive-muted"
                        />
                        <OverviewCard
                            title="My Post"
                            value={allMyPostsResponse?.totalPosts}
                            className="bg-secondary-muted"
                        /> </>)}

                    {
                        allPostsResponse?.data.map((post) => (
                            <PostCard key={post.id} post={post} onEdit={(post) => {
                                setCurrentPost(post)
                                setEditPostModalOpen(true)
                            }}
                                onDelete={(post) => {
                                    setCurrentPost(post)
                                    setDeleteModalOpen(true)

                                }}

                            />
                        ))
                    }
                </div>
                <Pagination className="">
                    <PaginationContent>
                        {
                            Array.from({ length: allPostsResponse?.totalPages || 0 }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink className={cn("bg-white", { "bg-primary": currentPage === (index + 1) })} isActive={
                                        currentPage === (index + 1)
                                    } href={(index + 1).toString()}>{index + 1}</PaginationLink>
                                </PaginationItem>
                            ))
                        }
                    </PaginationContent>
                </Pagination>
            </div>
            <Dialog open={newPostModalOpen} onOpenChange={setNewPostModalOpen}>
                <DialogContent className="items-center">
                    <DialogHeader>
                        <DialogTitle >Add A Post</DialogTitle>
                    </DialogHeader>
                    <Form {...newPostForm}>
                        <form className="space-y-8 w-full" onSubmit={newPostForm.handleSubmit(onSubmit)}>
                            <FormField
                                control={newPostForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={newPostForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none rounded-xl border-primary border-[1.77px]" {...field}></Textarea>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={newPostForm.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tags</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <div className="flex p-2 items-center justify-between rounded-xl border-primary border-[1.77px]">
                                                        {field.value.length > 0 ? (
                                                            <div className="flex gap-2 flex-wrap">
                                                                {
                                                                    field.value.map(tag => (
                                                                        <Badge key={tag} className="hover:bg-primary">
                                                                            {allowedTags.find(t => t.value === tag)?.label}
                                                                        </Badge>
                                                                    ))
                                                                }
                                                            </div>

                                                        ) : (
                                                            <span className="text-muted-foreground justify-end">Select Tags</span>
                                                        )}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </div>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search tags..." />
                                                    <CommandEmpty>No tag found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandList>
                                                            {allowedTags.map((tag) => (
                                                                <CommandItem
                                                                    value={tag.label}
                                                                    key={tag.value}
                                                                    onSelect={() => {
                                                                        const currentTags = newPostForm.getValues('tags');
                                                                        if (!currentTags.includes(tag.value)) {
                                                                            newPostForm.setValue("tags", [...currentTags, tag.value]);
                                                                        } else {
                                                                            newPostForm.setValue("tags", currentTags.filter(t => t !== tag.value));
                                                                        }
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value.includes(tag.value) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {tag.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={editPostModalOpen} onOpenChange={setEditPostModalOpen}>
                <DialogContent className="items-center px-[4.5rem]">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-normal" >Edit Post</DialogTitle>
                    </DialogHeader>
                    <Form {...editPostForm}>
                        <form className="space-y-8 w-full" onSubmit={editPostForm.handleSubmit(onEditSubmit)}>
                            <FormField
                                control={editPostForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editPostForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none rounded-xl border-primary border-[1.77px]" {...field}></Textarea>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editPostForm.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tags</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <div className="flex p-2 items-center justify-between rounded-xl border-primary border-[1.77px]">
                                                        {field.value?.length > 0 ? (
                                                            <div className="flex gap-2 flex-wrap">
                                                                {
                                                                    field.value.map(tag => (
                                                                        <Badge key={tag} variant={'muted'} className="hover:bg-primary">
                                                                            {allowedTags.find(t => t.value === tag)?.label}
                                                                        </Badge>
                                                                    ))
                                                                }
                                                            </div>

                                                        ) : (
                                                            <span className="text-muted-foreground justify-end">Select Tags</span>
                                                        )}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </div>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search tags..." />
                                                    <CommandEmpty>No tag found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandList>
                                                            {allowedTags.map((tag) => (
                                                                <CommandItem
                                                                    value={tag.label}
                                                                    key={tag.value}
                                                                    onSelect={() => {
                                                                        const currentTags = editPostForm.getValues('tags');
                                                                        if (currentTags.includes(tag.value)) {
                                                                            editPostForm.setValue("tags", currentTags.filter(t => t !== tag.value));
                                                                        } else {
                                                                            editPostForm.setValue("tags", [...currentTags, tag.value]);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value.includes(tag.value) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {tag.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between px-14 w-full">
                                <Button type="button" variant={'primary-muted'} className="rounded-xl" onClick={() => {
                                    setEditPostModalOpen(false)
                                }}>Cancel</Button>
                                <Button type="submit" className="rounded-xl" >Edit</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="items-center">
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-destructive font-normal text-center">{currentPost?.title}</DialogTitle>
                        <span className="text-center">Are you sure you want to delete this post?</span>
                    </DialogHeader>
                    <div className="justify-center flex gap-x-4">
                        <Button size={'sm'} variant={'primary-muted'} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                        <Button size={'sm'} variant={'destructive'} onClick={() => {
                            currentPost?.id && deletePost(currentPost?.id)!.then(() => {
                                setRefresh(!refresh)
                                setDeleteModalOpen(false)
                            })
                        }}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}