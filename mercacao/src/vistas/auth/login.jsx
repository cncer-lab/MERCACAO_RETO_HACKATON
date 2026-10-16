import { useState } from "react";
import "./login.css";
import { login } from "../../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Debes ingresar usuario y contraseña.");
      return;
    }

    setLoading(true);

    const result = login(username, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    if (result.user.role === "OPERADOR") {
      window.location.href = "/operador";
      return;
    }

    if (result.user.role === "ADMINISTRADOR") {
      window.location.href = "/admin";
      return;
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-logo">
        <a href="/" className="auth-logo">
            Mercacao <span>Colombia</span>
          </a>
          </div>

          <h1>Iniciar sesión</h1>

          <p>
            Ingresa a Mercacao para continuar
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="usuario">
              Usuario
            </label>

            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="forgot-password">
            <a href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/register">
              Registrarse
            </a>
          </p>

          <a href="/" className="back-home">
            ← Volver al inicio
          </a>
        </div>

      </div>
    </div>
  );
}

export default Login;