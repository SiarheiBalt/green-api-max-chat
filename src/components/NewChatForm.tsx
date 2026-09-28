import { useState, type FormEvent } from "react";
import { useChat } from "../context/chat/useChat";
import { useSession } from "../context/session/useSession";

const NewChatForm = () => {
  const { logout } = useSession();
  const { openChat, error, resetChat } = useChat();
  const [phone, setPhone] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    openChat(phone);
  };

  const handleLogout = () => {
    resetChat();
    logout();
  };

  return (
    <div className="screen screen--form">
      <header className="screen-header screen-header--row">
        <div>
          <h1 className="screen-title">Новый чат</h1>
          <p className="screen-subtitle">Номер получателя в MAX</p>
        </div>
        <button className="btn btn--ghost" type="button" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Телефон</span>
          <input
            className="field-input"
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+7 999 123-45-67"
          />
          <span className="field-hint">Формат: 11 цифр, начинается с 7 (например 79991234567)</span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="btn btn--primary btn--block" type="submit">
          Начать чат
        </button>
      </form>
    </div>
  );
}

export default NewChatForm;