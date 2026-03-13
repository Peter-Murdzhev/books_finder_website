"use client"
import { findBooksByTitle } from "@/actions/books-actions"
import { useActionState, useState, useEffect } from "react"
import BookCard from "./BookCard"

type Book = {
    id: string,
    title: string,
    author: string,
    cover: string
}

const SearchBooksPageUI = () => {
    const [state, formAction] = useActionState(findBooksByTitle, {
        success: false,
        message: "",
        books: []
    });
    const [searchValue, setSearchValue] = useState<string>("");
    const [booksData, setBooksData] = useState<any[]>([]);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const [bestSellerBooks, setBestSellerBooks] = useState<Book[]>([]);

    useEffect(() => {
        const best = sessionStorage.getItem("best_seller_books");

        if (best) {     
            const parsed = JSON.parse(best);
            setBestSellerBooks(parsed);
        }
    }, []);

    useEffect(() => {
        const query = sessionStorage.getItem("books_query");
        const triggered = sessionStorage.getItem("search_triggered") === "true";
        const savedBooks = sessionStorage.getItem("books");

        if (query) {
            setSearchValue(query);
        }

        if (triggered && query) {
            setSearchTriggered(triggered);
        }

        if (savedBooks) {
            setBooksData(JSON.parse(savedBooks));
        }
    }, []);

    useEffect(() => {
        if (state.success && state.books.length > 0) {
            setBooksData(state.books)
            sessionStorage.setItem("books", JSON.stringify(state.books));

            setSearchTriggered(true);
            sessionStorage.setItem("search_triggered", "true");
        } else if (state.success && state.books.length === 0) {
            setBooksData([]);
            sessionStorage.removeItem("books");

            setSearchTriggered(true);
            sessionStorage.setItem("search_triggered", "true");
        }
    }, [state.success, state.books]);

    useEffect(() => {
        sessionStorage.setItem("books_query", searchValue);

        if (searchValue.length === 0 && searchTriggered) {
            setSearchTriggered(false);
            sessionStorage.setItem("search_triggered", "false");
        }
    }, [searchValue]);

    const booksToCards = booksData.map(mapBookToCard) as Book[];

    return (
        <div className="min-h-100 mt-5">
            <form action={formAction} className="flex justify-center gap-2">
                <input className="w-[200px] md:w-[350px] h-10 border-3 border-cyan-700 placeholder-cyan-700" name="search_books"
                    type="text" placeholder="Enter book name" value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} ></input>
                <button className="text-[14px] md:text-[16px] px-3 md:px-5 py-2 bg-cyan-400 cursor-pointer">Search</button>
            </form>

            <section className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-2 mb-10 mt-10">
                {
                    booksToCards.length > 0 ?
                        booksToCards.map(book => <BookCard key={book.id} book={book} />) :
                        searchTriggered ?
                            <p className="col-[1/-1] text-center mt-20">Books not found</p> :
                            bestSellerBooks.slice(0, 9)
                                .map((book: Book) => <BookCard key={book.id} book={book} />)
                }
            </section>
        </div>
    )
}

function mapBookToCard(book: any) {
    return {
        id: book.key ?? book.identifiers?.openlibrary?.[0] ?? "",
        title: book.title,
        author: book.author_name ?? "Unknown",
        cover: `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
    };
}


export default SearchBooksPageUI;