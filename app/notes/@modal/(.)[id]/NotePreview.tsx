"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

export default function NotePreview() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NoteDetailsClient />
    </Modal>
  );
}

