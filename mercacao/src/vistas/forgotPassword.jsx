import "./auth.css";

function ForgotPassword() {
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
            <h1>Recuperar contraseña</h1>

            <p>
              Ingresa tu correo electrónico y te enviaremos
              instrucciones para recuperar el acceso a tu cuenta.
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

            <button type="submit" className="auth-button">
              Enviar instrucciones →
            </button>

          </form>

          <p className="auth-bottom">
            ¿Recordaste tu contraseña?
            <a href="/login"> Iniciar sesión</a>
          </p>

        </div>

        <a href="/" className="back-home">
          ← Volver al inicio
        </a>

      </div>

    </div>
  );
}

export default ForgotPassword;