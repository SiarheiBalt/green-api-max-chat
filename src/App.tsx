import { CredentialsForm } from "./components/CredentialsForm";
import { ChatView } from "./components/ChatView";
import { NewChatForm } from "./components/NewChatForm";
import { useSession } from "./context/session/useSession";
import { useChat } from "./context/chat/useChat";
import "./styles/app.css";

export default function App() {
  const { isAuthenticated } = useSession();
  const { chatId } = useChat();

  if (!isAuthenticated) {
    return (
      <main className="app-shell">
        <CredentialsForm />
      </main>
    );
  }

  if (!chatId) {
    return (
      <main className="app-shell">
        <NewChatForm />
      </main>
    );
  }

  return (
    <main className="app-shell app-shell--chat">
      <ChatView />
    </main>
  );
}
