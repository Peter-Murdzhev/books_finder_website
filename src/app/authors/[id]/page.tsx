import { findAuthorById } from '@/actions/author-actions';
import AuthorFullUI from '@/components/AuthorFullUI';


const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const author = await findAuthorById(decodedId);

  if(!author){
    return <p className="text-semibold text-2xl text-center mt-20 text-cyan-500">
      Author not found</p>
  }  

  return (
    <div>
      <AuthorFullUI author={author}/>
    </div>
  )
}

export default page;