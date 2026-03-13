"use server"
import { supabase } from "@/assets/supabase-client";

export const registerUser = async (prevState: any, formData: FormData) => {
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    if (!fullname || !email || !password || !repeatPassword) {
        return {
            success: false,
            message: "All fields are required"
        }
    }

    if (password.length < 6) {
        return {
            success: false,
            message: "Your password is too short"
        }
    }

    if (password !== repeatPassword) {
        return {
            success: false,
            message: "Both passwords don't match"
        }
    }

    try {
        const { data } = await supabase.auth.signUp({
            email, password,
            options: { data: { fullname } }
        });

        return {
            success: true,
            message: "Registration successful!\nCheck your email for confirmation!"
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error signing up";

        return {
            success: false,
            message: errorMessage
        }
    }
}