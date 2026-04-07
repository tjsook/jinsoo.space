import { getPostById } from "@/lib/posts";
import { updatePostAction } from "../../../actions";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>edit post</h1>
        <form action={updatePostAction} className={styles.form}>
          <input type="hidden" name="id" value={post.id} />
          <input
            name="name"
            type="text"
            placeholder="name"
            defaultValue={post.name}
            className={styles.input}
          />
          <input
            name="slug"
            type="text"
            placeholder="slug"
            defaultValue={post.slug}
            className={styles.input}
          />
          <input
            name="label"
            type="text"
            placeholder="label"
            defaultValue={post.label}
            className={styles.input}
          />
          <select
            name="status"
            className={styles.input}
            defaultValue={post.status}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <textarea
            name="content"
            placeholder="content"
            rows={10}
            defaultValue={post.content}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton}>
            save changes
          </button>
        </form>
      </div>
    </main>
  );
}
