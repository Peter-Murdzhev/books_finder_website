"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/assets/supabase-client";
import { useAuth } from "@/context/AuthContext";

const AccountSettings = () => {
  const [option, setOption] = useState("change_name");
  const { user } = useAuth();

  const [currentName, setCurrentName] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFullname = async () => {
      const { data } = await supabase.auth.getUser()

      setCurrentName(data.user?.user_metadata?.fullname);
    }
    fetchFullname();
  }, []);

  const changeFullname = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullname && fullname.length < 6) {
      setMessage("Fullname must be at least 6 letters!")
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: { fullname }
    });

    const { error: userError } = await supabase.from("users")
      .update({ fullname })
      .eq("id", user?.id);

    if (authError) {
      setMessage(authError.message);
      return;
    } else if (userError) {
      setMessage(userError.message);
      return;
    }

    setMessage("Fullname changed successfully!")
    setFullname("");
  };

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters!");
      return;
    }

    if (password !== repeatPassword) {
      setMessage("Both passwords don't match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if(error){
      setMessage(error.message);
    }

    setMessage("Your password is updated sucessfully!")
    setPassword("");
    setRepeatPassword("");
  };

  const deleteGenreStatistics = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    const confirmed = window.
    confirm("Are you sure you want to delete the genres statistics for your account?");

    if(confirmed){
      if(!user?.id){
        return;
      }

      await supabase.from("user_preferred_genres")
      .delete()
      .eq("user_id", user?.id);

      setMessage("Your data is deleted successfully!")
    }
  }

  const preferredGenre = sessionStorage.getItem("recommended_genre");

  return (
    <div className="min-h-100 w-[100%] md:w-[40%] mx-auto">
      <h1 className="text-2xl md:text-3xl text-cyan-700 text-center underline my-10">Settings</h1>
      <section className="h-[300px] md:h-[70%] bg-cyan-700 mb-15 md:mb-0 rounded">
        <nav>
          <ul className="h-15 flex gap-1 md:gap-2 justify-center items-center text-white ">
            <li className={`px-0 md:px-2 py-1 border text-[12px] md:text-[16px] border-cyan-400 cursor-pointer rounded ${option === "change_name" ? "bg-cyan-400" : ""}`}
              onClick={() => { setOption("change_name"); setMessage("") }}>
              Change name</li>
            <li className={`px-0 md:px-2 py-1 border text-[12px] md:text-[16px] border-cyan-400 cursor-pointer rounded ${option === "change_password" ? "bg-cyan-400" : ""}`}
              onClick={() => { setOption("change_password"); setMessage("") }}>
              Change password</li>
            <li className={`px-0 md:px-2 py-1 border text-[12px] md:text-[16px] border-cyan-400 cursor-pointer rounded ${option === "recommendations" ? "bg-cyan-400" : ""}`}
              onClick={() => { setOption("recommendations"); setMessage("") }}>
              Recommendations</li>
          </ul>
        </nav>

        {
          option === "change_name" &&
          <form className="flex flex-col gap-5 justify-center items-center mt-12 md:mt-18"
            onSubmit={changeFullname}>
            <label className="text-white text-[14px] md:text-[16px]">Your current fullname: {currentName}</label>
            <input className="w-[240px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
              type="text" name="change_name" value={fullname} placeholder="Input your fullname"
              onChange={e => setFullname(e.target.value)}></input>

            {message && <p className="text-amber-300">{message}</p>}
            <button className="bg-cyan-400 px-2 py-1 md:px-7 md:py-2 text-white text-[15px] md:text-[16px] cursor-pointer">
              Change fullname</button>
          </form> ||

          option === "change_password" &&
          <form className="flex flex-col gap-5 justify-center items-center mt-10 md:mt-18"
          onSubmit={changePassword}>
            <input className="w-[240px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
              type="password" name="password" value={password} placeholder="Input your new password"
              onChange={e => setPassword(e.target.value)}></input>

            <input className="w-[240px] h-[35px] md:h-[50px] border-2 text-white placeholder-white border-cyan-400"
              type="password" name="repeat_password" value={repeatPassword}
              placeholder="Repeat your new password"
              onChange={e => setRepeatPassword(e.target.value)}></input>

            {message && <p className="text-amber-300">{message}</p>}
            <button className="bg-cyan-400 px-2 py-1 md:px-7 md:py-2 text-white text-[15px] md:text-[16px] cursor-pointer">
              Change Password</button>
          </form> ||

          option === "recommendations" &&
          <form className="flex flex-col gap-5 justify-center items-center mt-14 md:mt-18"
          onSubmit={deleteGenreStatistics}>
            <label className="text-white">{preferredGenre ? `Recommended genre: ${preferredGenre}` :
              "You don't have recommended genres."}</label>

            {message && <p className="text-white">{message}</p>}
            <button className="bg-red-700 px-7 py-2 text-white text-[15px] md:text-[16px] cursor-pointer"
            disabled={!preferredGenre}>Reset your statistics</button>
          </form>
        }

      </section>
    </div>
  )
}

export default AccountSettings