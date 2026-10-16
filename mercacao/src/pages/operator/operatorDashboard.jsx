import { useEffect, useState } from "react";
import "./operatorDashboard.css";

function OperatorDashboard() {
  const [activeSection, setActiveSection] = useState("resumen");

  const [lots, setLots] = useState(() => {
    const saved = localStorage.getItem("mercacao_lots");
    return saved ? JSON.parse(saved) : [];
  });

  const [transformations, setTransformations] = useState(() => {
    const saved = localStorage.getItem("mercacao_transformations");
    return saved ? JSON.parse(saved) : [];
  });

  const [lotForm, setLotForm] = useState({
    producer: "",
    origin: "",
    receptionDate: "",
    quantity: "",
    unit: "kg",
    weight: "",
    observations: "",
  });

  const [transformationForm, setTransformationForm] = useState({
    lotId: "",
    stage: "",
    responsible: "",
    date: "",
    method: "",
    equipment: "",
    input: "",
    output: "",
    unit: "kg",
    incident: "",
    justification: "",
  });

  useEffect(() => {
    localStorage.setItem("mercacao_lots", JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem(
      "mercacao_transformations",
      JSON.stringify(transformations)
    );
  }, [transformations]);

  const handleLotChange = (e) => {
    const { name, value } = e.target;

    setLotForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerLot = (e) => {
    e.preventDefault();

    if (
      !lotForm.producer ||
      !lotForm.origin ||
      !lotForm.receptionDate ||
      !lotForm.quantity ||
      !lotForm.weight
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (
      Number(lotForm.quantity) <= 0 ||
      Number(lotForm.weight) <= 0
    ) {
      alert("La cantidad y el peso deben ser mayores que 0.");
      return;
    }

    const newLot = {
      id: `CAC${String(lots.length + 1).padStart(3, "0")}`,
      producer: lotForm.producer,
      origin: lotForm.origin,
      receptionDate: lotForm.receptionDate,
      quantity: Number(lotForm.quantity),
      unit: lotForm.unit,
      weight: Number(lotForm.weight),
      observations: lotForm.observations,
      status: "RECIBIDO",
      createdAt: new Date().toISOString(),
    };

    setLots((prev) => [...prev, newLot]);

    setLotForm({
      producer: "",
      origin: "",
      receptionDate: "",
      quantity: "",
      unit: "kg",
      weight: "",
      observations: "",
    });

    alert(`Lote ${newLot.id} registrado correctamente.`);
    setActiveSection("lotes");
  };

  const handleTransformationChange = (e) => {
    const { name, value } = e.target;

    setTransformationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerTransformation = (e) => {
    e.preventDefault();

    if (
      !transformationForm.lotId ||
      !transformationForm.stage ||
      !transformationForm.responsible ||
      !transformationForm.date ||
      !transformationForm.input ||
      !transformationForm.output
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const input = Number(transformationForm.input);
    const output = Number(transformationForm.output);

    if (input <= 0 || output <= 0) {
      alert("La entrada y la salida deben ser mayores que 0.");
      return;
    }

    if (
      output > input &&
      !transformationForm.justification.trim()
    ) {
      alert(
        "La salida supera la entrada. Debes registrar una justificación."
      );
      return;
    }

    const merma = ((input - output) / input) * 100;

    const newTransformation = {
      id: `TR-${String(transformations.length + 1).padStart(3, "0")}`,
      lotId: transformationForm.lotId,
      stage: transformationForm.stage,
      responsible: transformationForm.responsible,
      date: transformationForm.date,
      method: transformationForm.method,
      equipment: transformationForm.equipment,
      input,
      output,
      unit: transformationForm.unit,
      merma: Number(merma.toFixed(2)),
      incident: transformationForm.incident,
      justification: transformationForm.justification,
      createdAt: new Date().toISOString(),
    };

    setTransformations((prev) => [
      ...prev,
      newTransformation,
    ]);

    setTransformationForm({
      lotId: "",
      stage: "",
      responsible: "",
      date: "",
      method: "",
      equipment: "",
      input: "",
      output: "",
      unit: "kg",
      incident: "",
      justification: "",
    });

    alert(
      `Transformación ${newTransformation.id} registrada correctamente.`
    );

    setActiveSection("transformaciones");
  };

  return (
    <div className="operator-page">

      {/* SIDEBAR */}

      <aside className="operator-sidebar">

        <div className="operator-brand">
          <h2>Mercacao</h2>
          <span>Panel Operador</span>
        </div>

        <nav>

          <button
            className={activeSection === "resumen" ? "active" : ""}
            onClick={() => setActiveSection("resumen")}
          >
            📊 Resumen
          </button>

          <button
            className={activeSection === "nuevo-lote" ? "active" : ""}
            onClick={() => setActiveSection("nuevo-lote")}
          >
            📦 Recibir lote
          </button>

          <button
            className={activeSection === "lotes" ? "active" : ""}
            onClick={() => setActiveSection("lotes")}
          >
            🗂️ Mis lotes
          </button>

          <button
            className={
              activeSection === "nueva-transformacion"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("nueva-transformacion")
            }
          >
            🔄 Registrar transformación
          </button>

          <button
            className={
              activeSection === "transformaciones"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("transformaciones")
            }
          >
            📋 Revisar transformaciones
          </button>

        </nav>

        <div className="operator-user">
            <strong>Operador</strong>
            <span>Usuario interno</span>

            <button
            className="logout-button"
             onClick={() => {
            localStorage.removeItem("mercacao_user");
            window.location.href = "/login";
              }}
               >
             Cerrar sesión
            </button>
        </div>

      </aside>

      <main className="operator-content">

        {activeSection === "resumen" && (
          <>
            <div className="page-title">
              <span>OPERADOR</span>
              <h1>Panel de control</h1>
              <p>
                Registra y consulta la información de recepción
                y transformación del cacao.
              </p>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <span>Lotes registrados</span>
                <strong>{lots.length}</strong>
              </div>

              <div className="stat-card">
                <span>Transformaciones</span>
                <strong>{transformations.length}</strong>
              </div>

              <div className="stat-card">
                <span>Incidencias</span>
                <strong>
                  {
                    transformations.filter(
                      (item) => item.incident
                    ).length
                  }
                </strong>
              </div>

              <div className="stat-card">
                <span>Estado</span>
                <strong className="ok">
                  Operativo
                </strong>
              </div>

            </div>

            <div className="welcome-card">

              <h2>Flujo de trabajo</h2>

              <div className="workflow">

                <div>
                  <span>01</span>
                  <strong>Recibir lote</strong>
                  <p>
                    Registra productor, origen, fecha y cantidad.
                  </p>
                </div>

                <div>
                  <span>02</span>
                  <strong>Transformar</strong>
                  <p>
                    Registra entradas, salidas, responsable e incidencias.
                  </p>
                </div>

                <div>
                  <span>03</span>
                  <strong>Revisar</strong>
                  <p>
                    Consulta el historial de lo que has registrado.
                  </p>
                </div>

              </div>

            </div>
          </>
        )}
        {activeSection === "nuevo-lote" && (
          <section>

            <div className="page-title">
              <span>RECEPCIÓN</span>
              <h1>Registrar nuevo lote</h1>
              <p>
                Ingresa la información del cacao recibido.
              </p>
            </div>

            <form
              className="form-card"
              onSubmit={registerLot}
            >

              <div className="form-section-title">
                Información del productor
              </div>

              <div className="form-grid">

                <label>
                  Nombre del productor *
                  <input
                    type="text"
                    name="producer"
                    value={lotForm.producer}
                    onChange={handleLotChange}
                    placeholder="Ej. Juan Pérez"
                  />
                </label>

                <label>
                  Origen / municipio *
                  <input
                    type="text"
                    name="origin"
                    value={lotForm.origin}
                    onChange={handleLotChange}
                    placeholder="Ej. Rivera, Huila"
                  />
                </label>

                <label>
                  Fecha de recepción *
                  <input
                    type="date"
                    name="receptionDate"
                    value={lotForm.receptionDate}
                    onChange={handleLotChange}
                  />
                </label>

              </div>

              <div className="form-section-title">
                Cantidad recibida
              </div>

              <div className="form-grid">

                <label>
                  Cantidad *
                  <input
                    type="number"
                    name="quantity"
                    value={lotForm.quantity}
                    onChange={handleLotChange}
                    min="0"
                    step="0.01"
                  />
                </label>

                <label>
                  Unidad *
                  <select
                    name="unit"
                    value={lotForm.unit}
                    onChange={handleLotChange}
                  >
                    <option value="kg">Kilogramos</option>
                    <option value="g">Gramos</option>
                    <option value="unidad">Unidad</option>
                  </select>
                </label>

                <label>
                  Peso total (kg) *
                  <input
                    type="number"
                    name="weight"
                    value={lotForm.weight}
                    onChange={handleLotChange}
                    min="0"
                    step="0.01"
                    placeholder="Ej. 100"
                  />
                </label>

              </div>

              <label>
                Observaciones
                <textarea
                  name="observations"
                  value={lotForm.observations}
                  onChange={handleLotChange}
                  placeholder="Observaciones del lote..."
                  rows="4"
                />
              </label>

              <button
                className="primary-button"
                type="submit"
              >
                Registrar lote
              </button>

            </form>

          </section>
        )}

        {activeSection === "lotes" && (
          <section>

            <div className="page-title">
              <span>INVENTARIO DE RECEPCIÓN</span>
              <h1>Lotes registrados</h1>
              <p>
                Consulta los lotes que has recibido.
              </p>
            </div>

            <div className="table-card">

              {lots.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay lotes registrados</h3>
                  <p>
                    Registra tu primer lote para comenzar.
                  </p>
                </div>
              ) : (
                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Productor</th>
                        <th>Origen</th>
                        <th>Fecha</th>
                        <th>Cantidad</th>
                        <th>Peso</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>

                      {lots.map((lot) => (
                        <tr key={lot.id}>

                          <td>
                            <strong>{lot.id}</strong>
                          </td>

                          <td>{lot.producer}</td>

                          <td>{lot.origin}</td>

                          <td>{lot.receptionDate}</td>

                          <td>
                            {lot.quantity} {lot.unit}
                          </td>

                          <td>
                            {lot.weight} kg
                          </td>

                          <td>
                            <span className="status received">
                              {lot.status}
                            </span>
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </section>
        )}

        {activeSection === "nueva-transformacion" && (
          <section>

            <div className="page-title">
              <span>TRANSFORMACIÓN</span>
              <h1>Registrar etapa</h1>
              <p>
                Registra el proceso realizado y vincúlalo con
                el lote de origen.
              </p>
            </div>

            <form
              className="form-card"
              onSubmit={registerTransformation}
            >

              <div className="form-section-title">
                Lote y responsable
              </div>

              <div className="form-grid">

                <label>
                  Lote de origen *
                  <select
                    name="lotId"
                    value={transformationForm.lotId}
                    onChange={handleTransformationChange}
                  >
                    <option value="">
                      Selecciona un lote
                    </option>

                    {lots.map((lot) => (
                      <option
                        key={lot.id}
                        value={lot.id}
                      >
                        {lot.id} - {lot.producer}
                      </option>
                    ))}

                  </select>
                </label>

                <label>
                  Etapa *
                  <input
                    type="text"
                    name="stage"
                    value={transformationForm.stage}
                    onChange={handleTransformationChange}
                    placeholder="Ej. Fermentación"
                  />
                </label>

                <label>
                  Responsable *
                  <input
                    type="text"
                    name="responsible"
                    value={transformationForm.responsible}
                    onChange={handleTransformationChange}
                    placeholder="Nombre del responsable"
                  />
                </label>

                <label>
                  Fecha *
                  <input
                    type="date"
                    name="date"
                    value={transformationForm.date}
                    onChange={handleTransformationChange}
                  />
                </label>

              </div>

              <div className="form-section-title">
                Proceso
              </div>

              <div className="form-grid">

                <label>
                  Método
                  <input
                    type="text"
                    name="method"
                    value={transformationForm.method}
                    onChange={handleTransformationChange}
                    placeholder="Método utilizado"
                  />
                </label>

                <label>
                  Equipo
                  <input
                    type="text"
                    name="equipment"
                    value={transformationForm.equipment}
                    onChange={handleTransformationChange}
                    placeholder="Equipo utilizado"
                  />
                </label>

                <label>
                  Entrada *
                  <input
                    type="number"
                    name="input"
                    value={transformationForm.input}
                    onChange={handleTransformationChange}
                    min="0"
                    step="0.01"
                  />
                </label>

                <label>
                  Salida *
                  <input
                    type="number"
                    name="output"
                    value={transformationForm.output}
                    onChange={handleTransformationChange}
                    min="0"
                    step="0.01"
                  />
                </label>

                <label>
                  Unidad
                  <select
                    name="unit"
                    value={transformationForm.unit}
                    onChange={handleTransformationChange}
                  >
                    <option value="kg">Kilogramos</option>
                    <option value="g">Gramos</option>
                  </select>
                </label>

              </div>

              <div className="calculation-box">

                <span>Merma calculada</span>

                <strong>
                  {transformationForm.input > 0
                    ? (
                        (
                          (Number(transformationForm.input) -
                            Number(transformationForm.output)) /
                          Number(transformationForm.input)
                        ) *
                        100
                      ).toFixed(2)
                    : "0.00"}
                  %
                </strong>

              </div>

              <div className="form-section-title">
                Incidencias
              </div>

              <label>
                Incidencia
                <textarea
                  name="incident"
                  value={transformationForm.incident}
                  onChange={handleTransformationChange}
                  placeholder="Describe cualquier incidencia..."
                  rows="4"
                />
              </label>

              <label>
                Justificación
                <textarea
                  name="justification"
                  value={transformationForm.justification}
                  onChange={handleTransformationChange}
                  placeholder="Obligatoria si la salida supera la entrada."
                  rows="4"
                />
              </label>

              <button
                className="primary-button"
                type="submit"
              >
                Registrar transformación
              </button>

            </form>

          </section>
        )}

        {activeSection === "transformaciones" && (
          <section>

            <div className="page-title">
              <span>HISTORIAL</span>
              <h1>Transformaciones registradas</h1>
              <p>
                Revisa las etapas que has registrado.
              </p>
            </div>

            <div className="table-card">

              {transformations.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay transformaciones</h3>
                  <p>
                    Registra una etapa para verla aquí.
                  </p>
                </div>
              ) : (
                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Lote origen</th>
                        <th>Etapa</th>
                        <th>Responsable</th>
                        <th>Fecha</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Merma</th>
                        <th>Incidencia</th>
                      </tr>
                    </thead>

                    <tbody>

                      {transformations.map((item) => (
                        <tr key={item.id}>

                          <td>
                            <strong>{item.id}</strong>
                          </td>

                          <td>{item.lotId}</td>

                          <td>{item.stage}</td>

                          <td>{item.responsible}</td>

                          <td>{item.date}</td>

                          <td>
                            {item.input} {item.unit}
                          </td>

                          <td>
                            {item.output} {item.unit}
                          </td>

                          <td>
                            {item.merma}%
                          </td>

                          <td>
                            {item.incident || "Sin incidencia"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default OperatorDashboard;