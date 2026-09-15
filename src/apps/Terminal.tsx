import { useEffect, useRef, useState } from "react";
import { FORTUNES, PERSON } from "../data/content";
import { APP_ORDER, type AppId } from "../types";
import { useOS } from "../os/OSContext";

type Line = { kind: "in" | "out" | "sys"; text: string };

const HELP = [
  "help            commands on this machine",
  "whoami          identity",
  "ls              list apps",
  "open <app>      open a window",
  "date            clock",
  "neofetch        system card",
  "fortune         a small opinion",
  "clear           wipe the glass",
  "reboot          restart Helios",
].join("\n");

export function Terminal() {
  const { openApp, reboot, wallpaper, accent } = useOS();
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "Helios shell 0.4.6 — type help" },
  ]);
  const [cmd, setCmd] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const text = raw.trim();
    const next: Line[] = [...lines, { kind: "in", text: `mikail@helios ~ % ${text}` }];
    if (!text) {
      setLines(next);
      return;
    }
    const [bin, ...rest] = text.split(/\s+/);
    const arg = rest.join(" ");
    let out = "";
    switch (bin) {
      case "help":
        out = HELP;
        break;
      case "whoami":
        out = `${PERSON.name}\n${PERSON.role}\n${PERSON.location}`;
        break;
      case "ls":
        out = APP_ORDER.join("  ");
        break;
      case "pwd":
        out = "/Users/mikail/Helios";
        break;
      case "date":
        out = new Date().toString();
        break;
      case "clear":
        setLines([]);
        return;
      case "fortune":
        out = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        break;
      case "reboot":
        reboot();
        return;
      case "neofetch":
        out = [
          "          ░▒░",
          "       ░▒████▒░     mikail@helios",
          "      ▒██    ██▒    OS: Helios 0.4.6",
          "      ▒██    ██▒    shell: helios-sh",
          "       ░▒████▒░     wm: glass",
          "          ░▒░       wallpaper: " + wallpaper,
          "                    accent: " + accent,
        ].join("\n");
        break;
      case "open": {
        const id = arg.toLowerCase() as AppId;
        if (APP_ORDER.includes(id)) {
          openApp(id);
          out = `opened ${id}`;
        } else out = `open: ${arg || "?"} not on this machine`;
        break;
      }
      case "echo":
        out = arg;
        break;
      case "sudo":
        out = "nice try. this is a single-user machine.";
        break;
      case "helios":
        out = "the sun is already in the room.";
        break;
      default:
        out = `command not found: ${bin}`;
    }
    setLines([...next, { kind: "out", text: out }]);
  };

  return (
    <div className="term" onClick={() => input.current?.focus()}>
      <div ref={scroller} className="term-scroll">
        {lines.map((l, i) => (
          <pre key={i} className={`term-${l.kind}`}>
            {l.text}
          </pre>
        ))}
        <form
          className="term-row"
          onSubmit={(e) => {
            e.preventDefault();
            run(cmd);
            if (cmd.trim()) setHist((h) => [cmd, ...h]);
            setCmd("");
            setHi(-1);
          }}
        >
          <span>mikail@helios ~ %</span>
          <input
            ref={input}
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const n = Math.min(hist.length - 1, hi + 1);
                if (hist[n]) {
                  setHi(n);
                  setCmd(hist[n]);
                }
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hi - 1;
                if (n < 0) {
                  setHi(-1);
                  setCmd("");
                } else {
                  setHi(n);
                  setCmd(hist[n]);
                }
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
