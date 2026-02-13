import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

// Extend registration schema with confirm password or specific validations if needed
// For now we use the shared schema directly for validation simplicity on client
const registerSchema = insertUserSchema.extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
    const { user, registerMutation } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (user) {
            setLocation("/");
        }
    }, [user, setLocation]);

    const registerForm = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            name: "",
            email: "",
            phone: "",
            instagramHandle: "",
            referralSource: "",
        },
    });

    const onRegister = (data: RegisterValues) => {
        const { confirmPassword, ...userData } = data;
        registerMutation.mutate(userData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full min-h-screen flex items-center justify-center p-6 pt-24"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card/50 backdrop-blur-md border border-white/5 p-8 md:p-12"
            >
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-display font-bold mb-2">Welcome</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        Join the Velvyt Community
                    </p>
                </div>

                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                        <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/60">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="velvyt_user"
                                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/60">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jane Doe"
                                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="jane@example.com"
                                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+91..."
                                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={registerForm.control}
                            name="instagramHandle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/60">Instagram</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="@handle"
                                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={registerForm.control}
                            name="referralSource"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/60">Referred By (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Friend's Name"
                                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 uppercase text-xs font-bold tracking-widest mt-4"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? "Creating Account..." : "Register"}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </motion.div>
    );
}
