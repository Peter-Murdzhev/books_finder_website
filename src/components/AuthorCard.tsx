"use client"
import { useRouter } from "next/navigation"

type Author = {
    key: string,
    name: string,
    photos: string[]
}

const AuthorCard = ({ author }: { author: Author }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-start items-center gap-4 bg-cyan-700 rounded w-70 h-97 ">
            <img className="w-55 h-62 mt-3" 
            src={author?.photos ? `https://covers.openlibrary.org/a/id/${author?.photos?.[0]}-M.jpg` :
             "/author_sitting_on_books.jpg"}></img>
            <p className="text-semibold text-2xl text-white">{author?.name}</p>
            <button className="bg-cyan-400 text-white px-1 py-2 rounded hover:bg-cyan-600
             transition cursor-pointer"
                onClick={() => router.push(`/authors/${encodeURIComponent(author?.key)}`)}
            >See more</button>
        </div>
    )
}

export default AuthorCard;