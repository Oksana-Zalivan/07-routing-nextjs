import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import NotesByTagClient from "./NotesByTag.client";
import { fetchNotes } from "@/lib/api"; // або "@/lib/api/notes" якщо так у тебе
import type { NoteTag } from "@/types/note";

const PER_PAGE = 12;

type PageProps = {
  params: { tag: string[] };
};

function normalizeTag(raw: string | undefined): NoteTag | undefined {
  if (!raw || raw === "all") return undefined;
  return raw as NoteTag;
}

export default async function NotesByTagPage({ params }: PageProps) {
  const tag = normalizeTag(params.tag?.[0]);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? "all"],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesByTagClient />
    </HydrationBoundary>
  );
}
