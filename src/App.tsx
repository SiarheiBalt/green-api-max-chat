import { useSession } from "./context/session/useSession";
import { useChat } from "./context/chat/useChat";
import "./styles/app.css";

export default function App() {
  const { isAuthenticated } = useSession();
  const { chatId } = useChat();

  if (!isAuthenticated) {
    return (
      <main className="app-shell">
        <p className="app-placeholder">Вход — форма учётных данных (скоро)</p>
      </main>
    );
  }

  if (!chatId) {
    return (
      <main className="app-shell">
        <p className="app-placeholder">Новый чат — форма номера (скоро)</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <p className="app-placeholder">Чат (скоро)</p>
    </main>
  );
}
