import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChat } from "../context/chat/useChat";
import { useSession } from "../context/session/useSession";
import { MAX_MESSAGE_LENGTH } from "../types";

function formatTime(timestampSec: number): string {
  const date = new Date(timestampSec * 1000);
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

const ChatView = () => {
  const { logout } = useSession();
  const { recipientPhone, messages, error, isSending, sendMessage, resetChat } = useChat();
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    resetChat();
    logout();
  };

  const submitMessage = async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      setSendError(`Не более ${MAX_MESSAGE_LENGTH} символов`);
      return;
    }
    setSendError(null);
    await sendMessage(text);
    setDraft("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submitMessage();
  };

  const displayError = sendError ?? error;
  const remaining = MAX_MESSAGE_LENGTH - draft.length;
  const overLimit = draft.length > MAX_MESSAGE_LENGTH;

  return (
    <div className="chat">
      <header className="chat-header">
        <div className="chat-header-info">
          <span className="chat-header-label">Чат с</span>
          <span className="chat-header-phone">{recipientPhone ?? "—"}</span>
        </div>
        <button className="btn btn--ghost" type="button" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <ul className="chat-messages" aria-live="polite">
        {messages.length === 0 ? (
          <li className="chat-empty">Напишите сообщение — ответ появится здесь</li>
        ) : (
          messages.map((message) => (
            <li
              key={message.idMessage}
              className={`chat-bubble chat-bubble--${message.direction}`}
            >
              <p className="chat-bubble-text">{message.text}</p>
              <time className="chat-bubble-time" dateTime={new Date(message.timestamp * 1000).toISOString()}>
                {formatTime(message.timestamp)}
              </time>
            </li>
          ))
        )}
        <li ref={listEndRef} className="chat-messages-anchor" aria-hidden />
      </ul>

      <footer className="chat-composer">
        {displayError ? <p className="form-error chat-composer-error">{displayError}</p> : null}
        <form className="chat-composer-form" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Сообщение"
            rows={2}
            maxLength={MAX_MESSAGE_LENGTH + 200}
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submitMessage();
              }
            }}
          />
          <div className="chat-composer-actions">
            <span className={`chat-counter${overLimit ? " chat-counter--over" : ""}`}>
              {remaining}
            </span>
            <button
              className="btn btn--primary"
              type="submit"
              disabled={isSending || !draft.trim() || overLimit}
            >
              {isSending ? "…" : "Отправить"}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default ChatView;