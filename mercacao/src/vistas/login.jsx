import "./auth.css";

function Login() {
  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-header">
          <a href="/" className="auth-logo">
            Mercacao <span>Colombia</span>
          </a>
        </div>

        <div className="auth-card">

          <div className="auth-title">
            <h1>Iniciar sesión</h1>
            <p>
              Ingresa a tu cuenta para continuar.
            </p>
          </div>

          <form>

            <div className="input-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="forgot-container">
              <a href="/forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="auth-button">
              Iniciar sesión →
            </button>

          </form>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <p className="auth-bottom">
            ¿Todavía no tienes una cuenta?
            <a href="/register"> Registrarse</a>
          </p>

        </div>

        <a href="/" className="back-home">
          ← Volver al inicio
        </a>

      </div>

    </div>
  );
}

export default Login;