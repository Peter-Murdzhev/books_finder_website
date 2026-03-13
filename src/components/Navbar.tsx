"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
   const pathname = usePathname();
   const [selectedTab, setSelectedTab] = useState("");
   const router = useRouter();

   useEffect(() => {
      const tab = sessionStorage.getItem("navbar_tab");
      if (tab) {
         setSelectedTab(tab);
      } else {
         setSelectedTab("home")
      }
   }, [])

   useEffect(() => {
      if (pathname.startsWith("/books")) {
         setSelectedTab("books");
      } else if (pathname.startsWith("/authors")) {
         setSelectedTab("authors");
      } else if (pathname.startsWith("/login") || pathname.startsWith("/account")) {
         setSelectedTab("user");
      } else {
         setSelectedTab("home");
      }

      sessionStorage.setItem("navbar_tab", selectedTab);
   }, [pathname])


   useEffect(() => {
      sessionStorage.setItem("navbar_tab", selectedTab)
   }, [selectedTab])

   return (
      <div className="items-center bg-cyan-700 text-white h-17 flex mt-1 rounded">
         <img src={"/opened-book.png"} alt="book"
            className="w-[55px] h-[30px] md:w-[150px] md:h-[60px] mr-2 md:mr-20" onClick={() => { router.push("/"); setSelectedTab("home"); }}>
         </img>

         <ul className="flex gap-4 md:gap-10 items-center">
            <li className={selectedTab === "home" ? "text-[12px] md:text-[16px] bg-cyan-400 px-4 py-2 md:px-6 md:py-2 rounded cursor-pointer" :
               "text-[12px] md:text-[16px] cursor-pointer"} onClick={() => { setSelectedTab("home"); router.push("/") }}>Home</li>
            <li className={selectedTab === "books" ? "text-[12px] md:text-[16px] bg-cyan-400 px-4 py-2 md:px-6 md:py-2 rounded cursor-pointer" :
               "text-[12px] md:text-[16px] cursor-pointer"} onClick={() => { setSelectedTab("books"); router.push("/books") }}>Books</li>
            <li className={selectedTab === "authors" ? "text-[12px] md:text-[16px] bg-cyan-400 px-4 py-2 md:px-6 md:py-2 rounded cursor-pointer" :
               "text-[12px] md:text-[16px] cursor-pointer"} onClick={() => { setSelectedTab("authors"); router.push("/authors") }}>Authors</li>
         </ul>

         <FaUserCircle className={`ml-auto self-center text-[24px] md:text-[30px] mr-2 md:mr-5 cursor-pointer ${selectedTab === "user" ? "pb-[3px] border-b-5 border-cyan-400" : ""}`}
            
            onClick={() => { setSelectedTab("user"); router.push("/account") }} />
      </div>
   )
}

export default Navbar;