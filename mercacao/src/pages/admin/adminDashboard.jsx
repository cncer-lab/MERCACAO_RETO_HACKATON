import { getCurrentUser, logout } from "../../services/authService";
import "./adminDashboard.css";

function AdminDashboard() {
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <h2>Mercacao</h2>
          <span>Colombia</span>
        </div>

        <nav className="admin-menu">
          <button>⌂ Dashboard</button>
          <button>📦 Lotes</button>
          <button>🔎 Trazabilidad</button>
          <button>📊 Inventario</button>
          <button>⚠ Alertas</button>
          <button>💰 Costos y margen</button>
          <button>✓ Estados</button>
          <button>📝 Auditoría</button>
          <button>💾 Respaldo</button>
        </nav>

        <div className="admin-logout">
          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Panel del administrador</h1>
            <p>
              Control general de Mercacao.
            </p>
          </div>

          <div className="admin-user">
            <strong>{user?.name}</strong>
            <span>Administrador</span>
          </div>

        </header>

        <section className="admin-stats">

          <div className="admin-stat">
            <span>Total de lotes</span>
            <h2>48</h2>
          </div>

          <div className="admin-stat">
            <span>Disponibles</span>
            <h2>32</h2>
          </div>

          <div className="admin-stat">
            <span>Alertas</span>
            <h2>4</h2>
          </div>

          <div className="admin-stat">
            <span>Bloqueados</span>
            <h2>2</h2>
          </div>

        </section>

        <section className="admin-content">

          <h2>Gestión del sistema</h2>

          <div className="admin-actions">

            <div className="admin-action">
              <strong>📦 Gestión de lotes</strong>
              <span>
                Consulta y administra los lotes registrados.
              </span>
            </div>

            <div className="admin-action">
              <strong>🔎 Trazabilidad</strong>
              <span>
                Consulta el recorrido completo del cacao.
              </span>
            </div>

            <div className="admin-action">
              <strong>⚠ Alertas</strong>
              <span>
                Revisa mermas y situaciones que requieren atención.
              </span>
            </div>

            <div className="admin-action">
              <strong>💰 Economía</strong>
              <span>
                Consulta costos unitarios y márgenes.
              </span>
            </div>

            <div className="admin-action">
              <strong>✓ Estados</strong>
              <span>
                Libera o bloquea productos.
              </span>
            </div>

            <div className="admin-action">
              <strong>📝 Auditoría</strong>
              <span>
                Consulta el historial de cambios.
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;