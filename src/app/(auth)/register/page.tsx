"use client"
import { registerUser } from "@/actions/auth-actions";
import { useActionState, useState } from "react";

const page = () => {
  const [state, formAction] = useActionState(registerUser,{
    success: false,
    message: ""
  })
  const[fullname, setFullname] = useState("");
  const[email, setEmail] = useState("");

  return (
    <div className="flex justify-center items-start mt-25 mb-10 min-h-screen">
        <form action={formAction} className="flex flex-col items-center gap-7 w-[350px] bg-cyan-700 p-10 rounded-lg shadow-md">
            <label className="text-3xl text-white text-center">Register form</label>
            <input className="w-[220px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
             name="fullname" type="text" value={fullname} onChange={e=> setFullname(e.target.value)}
              placeholder="Enter your fullname"></input>

            <input className="w-[220px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
             name="email" type="email" value={email} onChange={e=> setEmail(e.target.value)}
              placeholder="Enter email"></input>
              
            <input className="w-[220px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
             name="password" type="password" placeholder="Enter password"></input>
             <input className="w-[220px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
             name="repeatPassword" type="password" placeholder="Repeat password"></input>
             {state?.message && <p className="text-m text-amber-300 whitespace-pre-line text-ellipsis">
              {state.message}</p>}
            
            <button className="bg-cyan-400 px-4 py-2 md:px-7 text-white cursor-pointer">Register</button>
        </form>
    </div>
  )
}

export default page;