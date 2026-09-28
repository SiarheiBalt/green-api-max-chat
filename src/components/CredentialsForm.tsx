import { useState, type SubmitEvent  } from "react";
import { useSession } from "../context/session/useSession";

const CredentialsForm = () => {
  const { login } = useSession();
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: SubmitEvent ) => {
    event.preventDefault();
    const id = idInstance.trim();
    const token = apiTokenInstance.trim();
    if (!id || !token) {
      setLocalError("Укажите idInstance и apiTokenInstance");
      return;
    }
    setLocalError(null);
    try {
      login(id, token);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Не удалось войти");
    }
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
            placeholder="310022747335"
            required
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
            required
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

export default CredentialsForm;