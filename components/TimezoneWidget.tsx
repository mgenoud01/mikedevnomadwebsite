"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { label: "Berne / Zurich", tz: "Europe/Zurich" },
  { label: "Bangkok", tz: "Asia/Bangkok" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function TimezoneWidget() {
  const [times, setTimes] = useState<string[] | null>(null);
  const [utc, setUtc] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimes(
        ZONES.map(({ tz }) =>
          new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(now)
        )
      );
      setUtc(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-card border border-line bg-panel-2 p-5 font-mono text-[13.5px]"
      aria-label="Timezones covered"
    >
      {ZONES.map((zone, i) => (
        <div key={zone.tz} className="flex justify-between border-b border-dashed border-line py-2.5">
          <span className="text-mist">{zone.label}</span>
          <b className="font-medium text-mint" suppressHydrationWarning>{times?.[i] ?? "--:--"}</b>
        </div>
      ))}
      <div className="flex justify-between border-b border-dashed border-line py-2.5">
        <span className="text-mist">UTC</span>
        <b className="font-medium text-mint" suppressHydrationWarning>{utc ?? "--:--"}</b>
      </div>
      <div className="flex justify-between py-2.5">
        <span className="text-muted">Response time</span>
        <b className="font-medium text-mint">&lt; 24h (business days)</b>
      </div>
    </div>
  );
}
