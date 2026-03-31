import { fetchBestSellerBooks } from "@/actions/best-seller-actions"
import Homepage from "@/components/Homepage";

type Book = {
  id: string,
  title: string,
  author:string,
  cover: any
}

export default async function Home() {
  const bestSellerBooks = await fetchBestSellerBooks();
  const filteredBooks = (bestSellerBooks as Book[])
  .filter((book: Book) => book.cover?.medium);

  const books = filteredBooks.map(mapBookToCard);

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center">
      <section className="max-w-7xl mx-auto  flex items-center justify-center gap-2 pt-2">
        <img src="/left_book.jpg" className="hidden md:block w-[240px] h-[180px] rounded"></img>

        <div className="relative">
          <img src="/various_books.jpg" className="w-[640px] h-[140px] md:h-[180px] rounded"></img>
          <h1 className="absolute z-10 top-5 left-16 md:left-42 text-2xl md:text-4xl text-white filter drop-shadow-[0_0_10px_rgba(138,43,226,1)] cursor-default">
            Find any book here</h1>
        </div>

        <img src="/right_book.jpg" className="hidden md:block w-[240px] h-[180px] rounded"></img>
      </section>

      <h1 className="text-2xl md:text-4xl text-cyan-700 underline cursor-default">Most recent bestsellers</h1>

      <Homepage books={books}/>
    </div>
  );
}

function mapBookToCard(book: any) {
  return {
    id: book.key ?? "",
    title: book.title,
    author: book.authors?.[0]?.name ?? "Unknown",
    cover: book.cover?.medium
  };
}
