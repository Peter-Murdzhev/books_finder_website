"use client"
import { findAuthorsByName } from "@/actions/author-actions";
import { useActionState, useState, useEffect } from "react";
import AuthorCard from "./AuthorCard";

type Author = {
    key: string,
    name: string,
    photos: string[]
}

const SearchAuthorsPage = () => {
    const [state, formAction] = useActionState(findAuthorsByName, {
        success: false,
        message: "",
        author: null
    });
    const [searchValue, setSearchValue] = useState("");
    const [authorData, setAuthorData] = useState(null);

    useEffect(() => {
        const query = sessionStorage.getItem("author_query");
        const savedAuthor = sessionStorage.getItem("author");
        if (query) {
            setSearchValue(query);
        }

        if (savedAuthor) {
            setAuthorData(JSON.parse(savedAuthor));
        }
    }, [])

    useEffect(() => {
        if (state.success && state.author) {
            sessionStorage.setItem("author", JSON.stringify(state.author));
        }
    }, [state.success, state.author])

     useEffect(() => {
        sessionStorage.setItem("author_query", searchValue);
    }, [searchValue])

    const authorCard = authorData && !state.success ?
        authorData as Author :
        state.author as Author;
   
    return (
        <div className="min-h-100 mt-5">
            <form action={formAction} className="flex justify-center gap-2">
                <input className="w-[200px] md:w-[350px] h-10 border-3 border-cyan-700 placeholder-cyan-700" name="name"
                    type="text" placeholder="Enter exact author name" value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} required></input>
                <button className="text-[14px] md:text-[16px] px-3 md:px-5 py-2 bg-cyan-400 cursor-pointerr">Search</button>
            </form>

            <section className="flex justify-center items-centergap-2 mb-10 mt-10">
                {
                    authorCard && <AuthorCard author={authorCard}/>
                }
            </section>
        </div>
    )
}



export default SearchAuthorsPage;