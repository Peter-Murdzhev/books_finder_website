"use client"
import Link from "next/link"
import { supabase } from "@/assets/supabase-client";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";

const page = () => {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if(!email || !password){
      setError("Enter username and password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password, });

    if (error && error instanceof Error) {
        setError("Email or password incorrect");
    } 
  }

  useEffect(() => {
    if (!loading && session) {
      router.replace("/account")
    }
  }, [loading, session])

  //this prevents showing login page on refresh when the user is logged in
  if(session){
    return null;
  }

  return (
    <div className="flex justify-center items-start mt-25 mb-10 min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col items-center gap-7 w-[280px] md:w-[320px] bg-cyan-700 p-10 rounded-lg shadow-md">
        <label className="text-3xl text-white text-center">Login</label>
        <input className="w-[240px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
          name="email" type="email" placeholder="Enter email"></input>
        <input className="w-[240px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
          name="password" type="password" placeholder="Enter password"></input>
        <Link className="text-white text-[14px] md:text-[16px] text-center underline text-ellipsis" href={"/register"}>Don't have an account? Click here to register!</Link>
        {error && <p className="text-amber-300">{error}</p>}
        <button className="bg-cyan-400 px-4 py-2 md:px-7 text-white cursor-pointer">Login</button>
      </form>
    </div>
  )
}

export default page;