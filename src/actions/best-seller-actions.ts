"use server"

export const fetchBestSellerBooks = async () => {
    const responseBestsellers = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.NYT_BESTSELLERS_API}`,{
        //cache for 1 day
        next: {
            revalidate: 86400,
            tags:["bestsellers_nyt"]
        }
    });

    const bestSellersData = await responseBestsellers.json();
    const bestSelllers = [
        ...(bestSellersData?.results?.lists[0]?.books?.slice(0,21) ?? []),
        ...(bestSellersData?.results?.lists[1]?.books?.slice(0,21) ?? []),
        ...(bestSellersData?.results?.lists[2]?.books?.slice(0,21) ?? []),
        ...(bestSellersData?.results?.lists[3]?.books?.slice(0,21) ?? []),
        ...(bestSellersData?.results?.lists[4]?.books?.slice(0,21) ?? []),
        ...(bestSellersData?.results?.lists[5]?.books?.slice(0,21) ?? []),
    ] as { primary_isbn13: string }[];

    const bestSellerISBNs = bestSelllers.map(best => best.primary_isbn13);

    const bibkeys = bestSellerISBNs.map(isbn => `ISBN:${isbn}`).join(",");

    const responseBooks = await fetch(`https://openlibrary.org/api/books?bibkeys=${bibkeys}&format=json&jscmd=data`,{
        //cache for 1 day
        next: {
            revalidate: 86400,
            tags:["bestsellers"]
        }
    });
    const booksData = await responseBooks.json();
    const books = Object.values(booksData);
    
    return books;
}
