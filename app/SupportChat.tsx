"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Bot, ExternalLink, Send, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type Message = { id: number; sender: "support" | "user"; text: string };

const quickReplies = [
  { label: "Booking help", message: "I need help with a booking.", response: "For booking help, open the listing you’re interested in and review its details first. Tell me which category—stay, hotel, food, or transport—and I’ll point you in the right direction." },
  { label: "Account access", message: "I’m having trouble accessing my account.", response: "You can reset your password from the sign-in page. If the reset email doesn’t arrive, check spam and confirm you used the email connected to your Tourz account." },
  { label: "Wishlist", message: "I need help with my wishlist.", response: "Tap the heart on any listing to save it. Signed-in favorites sync to your account after the favorites database migration has been applied." },
] as const;

export default function SupportChat({ variant = "header" }: { variant?: "header" | "menu" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "support", text: "Hi! I’m the Tourz Support Assistant. How can I help with your trip today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const nextId = useRef(2);

  function addExchange(message: string, response?: string) {
    const cleanMessage = message.trim();
    if (!cleanMessage || typing) return;
    setMessages((current) => [...current, { id: nextId.current++, sender: "user", text: cleanMessage }]);
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, {
        id: nextId.current++,
        sender: "support",
        text: response ?? "Thanks for explaining. For detailed assistance, visit the Help Center, where you can find guidance for bookings, accounts, and trip changes.",
      }]);
      setTyping(false);
    }, 650);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    addExchange(String(data.get("message") ?? ""));
    form.reset();
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={variant === "menu" ? "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700" : "inline-flex h-10 items-center gap-2 rounded-full border border-violet-200 bg-white px-3 text-sm font-semibold shadow-sm transition hover:bg-violet-50"}>
        <span className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-white"><Bot className="size-4" /></span>
        Support
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <Dialog.Popup className="flex h-[min(42rem,92dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition duration-200 data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0 sm:rounded-3xl">
            <header className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="relative flex size-10 items-center justify-center rounded-full bg-violet-600"><Bot className="size-5" /><span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-950 bg-emerald-400" /></span>
                <div><Dialog.Title className="font-semibold">Tourz Support</Dialog.Title><Dialog.Description className="text-xs text-slate-300">Automated help · replies instantly</Dialog.Description></div>
              </div>
              <Dialog.Close aria-label="Close support chat" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><X className="size-5" /></Dialog.Close>
            </header>

            <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.sender === "user" ? "rounded-br-md bg-violet-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>{message.text}</p>
                </div>
              ))}
              {typing && <div className="flex justify-start"><span className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">Typing…</span></div>}
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((item) => <button key={item.label} type="button" disabled={typing} onClick={() => addExchange(item.message, item.response)} className="shrink-0 rounded-full border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50">{item.label}</button>)}
              </div>
              <form onSubmit={submit} className="flex gap-2">
                <input name="message" required disabled={typing} aria-label="Message support" placeholder="Type your question…" className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
                <button disabled={typing} aria-label="Send message" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"><Send className="size-4" /></button>
              </form>
              <Link href="/help" onClick={() => setOpen(false)} className="mx-auto mt-3 flex w-fit items-center gap-1 text-xs font-medium text-slate-500 hover:text-violet-700">Visit the Help Center <ExternalLink className="size-3" /></Link>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
