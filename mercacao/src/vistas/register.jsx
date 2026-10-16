import "./auth.css";

function Register() {
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
            <h1>Crear una cuenta</h1>
            <p>
              Regístrate para comenzar a utilizar Mercacao Colombia.
            </p>
          </div>

          <form>

            <div className="input-group">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Tu nombre completo"
              />
            </div>

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
                placeholder="Crea una contraseña"
              />
            </div>

            <div className="input-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button type="submit" className="auth-button">
              Crear cuenta →
            </button>

          </form>

          <p className="auth-bottom">
            ¿Ya tienes una cuenta?
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

export default Register;