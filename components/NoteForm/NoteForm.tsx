"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { useState } from "react";
import type { NoteTag } from "@/types/note";


export default function NoteForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function formAction(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();

const tag = (formData.get("tag") as NoteTag) ?? "Todo";

    
    if (title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    try {
      setIsPending(true);
      setError(null);

      await createNote({ title, content, tag });

      router.push("/notes/filter/all");
      router.refresh();
    } catch {
      setError("Failed to create note");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select} defaultValue="Todo">
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {error && <span className={css.error}>{error}</span>}

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.push("/notes/filter/all")}
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className={css.submitButton}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
