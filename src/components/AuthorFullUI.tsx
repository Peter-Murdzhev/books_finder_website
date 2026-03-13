"use client"
import { useState, useEffect } from "react";
import BookCard from "./BookCard";

type Book = {
  key: string,
  title: string,
  author: string,
  covers: []
}

const AuthorFullUI = ({ author }: { author: any }) => {
  const [books, setBooks] = useState<Book[]>([]);

  const description = typeof author?.bio === "string" ?
    author.bio : author.bio?.value;

  useEffect(() => {
    const fetchBooks = async () => {
      const request = await fetch(`https://openlibrary.org${author.key}/works.json`);
      const response = await request.json() as { entries: Book[] };

      if (response) {
        const filteredBooks = response.entries.filter(book => book.covers?.length > 0);
        setBooks(filteredBooks.slice(0, 50));
      }
    }

    fetchBooks();
  }, [])

  function mapBookToCard(book: any) {
    return {
      id: book.key ?? book.identifiers?.openlibrary?.[0] ?? "",
      title: book.title,
      author: author.name ?? "Unknown",
      cover: `https://covers.openlibrary.org/w/id/${book.covers?.[0]}-M.jpg`
    };
  }

  const bookCards = books.length > 0 ? books.map(mapBookToCard) : [];

  return (
    <div className="min-h-screen w-[100%] mx-auto p-10 m-2">
      <div className="flex flex-col md:flex-row gap-15 pb-7 border-b-3 border-cyan-700">

        <section className="mt-3 pb-10 border-b-2 md:pb-0 md:border-b-0 md:pr-15 md:border-r border-cyan-700">
          <img className="w-[350px] h-[320px] md:w-[300px] md:h-[350px]"
            src={`https://covers.openlibrary.org/a/id/${author.photos?.[0]}-L.jpg`}></img>

        </section>

        <section className="w-[100%] md:w-[60%] flex flex-col gap-5 md:mt-2">
          <p className="text-2xl md:text-3xl font-semibold">{author.name}</p>
          <p className="text-[14px] md:text-[16px]">{description}</p>
          {author.birth_date && <p className="text-[14px] md:text-[16px]">Birth date: {author.birth_date}</p>}
          {author.death_date && <p className="text-[14px] md:text-[16px]">Death date: {author.death_date}</p>}
        </section>
      </div>

      <div className="flex flex-col justify-center items center gap-3">
        <h1 className="text-semibold text-center text-2xl text-cyan-500 underline mt-10">Author's books</h1>

        <section className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-2 mb-10 mt-10">
          {
            bookCards.map((book, index) => <BookCard key={index} book={book} />)
          }
        </section>
      </div>
    </div>
  )
}

export default AuthorFullUI