import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import NotesByTagClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

const PER_PAGE = 12;

type PageProps = {
  params: { slug: string[] };
};

function normalizeTag(raw: string | undefined): NoteTag | undefined {
  if (!raw || raw === "all") return undefined;
  return raw as NoteTag;
}

export default async function NotesByTagPage({ params }: PageProps) {
  const tag = normalizeTag(params.slug?.[0]);

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

