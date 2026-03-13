"use server"

export const findAuthorsByName = async (prevState: any, formData: FormData) => {
    try {
        const name = formData.get("name") as string;

        const queryForName = await fetch(`https://openlibrary.org/search.json?author=${name}`);
        const responseForName = await queryForName.json();

        const authorId = responseForName.docs[0].author_key;
        const authorQuery = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
        const data = await authorQuery.json();

        return {
            success: true,
            message: "author fetched",
            author: data
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ?
                error.message : "Error fetching  author",
            author: null
        }
    }

}

export const findAuthorById = async (id: string) => {
    try {
        const response = await fetch(`https://openlibrary.org/${id}.json`);
        const data = await response.json();

        return data;
    } catch (error) {
        error instanceof Error ? console.log(error.message) : console.log("error fetching author")
    }
}

//optimised way if several books have the same author he's fetched just once
export const fetchAuthors = async (books: any[]) => {
    const authorKeys = new Set<string>();

    books.forEach(work => {
        if (work?.authors?.[0]?.author?.key) {
            authorKeys.add(work.authors[0].author.key);
        }
    });

    const authors = await Promise.all(
        Array.from(authorKeys).map(async (key) => {
            const response = await fetch(
                `https://openlibrary.org${key}.json`
            );
            return response.json();
        })
    );

    const authorMap = Object.fromEntries(
        authors.map(author => [author.key, author.name])
    );

    return authorMap;
}

// export const fetchAuthors = async (books: any[]) => {
//     const authorIds = books.map(book => (book?.authors?.[0]?.author?.key));

//     const authors = await Promise.all(
//         authorIds.map(async (id: string) => {
//             const response = await fetch(`https://openlibrary.org/${id}.json`);
//             const data = await response.json();
//             return data;
//         })
//     )

//     return authors;
// }