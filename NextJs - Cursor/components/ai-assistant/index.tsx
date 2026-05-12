"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, RotateCcw, Wand2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setAiOpen } from "@/lib/store/uiSlice";
import { matchIntent, DEFAULT_FOLLOW_UPS } from "@/lib/ai/scripted-responses";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "ai";
  content: string;
  followUps?: string[];
  typing?: boolean;
}

const INITIAL: Msg[] = [
  {
    id: "m_intro",
    role: "ai",
    content:
      "Hi! I'm **Crowny** — your AI HR copilot. I can analyze workforce data, draft comms, suggest rewards, and forecast attrition. What would you like to explore today?",
    followUps: DEFAULT_FOLLOW_UPS
  }
];

export function AIAssistant() {
  const open = useAppSelector((s) => s.ui.aiOpen);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = React.useState<Msg[]>(INITIAL);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [open, messages]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const userMsg: Msg = { id: `m_${Date.now()}_u`, role: "user", content: text };
    const typing: Msg = { id: `m_${Date.now()}_t`, role: "ai", content: "", typing: true };
    setMessages((m) => [...m, userMsg, typing]);
    setInput("");

    const intent = matchIntent(text);
    const minDelay = 600;
    const maxDelay = 1100;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    await new Promise((r) => setTimeout(r, delay));

    const reply: Msg = {
      id: `m_${Date.now()}_a`,
      role: "ai",
      content: intent.reply,
      followUps: intent.followUps
    };
    setMessages((m) => [...m.filter((x) => !x.typing), reply]);
  };

  const reset = () => setMessages(INITIAL);

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setAiOpen(v))}>
      <SheetContent side="right" className="w-full max-w-lg p-0 flex flex-col">
        <header className="flex items-center justify-between border-b bg-gradient-to-br from-primary/10 via-info/5 to-accent/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow animate-float">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">Crowny</div>
              <div className="text-xs text-muted-foreground">AI HR copilot · always available</div>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </header>

        <ScrollArea className="flex-1 px-5">
          <div ref={scrollRef} className="space-y-4 py-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-2",
                    m.role === "user" && "flex-row-reverse"
                  )}
                >
                  {m.role === "ai" ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.avatar} alt="me" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-foreground"
                    )}
                  >
                    {m.typing ? (
                      <TypingIndicator />
                    ) : (
                      <RichText text={m.content} />
                    )}
                    {m.followUps && m.followUps.length > 0 && m.role === "ai" && !m.typing && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.followUps.map((f) => (
                          <button
                            key={f}
                            onClick={() => send(f)}
                            className="rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium shadow-soft hover:border-primary/40 hover:text-primary transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="border-t bg-card/80 p-3 backdrop-blur">
          <div className="mb-2 flex items-center gap-1.5">
            <Wand2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Quick prompts
            </span>
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {DEFAULT_FOLLOW_UPS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium shadow-soft hover:border-primary/40 hover:text-primary transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 shadow-soft"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your workforce..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="icon-sm" variant="brand" disabled={!input.trim()}>
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const isBullet = line.startsWith("•");
        return (
          <div key={i} className={cn(isBullet && "pl-1")}>
            {renderInline(line)}
          </div>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
