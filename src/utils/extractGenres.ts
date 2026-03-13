
export const extractMatchingGenres = (bookSubjects: string[], genres: string[]) => {
    const bookGenres = bookSubjects?.map((sub: string) => sub.toLowerCase());
    const lowerCaseGenres = genres.map(genre => genre.toLowerCase());

    const matched = lowerCaseGenres.filter(genre =>
        bookGenres.some(subject => subject.includes(genre))
    )

    return matched.slice(0, 2);
}