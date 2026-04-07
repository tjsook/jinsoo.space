"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.push("/");
      router.refresh();
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.logoutButton}
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "logging out..." : "log out"}
    </button>
  );
}
