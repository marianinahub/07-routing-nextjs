import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesFilterPage({
  params,
  searchParams,
}: NotesFilterPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const currentTag = slug[0];
  const page = Number(query.page) || 1;
  const search = query.search || "";

  const tag = currentTag === "all" ? undefined : (currentTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(page, search, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={search} tag={tag} />
    </HydrationBoundary>
  );
}