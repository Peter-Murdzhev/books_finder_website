import { findAuthorById } from "@/actions/author-actions";
import { findBookById } from "@/actions/books-actions";
import BookFullUI from "@/components/BookFullUI";

//Open library books is really inconsistent
//In some cases returns books edition other times work edition.
//The work edition is the one richest in data so if the ID includes books
//then I need to fetch work edition data as in workTypeBook
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const book = await findBookById(decodedId);

  const workId = id.includes("books") ? book.works[0].key : "";
  let workTypeBook = null;

  if (workId.length > 0) {
    workTypeBook = await findBookById(workId);
  }

  const authorId = workTypeBook ?
    workTypeBook?.authors?.[0]?.author?.key :
    book?.authors?.[0]?.author?.key;
  const author = await findAuthorById(authorId);

  //sometimes book API has cover and work API doesn't
  //so the book API is set first.
  //Book API provides whole URL. Work API provides just the image Id.
  const cover:string = book?.cover?.large ? book.cover?.large :
    `https://covers.openlibrary.org/w/id/${book.covers?.[0]}-L.jpg`;

  return (
    <div>
      <BookFullUI book={workTypeBook != null ? workTypeBook : book}
       author={author} cover={cover}/>
    </div>
  )
}

export default page;