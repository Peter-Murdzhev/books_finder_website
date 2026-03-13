"use client"
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { shuffleArray } from "@/utils/fisher_yates_shuffle";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/assets/supabase-client";
import { findUserFavouriteBooks } from "@/actions/books-actions";
import { fetchAuthors } from "@/actions/author-actions";

type Book = {
  id: string,
  title: string,
  author: string,
  cover: any
}

const Homepage = ({ books }: { books: Book[] }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isShuffled, setShuffled] = useState(() => {
    if (typeof window === "undefined") return false
    return sessionStorage.getItem("shuffled") === "true"
  })

  const [favouritesFetched, setFavouritesFetched] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("favourites_fetched") === "true" || false
  });

  useEffect(() => {
    if (isShuffled) {
      return;
    }
    const shuffled = shuffleArray(books);

    sessionStorage.setItem("best_seller_books", JSON.stringify(shuffled));
    setShuffled(true);
    sessionStorage.setItem("shuffled", "true");
  }, [books]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (favouritesFetched) {
      return;
    }

    queryClient.prefetchQuery({
      queryKey: ["favourites", user?.id, 1],
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

            const start = 0;
            const favIds = ids.slice(start, start + 10);

            const response = await findUserFavouriteBooks(favIds);
            const authorsData = await fetchAuthors(response);

            return response.map(book => ({
                ...book,
                authorName: authorsData[book.authors?.[0]?.author?.key] ?? "Unknown"
            }))
        },
      gcTime: 1000 * 60 * 60 * 12,
    });

    setFavouritesFetched(true);
    sessionStorage.setItem("favourites_fetched", "true");
  }, [user]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-2 mb-10">
      {books.map((book, index) => <BookCard key={index} book={book} />)}
    </section>
  )
}

export default Homepage;