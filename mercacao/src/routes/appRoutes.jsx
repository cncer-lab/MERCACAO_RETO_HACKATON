import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "40px", fontFamily: "Arial" }}>
              <h1>Mercacao funciona</h1>
              <p>El sistema de rutas está funcionando correctamente.</p>
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <div style={{ padding: "40px", fontFamily: "Arial" }}>
              <h1>Página de Login</h1>
              <p>La ruta /login funciona.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;