import { getCurrentUser, logout } from "../../services/authService";
import "./operatorDashboard.css";

function OperatorDashboard() {
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <div className="operator-page">

      <aside className="operator-sidebar">

        <div className="operator-brand">
          <h2>Mercacao</h2>
          <span>Colombia</span>
        </div>

        <nav className="operator-menu">
          <button>⌂ Dashboard</button>
          <button>🌱 Recepción de lotes</button>
          <button>🔄 Transformaciones</button>
          <button>📦 Inventario</button>
          <button>⚠ Incidencias</button>
        </nav>

        <div className="operator-logout">
          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

      </aside>

      <main className="operator-main">

        <header className="operator-header">

          <div>
            <h1>Panel del operador</h1>
            <p>
              Gestiona la recepción y transformación del cacao.
            </p>
          </div>

          <div className="operator-user">
            <strong>{user?.name}</strong>
            <span>Operador</span>
          </div>

        </header>

        <section className="operator-stats">

          <div className="operator-stat">
            <span>Lotes recibidos</span>
            <h2>24</h2>
          </div>

          <div className="operator-stat">
            <span>Transformaciones</span>
            <h2>18</h2>
          </div>

          <div className="operator-stat">
            <span>Incidencias</span>
            <h2>2</h2>
          </div>

        </section>

        <section className="operator-content">

          <h2>Acciones rápidas</h2>

          <div className="operator-actions">

            <div className="operator-action">
              <strong>🌱 Recibir nuevo lote</strong>
              <span>
                Registrar productor, origen y cantidad.
              </span>
            </div>

            <div className="operator-action">
              <strong>🔄 Registrar transformación</strong>
              <span>
                Registrar entrada, salida y proceso.
              </span>
            </div>

            <div className="operator-action">
              <strong>📦 Consultar inventario</strong>
              <span>
                Revisar cantidades disponibles.
              </span>
            </div>

            <div className="operator-action">
              <strong>⚠ Registrar incidencia</strong>
              <span>
                Reportar una novedad del proceso.
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default OperatorDashboard;