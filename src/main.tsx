import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChatProvider } from "./context/chat/ChatProvider";
import { SessionProvider } from "./context/session/SessionProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </SessionProvider>
  </StrictMode>,
);
