"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import FavouriteBooksBrowserUI from "./FavouriteBooksBrowserUI";
import RecommendedBooksUI from "./RecommendedBooksUI";
import AccountSettings from "./AccountSettings";


const AccountPageUI = () => {
  const { user, logout, loading } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromURL = searchParams.get("tab");
  const [selectedTab, setSelectedTab] = useState(tabFromURL ?? "recommended");
 
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else {
      setCheckingAuth(false)
    }
  }, [user, router, loading])

  useEffect(()=>{
    if(user && !tabFromURL){
      router.replace("?tab=recommended", { scroll: false });
    }
  },[tabFromURL, router])

  useEffect(()=>{
    if(tabFromURL && tabFromURL !== selectedTab){
      setSelectedTab(tabFromURL);
    }
  },[tabFromURL])

  const selectTab = (tab: string)=>{
    setSelectedTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  }

  if (checkingAuth) {
    return <div className="min-h-screen"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:h-screen md:w-[16%] bg-cyan-700 mt-1 rounded">
        <ul className="text-white flex flex-row md:flex-col gap-7 items-center md:mt-5 p-2">
          <li className={selectedTab === "recommended" ? "bg-cyan-400 text-[10px] md:text-[16px] px-1 py-1 md:px-6 md:py-2 rounded cursor-pointer" :
            "text-[10px] md:text-[16px] cursor-pointer"} onClick={() => { selectTab("recommended") }}>
            Recommended books</li>
          <li className={selectedTab === "favourites" ? "bg-cyan-400 text-[10px] md:text-[16px] px-1 py-1 md:px-6 md:py-2 rounded cursor-pointer" :
            "text-[10px] md:text-[16px] cursor-pointer"} onClick={() => { selectTab("favourites") }}>
            Favourite books</li>
          <li className={selectedTab === "settings" ? "bg-cyan-400 text-[10px] md:text-[16px] px-1 py-1 md:px-6 md:py-2 rounded cursor-pointer" :
            "text-[10px] md:text-[16px] cursor-pointer"} onClick={() => { selectTab("settings") }}>
            Account settings</li>
          <li className="text-[10px] md:text-[16px] cursor-pointer" onClick={() => logout()}>
            Logout</li>
        </ul>
      </aside>

      {
        selectedTab === "recommended" && <RecommendedBooksUI /> ||
        selectedTab === "favourites" && <FavouriteBooksBrowserUI /> ||
        selectedTab === "settings" && <AccountSettings />
      }

    </div>
  )
}

export default AccountPageUI