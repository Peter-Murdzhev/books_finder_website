"use client"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import BookCard from "./BookCard"
import { supabase } from "@/assets/supabase-client"
import { findUserRecommendedBooks } from "@/actions/books-actions";
import Spinner from "./Spinner";

type UserPreferredGenre = {
    genre_name: string;
    score: number;
};

const RecommendedBooksUI = () => {
    const { user } = useAuth();
    const [recommendedGenre, setRecommendedGenre] =
        useState<string>(sessionStorage.getItem("recommended_genre") ?? "");
    //query key is for cache
    //enabled is a condition when to trigger the useQuery
    const { data, error, isLoading } = useQuery({
        queryKey: ["recommendedBooks", user?.id, recommendedGenre ?? "pending"],
        queryFn: () => findUserRecommendedBooks(recommendedGenre),
        enabled: !!recommendedGenre,
        gcTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (recommendedGenre.length > 0) {
            return;
        }

        const fetchBestCategory = async () => {
            const { data, error } = await supabase
                .from("user_preferred_genres")
                .select("genre_name, score")
                .eq("user_id", user?.id)
                .order("score", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.log(error);
            } else {
                if (data) {
                    const genre = (data as UserPreferredGenre)?.genre_name;
                    setRecommendedGenre(genre);
                    sessionStorage.setItem("recommended_genre", genre);
                } else {
                    setLoadingData(false);
                }
            }
        }

        fetchBestCategory()
    }, [])

    const mappedBooks = data?.map(mapBookToCard) ?? [];

    return (
        <div className="relative min-h-100 mx-auto">
            <h1 className="text-2xl md:text-3xl text-cyan-700 text-center underline my-10">Recommended books</h1>
            {isLoading && <Spinner className="absolute" size={50} thickness={3} color="#0e7490" />}

            <section className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-2 mb-10 mt-5">
                {
                    mappedBooks.length > 0 ?
                        mappedBooks.map(book => <BookCard key={book.id} book={book} />) :
                        (!loadingData &&
                            <h1 className="text-xl text-cyan-700 col-[1/-1] mt-20 text-center"><span>You don't have recommended books yet.</span>
                                <br /> <br />Browse some books for the system to trigger and start recommending books.</h1>
                        )
                }
            </section>
        </div>
    )
}

export default RecommendedBooksUI;

function mapBookToCard(book: any) {
    return {
        id: book.key ?? book.identifiers?.openlibrary?.[0] ?? "",
        title: book.title,
        author: book?.authors[0]?.name ?? "Unknown",
        cover: `https://covers.openlibrary.org/w/id/${book.cover_id}-M.jpg`
    };
}