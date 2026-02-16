import axios, { type AxiosInstance } from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

const api: AxiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
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

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const res: AxiosResponse<unknown> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag ? { tag: params.tag } : {}), // ✅ додали
    },
  });

  return normalizeFetchNotes(res.data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(payload: CreateNoteRequest): Promise<Note> {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
}

