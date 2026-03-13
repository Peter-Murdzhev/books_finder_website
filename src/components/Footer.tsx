"use client"
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  return (
    <div className="bg-cyan-700 text-white h-17 flex mt-1 mb-1 rounded">
      <ul className="flex gap-10 items-center">
        <li className="ml-12 cursor-pointer"
          onClick={() => { router.push("/about_me") }}>About me</li>
      </ul>
    </div>
  )
}

export default Footer;
