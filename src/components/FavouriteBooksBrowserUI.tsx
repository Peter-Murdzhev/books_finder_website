"use client"
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/assets/supabase-client";
import { findUserFavouriteBooks } from "@/actions/books-actions";
import BookCard from "./BookCard";
import { fetchAuthors } from "@/actions/author-actions";
import Spinner from "./Spinner";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

//initially it loads slow because the books api doesn't contain authorName
//so I have to fetch books first then the authors one by one
//no endpoint to fetch multiple books of type works at once
const FavouriteBooksBrowserUI = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(()=>{
        const temp = sessionStorage.getItem("page");
        if(temp){
            return Number(temp);
        }

        return 1;
    });
    const [pagesCount, setPagesCount] = useState(1);

    useEffect(()=>{
        sessionStorage.setItem("page", page.toString());
    },[page])

    const { data: books = [], isLoading } = useQuery({
        queryKey: ["favourites", user?.id, page],
        queryFn: async () => {
            if (!user) {
                return [];
            }

            const { data, error } = await supabase
                .from("users")
                .select("favourite_books_ids")
                .eq("id", user?.id);

            if (error) {
                console.log(error);
                return [];
            }

            const ids = data?.[0]?.favourite_books_ids ?? [];
            setPagesCount(Math.ceil(ids?.length / 10));

            const start = (page - 1) * 10;
            const favIds = ids.slice(start, start + 10);

            const response = await findUserFavouriteBooks(favIds);
            const authorsData = await fetchAuthors(response);

            return response.map(book => ({
                ...book,
                authorName: authorsData[book.authors?.[0]?.author?.key],
            }))
        },
        enabled: !!user,
        placeholderData: keepPreviousData,
        gcTime: 1000 * 60 * 60 * 12,
        // refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const mappedBooks = books.map(mapBookToCard) ?? [];

    return (
        <div className="relative min-h-100 mx-auto flex flex-col">
            <h1 className="text-2xl md:text-3xl text-cyan-700 text-center underline my-10">Favourites</h1>
            {books.length === 0 && isLoading && <Spinner className="absolute" size={50} thickness={3} color="#0e7490" />}

            <section className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-2 mt-5">
                {
                    mappedBooks.length > 0 ?
                        mappedBooks.map((book, index) => <BookCard key={index} book={book} />) :
                        (!isLoading &&
                            <h1 className="text-xl text-cyan-700 col-[1/-1] mt-20">You don't have favourite books yet.</h1>
                        )
                }
            </section>

            {books.length !== 0 && pagesCount > 1 &&
                <div className="flex gap-2 self-center mt-7 mb-10">
                    {Array.from({ length: pagesCount }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setPage(index + 1)}
                            className={`px-3 py-1 border rounded cursor-pointer ${page === index + 1 ? "bg-cyan-700 text-white" : ""
                                }`}
                        >{index + 1}
                        </button>
                    ))
                    }
                </div>
            }
        </div >
    )
}

export default FavouriteBooksBrowserUI;

function mapBookToCard(book: any) {
    return {
        id: book?.key ?? book.identifiers?.openlibrary?.[0] ?? "",
        title: book?.title,
        author: book?.authorName,
        cover: `https://covers.openlibrary.org/w/id/${book?.covers?.[0]}-M.jpg`
    };
}