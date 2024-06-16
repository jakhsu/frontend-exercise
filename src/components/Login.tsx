import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessModal } from "./SuccessModal";
import { useNavigate } from "react-router-dom";
import { FailureModal } from "./FailureModal";


export const Login = () => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [failureModalOpen, setFailureModalOpen] = useState(false);
    const authContext = useContext(AuthContext);

    const loginFormSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters long"
        }),

    })

    const navigate = useNavigate();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {}
    })

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        if (authContext) {
            const { email, password } = values;
            authContext.login(email, password).then(() => {
                setSuccessModalOpen(true);
                setTimeout(() => {
                    navigate('/posts');
                }, 1000);
            }).catch(() => {
                setFailureModalOpen(true);
            })
        }
    }

    return (
        <>
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle className="text-center py-4">Login Page</CardTitle>
                </CardHeader>
                <CardContent className="px-24">
                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8 w-96">
                            <FormField
                                control={loginForm.control}
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
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-full border-primary border-[1.77px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full text-black" type="submit">Login</Button>
                            <Button className="w-full" type="button" variant={'ghost'} onClick={() => {
                                navigate('/register');
                            }}>
                                <span className="text-primary">Create an account</span>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <SuccessModal open={successModalOpen} onOpenChange={setSuccessModalOpen} />
            <FailureModal open={failureModalOpen} onOpenChange={setFailureModalOpen} />
        </>
    )
}