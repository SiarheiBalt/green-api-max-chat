import { useState, type FormEvent } from "react";
import { useSession } from "../context/session/useSession";

export function CredentialsForm() {
  const { login } = useSession();
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const id = idInstance.trim();
    const token = apiTokenInstance.trim();
    if (!id || !token) {
      setLocalError("Укажите idInstance и apiTokenInstance");
      return;
    }
    setLocalError(null);
    const url = apiUrl.trim();
    login(id, token, url || undefined);
  };

  return (
    <div className="screen screen--form">
      <header className="screen-header">
        <h1 className="screen-title">MAX Chat</h1>
        <p className="screen-subtitle">Вход через GREEN-API</p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">idInstance</span>
          <input
            className="field-input"
            type="text"
            name="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="1234567890"
          />
        </label>

        <label className="field">
          <span className="field-label">apiTokenInstance</span>
          <input
            className="field-input"
            type="password"
            name="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="field">
          <span className="field-label">
            API URL <span className="field-optional">(необязательно, для обхода CORS)</span>
          </span>
          <input
            className="field-input"
            type="text"
            name="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="/api или https://api.green-api.com"
          />
        </label>

        {localError ? <p className="form-error">{localError}</p> : null}

        <button className="btn btn--primary btn--block" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}
