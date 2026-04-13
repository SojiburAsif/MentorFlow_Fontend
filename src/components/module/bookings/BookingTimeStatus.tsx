"use client";

import { useEffect, useMemo, useState } from "react";

export default function BookingTimeStatus({
  dateTime,
  status,
}: {
  dateTime?: string | null;
  status?: string | null;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const timeOver = useMemo(() => {
    if (!dateTime) return false;
    if (status === "COMPLETED" || status === "CANCELLED") return false;
    const start = new Date(dateTime).getTime();
    if (Number.isNaN(start)) return false;
    return now > start + 60 * 60 * 1000;
  }, [dateTime, status, now]);

  if (!timeOver) return null;

  return (
    <span className="px-2 py-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-200">
      Time over
    </span>
  );
}

