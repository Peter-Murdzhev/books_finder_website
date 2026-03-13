"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/assets/supabase-client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
    session: Session | null;
    user: User | null;
    logout: () => Promise<void>;
    loading: boolean
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    logout: async () => { },
    loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setLoading(false);
            });


        return () => listener.subscription.unsubscribe();
    }, [])

    const logout = async () => {
        await supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}