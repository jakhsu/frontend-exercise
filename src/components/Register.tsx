import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { SuccessModal } from "./SuccessModal";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

export const Register = () => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [registerResponseMsg, setRegisterResponseMsg] = useState("");
    const authContext = useContext(AuthContext);

    const allowedRoles = [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
    ] as const


    const registerFormSchema = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters long"
        }),
        role: z.string().refine((role) => allowedRoles.some((allowedRole) => allowedRole.value === role), {
            message: "Role must be either 'admin' or 'user'"
        })
    })

    const navigate = useNavigate();

    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {}
    })

    function onSubmit(values: z.infer<typeof registerFormSchema>) {
        if (authContext) {
            const { email, password, username, role } = values;
            authContext.register(username, email, password, role).then((response) => {
                setRegisterResponseMsg(response.data.message);
                setSuccessModalOpen(true);
                setTimeout(() => {
                    authContext.login(email, password).then(() => {
                        navigate('/');
                    })
                }, 2000);
            }).catch(e => {
                registerForm.setError("email", {
                    message: e.response.data.error
                })
            })
        }
    }

    return (
        <>
            <Card className="max-w-xl w-full">
                <CardHeader>
                    <CardTitle className="text-center py-4">Register Page</CardTitle>
                </CardHeader>
                <CardContent className="px-8 md:px-12 lg:px-16">
                    <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={registerForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-full border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-full border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" className="rounded-full border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <div className="flex p-2 items-center justify-between rounded-xl border-primary border-[1.77px]">
                                                        {field.value?.length > 0 ? (
                                                            <div className="flex gap-2 flex-wrap">
                                                                <Badge variant={'muted'} className="hover:bg-primary">
                                                                    {field.value}
                                                                </Badge>
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
                                                            {allowedRoles.map((role) => (
                                                                <CommandItem
                                                                    value={role.label}
                                                                    key={role.value}
                                                                    onSelect={() => {
                                                                        field.onChange(role.value);
                                                                    }}
                                                                >
                                                                    {role.label}
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
                            <Button className="w-full text-black" type="submit">Register</Button>
                            <Button className="w-full" type="button" variant={'ghost'} onClick={() => navigate('/login')}>
                                <span className="text-primary">Back to Login Page</span>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <SuccessModal open={successModalOpen} msg={registerResponseMsg} onOpenChange={(open) => { setSuccessModalOpen(open); navigate('/posts'); }} />
        </>
    )
}