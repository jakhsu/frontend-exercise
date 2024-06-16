import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { set, z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { SuccessModal } from "./SuccessModal";

export const Register = () => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [registerResponseMsg, setRegisterResponseMsg] = useState("");
    const authContext = useContext(AuthContext);

    const allowedRoles = ["user", "admin"] as const

    const registerFormSchema = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters long"
        }),
        role: z.enum(allowedRoles)
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
                    navigate('/posts');
                }, 2000);
            })
        }
    }

    return (
        <>
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle className="text-center py-4">Register Page</CardTitle>
                </CardHeader>
                <CardContent className="px-24">
                    <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-8 w-96">
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
                                        <FormControl>
                                            <Input className="rounded-full border-primary border-[1.77px]" {...field} />
                                        </FormControl>
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