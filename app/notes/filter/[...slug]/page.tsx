
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotesClient from "./Notes.client";

interface NotesByCategoryProps {
  params:  Promise<{ slug: string[] }> ;
}
async function NotesByCategory({params}: NotesByCategoryProps) {
const {slug} = await params;
  const slugParam = slug?.[0] ?? "all";
  const tag = slugParam === "all" ? undefined : (slugParam as NoteTag);

    
 const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag}/>
          </HydrationBoundary>
  );


}

export default NotesByCategory;