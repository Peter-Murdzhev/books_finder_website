"use server"

import { shuffleArray } from "@/utils/fisher_yates_shuffle";

export const findBooksByTitle = async (prevState: any, formData: FormData) => {
    try {
        const title = formData.get("search_books") as string;

        const response = await fetch(`https://openlibrary.org/search.json?title=${title}`);
        const data = await response.json();
        const filteredBooks = (data.docs as any[]).
            filter((book: any) => book.cover_edition_key);

        return {
            success: true,
            message: "data fetched",
            books: (filteredBooks.slice(0, 30) ?? [])
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error fetching books",
            books: []
        }
    }
}

export const findBookById = async (id: string) => {
    try {
        const response = await fetch(`https://openlibrary.org/${id}.json`);
        const data = await response.json();

        return data;
    } catch (error) {
        error instanceof Error ? console.log(error.message) : console.log("error fetching book");
    }
}

export const findUserFavouriteBooks = async (bookIds: string[]) => {
    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
        return [];
    }

    const books = await Promise.all(bookIds
        .map(async (id: string) => {
            const response = await fetch(`https://openlibrary.org/${id}.json`);
            const data = await response.json();
            return data;
        }));

    return books;
}

export const findUserRecommendedBooks = async (category: string)=> {
    if (!category) {
        console.log("category missing")
        return;
    }

    const response = await fetch(`https://openlibrary.org/subjects/${category}.json?limit=200`)
    const data = await response.json();

    const filteredBooks = data?.works?.filter((book : any) => book.cover_id);

    const shuffledBooks = shuffleArray(filteredBooks);

    return shuffledBooks.slice(0, 30);
}
