"use client"
import { useRouter } from "next/navigation";

type Book = {
  id: string,
  title: string,
  author: string,
  cover: string
}

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  return (
    <div className="flex gap-4 bg-[url('/blank_book.jpg')] bg-cover bg-center w-[310px] md:w-[340px] h-[232px] mb-5 md:mr-3 md:overflow-hidden">
      <img src={book.cover} className="mt-1 ml-1 w-[150px] md:w-[165px] h-[225px] object-cover"></img>

      <div className="flex flex-col items-center justify-around text-center p-6">
        <p className="font-semibold text-[12px] md:text-[14px]  overflow-hidden text-ellipsis whitespace-wrap">{book?.title?.length < 50 ? book?.title : book?.title?.slice(0,50).concat("...")}</p>
        <p className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-wrap"> {typeof book?.author === "string" ? book?.author : book?.author?.[0]}</p>
        <button className="bg-cyan-400 text-white text-[12px] md:text-[16px] px-1 py-2 rounded hover:bg-cyan-700 transition cursor-pointer"
        onClick={()=> router.push(`/books/${encodeURIComponent(book.id)}`)}>
          See more</button>
      </div>
    </div>
  )
}

export default BookCard;