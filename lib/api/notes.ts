import type { AxiosResponse } from "axios";
import { api } from "./instance";
import type { Note, NoteTag } from "@/types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}

function normalizeFetchNotes(data: unknown): FetchNotesResponse {
  const obj = data as Record<string, unknown>;
  const notesRaw = (obj.notes ?? obj.items ?? []) as unknown[];
  const totalPagesRaw = (obj.totalPages ?? obj.total_pages ?? 1) as unknown;

  return {
    notes: notesRaw as Note[],
    totalPages: Number(totalPagesRaw) || 1,
  };
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const res: AxiosResponse<unknown> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search ? { search: params.search } : {}),
    },
  });

  return normalizeFetchNotes(res.data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res: AxiosResponse<unknown> = await api.get(`/notes/${id}`);
  return res.data as Note;
}

export async function createNote(payload: CreateNoteRequest): Promise<Note> {
  const res: AxiosResponse<unknown> = await api.post("/notes", payload);
  return res.data as Note;
}

export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<unknown> = await api.delete(`/notes/${id}`);
  return res.data as Note;
}
