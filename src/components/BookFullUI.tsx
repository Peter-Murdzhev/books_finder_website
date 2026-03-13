"use client"
import { useRouter } from "next/navigation";
import { MdFavorite } from 'react-icons/md';
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/assets/supabase-client";
import { useAuth } from "@/context/AuthContext";
import { popularGenres } from "@/utils/popular_book_genres"
import { extractMatchingGenres } from "@/utils/extractGenres";
import { QueryClient } from "@tanstack/react-query";

type Author = {
    key: string,
    name: string
}

type Subject = string | { type: string; value: string };

const BookFullUI = ({ book, author, cover }: { book: any, author: Author, cover: string }) => {
    const description = typeof book?.description === "string" ?
        book?.description : book?.description?.value ?? "No description available";
    const [favourite, setFavourite] = useState(false);
    const [favouriteIds, setFavouriteIds] = useState<string[]>([])
    const router = useRouter();
    const { user } = useAuth();
    //prevents bugs on miltiple button clocks
    const isClicked = useRef(false);

    //assign one genre point for browsing a book
    useEffect(() => {
        if (!user) {
            return;
        }

        const updateUserGenrePreferences = async () => {
            if (!book?.subjects) {
                return;
            }

            const genres = extractMatchingGenres(book?.subjects?.flat(), popularGenres)

            for (const genre of genres) {
                await supabase.rpc("increment_genre_score", {
                    p_user_id: user.id,
                    p_genre: genre,
                    p_score: 1
                })
            }
        }

        updateUserGenrePreferences();
    })

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const checkFavourite = async () => {
            const { data } = await supabase
                .from("users")
                .select("favourite_books_ids")
                .eq("id", user?.id)
                .single();

            setFavouriteIds(data?.favourite_books_ids);

            if (data?.favourite_books_ids.includes(book.key)) {
                setFavourite(true);
            }
        }

        checkFavourite();
    }, [user?.id])

    const toggleFavourite = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (isClicked.current) {
            return;
        }

        isClicked.current = true;

        if (favourite) {
            const updatedIds = favouriteIds.filter(id => id !== book.key)
            setFavouriteIds(updatedIds);

            const { error } = await supabase
                .from("users")
                .update({ favourite_books_ids: updatedIds })
                .eq("id", user?.id)

            if (!error) {
                setFavourite(false);
                
            } else {
                setFavouriteIds((prev) => [...prev, book.key]);
            }
        } else {
            const updatedIds = [...(favouriteIds ?? []), book.key]
            setFavouriteIds(updatedIds);

            const { error } = await supabase
                .from("users")
                .update({ favourite_books_ids: updatedIds })
                .eq("id", user?.id)

            if (!error) {
                setFavourite(true);

                //assign 4 genre points for favourite book
                const updateUserGenrePreferences = async () => {
                    if (!book?.subjects) {
                        return;
                    }

                    const genres = extractMatchingGenres(book?.subjects?.flat(), popularGenres)

                    for (const genre of genres) {
                        await supabase.rpc("increment_genre_score", {
                            p_user_id: user.id,
                            p_genre: genre,
                            p_score: 4
                        })
                    }
                }

                updateUserGenrePreferences()
            } else {
                setFavouriteIds(prev => prev.filter(id => id !== book.key));
            }
        }

        isClicked.current = false;
    }

    return (
        <div className="min-h-screen md:w-[90%] mx-auto p-10 m-2">
            <div className="flex flex-col md:flex-row gap-15 pb-7 border-b-3 border-cyan-700">
                <section className="flex flex-col items-center gap-5 mt-3 pb-10 border-b-3 md:pb-0 md:border-b-0 md:px-6 md:py-2 md:pr-15 md:border-r border-cyan-700">
                    <img className="w-full h-[350px] md:w-[300px] md:h-[400px]"
                        src={cover}></img>

                    <div className="flex gap-1 items-center bg-cyan-400 px-3 py-3 rounded-lg cursor-pointer"
                        onClick={toggleFavourite}>
                        <MdFavorite className={favourite ? "text-xl text-red-500" : "text-xl text-white"} />
                        <p className={favourite ? "text-l text-red-500" : "text-l text-white"}>Favourite</p>
                    </div>
                </section>

                <section className="md:w-[60%] flex flex-col gap-5 md:mt-2">
                    <p className="text-2xl md:text-3xl font-semibold">{book.title}</p>
                    <p className="md:ml-5">by <span
                        className="underline text-[14px] md:text-[16px] text-blue-600 cursor-pointer"
                        onClick={() => router.push(`/authors/${encodeURIComponent(author?.key)}`)}>{author?.name}</span>
                    </p>
                    <p className="text-[14px] md:text-[16px]">{description}</p>
                </section>
            </div>

            <section>
                {book.subjects &&
                    <div className="flex flex-wrap text-[13px] md:text-[15px] p-4 mt-5 border border-cyan-700 justify-center items-center rounded-lg">
                        <p className="text-cyan-500 text-l">Subjects:</p>
                        {book.subjects?.slice(0, 10).map((subject: Subject, index: number) => (
                            <p className="after:content-[','] last:after:content-[''] whitespace-wrap p-[2px]"
                                key={index}>{getSubjectName(subject)}</p>)
                        )}
                    </div>
                }

                {book.subject_people &&
                    <div className="flex flex-wrap text-[13px] md:text-[15px] p-4 mt-5 border border-cyan-700 justify-center items-center rounded-lg">
                        <p className="text-cyan-500 text-l">Heroes:</p>
                        {book.subject_people?.slice(0, 10).map((person: string, index: number) => (
                            <p className="after:content-[','] last:after:content-[''] whitespace-wrap p-[2px]"
                                key={index}>{person}</p>)
                        )}
                    </div>
                }

                {book.subject_places &&
                    <div className="flex flex-wrap text-[13px] md:text-[15px] p-4 mt-5 border border-cyan-700 justify-center items-center rounded-lg">
                        <p className="text-cyan-500 text-l">Places:</p>
                        {book.subject_places?.slice(0, 10).map((place: string, index: number) => (
                            <p className="after:content-[','] last:after:content-[''] whitespace-wrap p-[2px]"
                                key={index}>{place}</p>)
                        )}
                    </div>
                }

                {book.subject_times &&
                    <div className="flex flex-wrap text-[13px] md:text-[15px] p-4 mt-5 border border-cyan-700 justify-center items-center rounded-lg">
                        <p className="text-cyan-500 text-l">Times:</p>
                        {book.subject_times?.slice(0, 10).map((time: string, index: number) => (
                            <p className="after:content-[','] last:after:content-[''] whitespace-wrap p-[2px]"
                                key={index}>{time}</p>)
                        )}
                    </div>
                }
            </section>
        </div>
    )
}

function getSubjectName(subject: Subject) {
    return typeof subject === "string" ? subject : subject.value;
}

export default BookFullUI;