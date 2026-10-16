"use client";

import { useEffect, useMemo, useState } from "react";
import "./adminDashboard.css";

const STORAGE = {
  lots: "mercacao_lots",
  transformations: "mercacao_transformations",
  audit: "mercacao_audit",
};

const DEMO_LOTS = [
  {
    id: "CAC001",
    producer: "Cooperativa Rivera",
    origin: "Rivera",
    receptionDate: "2026-10-15",
    quantity: 100,
    unit: "kg",
    status: "PENDIENTE",
    cost: 1600000,
    salePrice: 25000,
    outputKg: 80,
  },
  {
    id: "CAC002",
    producer: "Asocacao Huila",
    origin: "Huila",
    receptionDate: "2026-10-14",
    quantity: 120,
    unit: "kg",
    status: "LIBERADO",
    cost: 1800000,
    salePrice: 28000,
    outputKg: 100,
  },
  {
    id: "CAC003",
    producer: "Cacao del Sur",
    origin: "Tumaco",
    receptionDate: "2026-10-13",
    quantity: 90,
    unit: "kg",
    status: "BLOQUEADO",
    blockReason: "Incidencia de calidad",
    cost: 1400000,
    salePrice: 24000,
    outputKg: 70,
  },
];

const DEMO_TRANSFORMATIONS = [
  {
    id: "TR-001",
    lotId: "CAC001",
    stage: "Fermentación",
    responsible: "Operador Demo",
    date: "2026-10-15",
    method: "Fermentación controlada",
    equipment: "Caja de fermentación",
    input: 100,
    output: 95,
    unit: "kg",
    incident: "",
  },
  {
    id: "TR-002",
    lotId: "CAC001",
    stage: "Secado",
    responsible: "Operador Demo",
    date: "2026-10-15",
    method: "Secado controlado",
    equipment: "Secador solar",
    input: 95,
    output: 80,
    unit: "kg",
    incident: "",
  },
  {
    id: "TR-003",
    lotId: "CAC002",
    stage: "Fermentación",
    responsible: "Operador Demo",
    date: "2026-10-14",
    method: "Fermentación controlada",
    equipment: "Caja de fermentación",
    input: 120,
    output: 110,
    unit: "kg",
    incident: "",
  },
];

function safeRead(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function number(value) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function calculateMerma(input, output) {
  const inputValue = Number(input) || 0;
  const outputValue = Number(output) || 0;

  if (inputValue <= 0) return 0;

  return ((inputValue - outputValue) / inputValue) * 100;
}

function calculateUnitCost(cost, outputKg) {
  const costValue = Number(cost) || 0;
  const outputValue = Number(outputKg) || 0;

  if (outputValue <= 0) return null;

  return costValue / outputValue;
}

function calculateMargin(price, cost) {
  const priceValue = Number(price) || 0;
  const costValue = Number(cost) || 0;

  if (priceValue <= 0) return null;

  return ((priceValue - costValue) / priceValue) * 100;
}

function createAudit(action, entityId, oldValue, newValue) {
  return {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user: "Administrador Demo",
    date: new Date().toISOString(),
    action,
    entityId,
    oldValue,
    newValue,
  };
}

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("resumen");

  const [lots, setLots] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [audit, setAudit] = useState([]);

  const [originFilter, setOriginFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedLotId, setSelectedLotId] = useState("CAC001");

  const [alertMessage, setAlertMessage] = useState("");

  const [backupMessage, setBackupMessage] = useState("");

  useEffect(() => {
    const savedLots = safeRead(STORAGE.lots, []);

    const savedTransformations = safeRead(
      STORAGE.transformations,
      []
    );

    const savedAudit = safeRead(STORAGE.audit, []);

    setLots(savedLots.length ? savedLots : DEMO_LOTS);
    setTransformations(
      savedTransformations.length
        ? savedTransformations
        : DEMO_TRANSFORMATIONS
    );
    setAudit(savedAudit);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE.lots, JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE.transformations,
      JSON.stringify(transformations)
    );
  }, [transformations]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE.audit, JSON.stringify(audit));
  }, [audit]);

  const selectedLot = useMemo(() => {
    return lots.find((lot) => lot.id === selectedLotId) || null;
  }, [lots, selectedLotId]);

  const selectedTransformations = useMemo(() => {
    if (!selectedLot) return [];

    return transformations
      .filter((item) => item.lotId === selectedLot.id)
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
  }, [selectedLot, transformations]);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesOrigin =
        !originFilter ||
        String(lot.origin)
          .toLowerCase()
          .includes(originFilter.toLowerCase());

      const matchesStatus =
        !statusFilter || lot.status === statusFilter;

      return matchesOrigin && matchesStatus;
    });
  }, [lots, originFilter, statusFilter]);

  const alerts = useMemo(() => {
    return lots
      .map((lot) => {
        const output = Number(lot.outputKg) || 0;

        const merma = calculateMerma(lot.quantity, output);

        return {
          ...lot,
          merma,
          alert: merma > 15,
        };
      })
      .filter((lot) => lot.alert);
  }, [lots]);

  const statistics = useMemo(() => {
    const totalReceived = lots.reduce(
      (sum, lot) => sum + (Number(lot.quantity) || 0),
      0
    );

    const totalOutput = lots.reduce(
      (sum, lot) => sum + (Number(lot.outputKg) || 0),
      0
    );

    const pending = lots.filter(
      (lot) => lot.status === "PENDIENTE"
    ).length;

    const released = lots.filter(
      (lot) => lot.status === "LIBERADO"
    ).length;

    const blocked = lots.filter(
      (lot) => lot.status === "BLOQUEADO"
    ).length;

    return {
      totalLots: lots.length,
      totalReceived,
      totalOutput,
      pending,
      released,
      blocked,
    };
  }, [lots]);

  function addAudit(action, entityId, oldValue, newValue) {
    setAudit((previous) => [
      createAudit(action, entityId, oldValue, newValue),
      ...previous,
    ]);
  }

  function changeStatus(lotId, newStatus) {
    const lot = lots.find((item) => item.id === lotId);

    if (!lot) return;

    if (newStatus === "BLOQUEADO") {
      const reason = window.prompt(
        "Ingrese el motivo del bloqueo:"
      );

      if (!reason || !reason.trim()) {
        return;
      }

      const updatedLot = {
        ...lot,
        status: "BLOQUEADO",
        blockReason: reason.trim(),
      };

      setLots((previous) =>
        previous.map((item) =>
          item.id === lotId ? updatedLot : item
        )
      );

      addAudit(
        "CAMBIO DE ESTADO",
        lotId,
        {
          status: lot.status,
          reason: lot.blockReason || "",
        },
        {
          status: "BLOQUEADO",
          reason: reason.trim(),
        }
      );

      setAlertMessage(
        `${lotId} fue bloqueado correctamente.`
      );

      return;
    }

    const updatedLot = {
      ...lot,
      status: newStatus,
      blockReason:
        newStatus === "LIBERADO"
          ? ""
          : lot.blockReason || "",
    };

    setLots((previous) =>
      previous.map((item) =>
        item.id === lotId ? updatedLot : item
      )
    );

    addAudit(
      "CAMBIO DE ESTADO",
      lotId,
      {
        status: lot.status,
        reason: lot.blockReason || "",
      },
      {
        status: newStatus,
        reason: "",
      }
    );

    setAlertMessage(
      `${lotId} pasó a estado ${newStatus}.`
    );
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Origen",
      "Cantidad recibida",
      "Salida kg",
      "Estado",
      "Costo",
      "Costo unitario",
      "Precio venta",
      "Margen",
    ];

    const rows = filteredLots.map((lot) => {
      const unitCost = calculateUnitCost(
        lot.cost,
        lot.outputKg
      );

      const margin = calculateMargin(
        lot.salePrice,
        unitCost
      );

      return [
        lot.id,
        lot.origin,
        lot.quantity,
        lot.outputKg,
        lot.status,
        lot.cost,
        unitCost ?? "",
        lot.salePrice,
        margin !== null ? `${margin.toFixed(2)}%` : "",
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "mercacao-lotes.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    addAudit(
      "EXPORTACIÓN CSV",
      "SISTEMA",
      "",
      `Se exportaron ${filteredLots.length} registros`
    );
  }

  function createBackup() {
    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      lots,
      transformations,
      audit,
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `mercacao-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    setBackupMessage(
      "Respaldo generado correctamente."
    );
  }

  function restoreBackup(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const backup = JSON.parse(
          loadEvent.target.result
        );

        if (
          !Array.isArray(backup.lots) ||
          !Array.isArray(backup.transformations) ||
          !Array.isArray(backup.audit)
        ) {
          throw new Error("Formato inválido");
        }

        setLots(backup.lots);
        setTransformations(backup.transformations);
        setAudit(backup.audit);

        setBackupMessage(
          `Restauración correcta: ${backup.lots.length} lotes, ${backup.transformations.length} transformaciones.`
        );
      } catch {
        setBackupMessage(
          "No fue posible restaurar el respaldo. El archivo no tiene un formato válido."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  }

  function simulateHour12() {
    const lot = lots.find(
      (item) => item.id === "CAC001"
    );

    if (!lot) {
      setAlertMessage(
        "CAC001 no existe en los registros."
      );
      return;
    }

    const oldStatus = lot.status;

    const updatedLot = {
      ...lot,
      status: "BLOQUEADO",
      blockReason:
        "Incidencia hora 12: reclamo de comprador",
    };

    setLots((previous) =>
      previous.map((item) =>
        item.id === "CAC001"
          ? updatedLot
          : item
      )
    );

    addAudit(
      "INCIDENCIA HORA 12",
      "CAC001",
      {
        status: oldStatus,
      },
      {
        status: "BLOQUEADO",
        reason:
          "Incidencia hora 12: reclamo de comprador",
      }
    );

    setSelectedLotId("CAC001");
    setActiveSection("hora12");
    setAlertMessage(
      "Prueba de regresión aplicada: CAC001 quedó bloqueado."
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h1>Mercacao</h1>
          <span>Administrador</span>
        </div>

        <nav className="admin-nav">
          <button
            className={
              activeSection === "resumen"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("resumen")
            }
          >
            Resumen
          </button>

          <button
            className={
              activeSection === "trazabilidad"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("trazabilidad")
            }
          >
            Trazabilidad
          </button>

          <button
            className={
              activeSection === "alertas"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("alertas")
            }
          >
            Alertas
          </button>

          <button
            className={
              activeSection === "costos"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("costos")
            }
          >
            Costos y margen
          </button>

          <button
            className={
              activeSection === "estados"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("estados")
            }
          >
            Estados
          </button>

          <button
            className={
              activeSection === "auditoria"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("auditoria")
            }
          >
            Auditoría
          </button>

          <button
            className={
              activeSection === "exportar"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("exportar")
            }
          >
            Consulta y CSV
          </button>

          <button
            className={
              activeSection === "hora12"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("hora12")
            }
          >
            Incidencia hora 12
          </button>

          <button
            className={
              activeSection === "backup"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("backup")
            }
          >
            Backup / Restore
          </button>
        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem(
              "mercacao_user"
            );

            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">
              Panel de administración
            </p>

            <h2>
              Control y trazabilidad del cacao
            </h2>
          </div>

          <div className="admin-user">
            <span>Administrador</span>
            <strong>ADMIN</strong>
          </div>
        </header>

        {alertMessage && (
          <div className="system-message">
            {alertMessage}

            <button
              onClick={() => setAlertMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {activeSection === "resumen" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Vista general
                </p>

                <h3>Resumen del sistema</h3>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <span>Lotes</span>
                <strong>
                  {statistics.totalLots}
                </strong>
              </article>

              <article className="stat-card">
                <span>Kg recibidos</span>
                <strong>
                  {number(
                    statistics.totalReceived
                  )}
                </strong>
              </article>

              <article className="stat-card">
                <span>Kg vendibles</span>
                <strong>
                  {number(
                    statistics.totalOutput
                  )}
                </strong>
              </article>

              <article className="stat-card warning">
                <span>Alertas</span>
                <strong>
                  {alerts.length}
                </strong>
              </article>

              <article className="stat-card success">
                <span>Liberados</span>
                <strong>
                  {statistics.released}
                </strong>
              </article>

              <article className="stat-card danger">
                <span>Bloqueados</span>
                <strong>
                  {statistics.blocked}
                </strong>
              </article>
            </div>

            <div className="dashboard-grid">
              <article className="panel">
                <div className="panel-title">
                  <h3>Estados actuales</h3>
                </div>

                <div className="status-list">
                  <div>
                    <span>Pendientes</span>
                    <strong>
                      {statistics.pending}
                    </strong>
                  </div>

                  <div>
                    <span>Liberados</span>
                    <strong>
                      {statistics.released}
                    </strong>
                  </div>

                  <div>
                    <span>Bloqueados</span>
                    <strong>
                      {statistics.blocked}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="panel">
                <div className="panel-title">
                  <h3>Regla de alerta</h3>
                </div>

                <p>
                  La merma se calcula como:
                </p>

                <div className="formula">
                  Merma = ((Entrada − Salida) /
                  Entrada) × 100
                </div>

                <p>
                  Se genera alerta cuando la merma
                  supera el <strong>15 %</strong>.
                </p>
              </article>
            </div>
          </section>
        )}

        {activeSection === "trazabilidad" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU04 · RF03
                </p>

                <h3>
                  Trazabilidad completa
                </h3>
              </div>
            </div>

            <div className="trace-selector">
              <label htmlFor="lot-select">
                Producto / lote
              </label>

              <select
                id="lot-select"
                value={selectedLotId}
                onChange={(event) =>
                  setSelectedLotId(
                    event.target.value
                  )
                }
              >
                {lots.map((lot) => (
                  <option
                    key={lot.id}
                    value={lot.id}
                  >
                    {lot.id} · {lot.origin}
                  </option>
                ))}
              </select>
            </div>

            {selectedLot && (
              <div className="trace-card">
                <div className="trace-header">
                  <div>
                    <span className="lot-code">
                      {selectedLot.id}
                    </span>

                    <h3>
                      Producto terminado
                    </h3>
                  </div>

                  <span
                    className={`status-badge ${selectedLot.status.toLowerCase()}`}
                  >
                    {selectedLot.status}
                  </span>
                </div>

                <div className="trace-origin">
                  <span>Origen</span>
                  <strong>
                    {selectedLot.origin}
                  </strong>

                  <span>Productor</span>
                  <strong>
                    {selectedLot.producer}
                  </strong>

                  <span>Cantidad recibida</span>
                  <strong>
                    {number(
                      selectedLot.quantity
                    )}{" "}
                    {selectedLot.unit}
                  </strong>

                  <span>Salida</span>
                  <strong>
                    {number(
                      selectedLot.outputKg
                    )}{" "}
                    kg
                  </strong>
                </div>

                <div className="timeline">
                  <div className="timeline-item">
                    <span className="timeline-dot" />

                    <div>
                      <small>
                        ORIGEN
                      </small>

                      <h4>
                        Lote recibido
                      </h4>

                      <p>
                        {selectedLot.id} ·{" "}
                        {selectedLot.origin}
                      </p>
                    </div>
                  </div>

                  {selectedTransformations.map(
                    (transformation) => (
                      <div
                        className="timeline-item"
                        key={transformation.id}
                      >
                        <span className="timeline-dot" />

                        <div>
                          <small>
                            ETAPA
                          </small>

                          <h4>
                            {
                              transformation.stage
                            }
                          </h4>

                          <p>
                            Entrada:{" "}
                            {
                              transformation.input
                            }{" "}
                            kg → Salida:{" "}
                            {
                              transformation.output
                            }{" "}
                            kg
                          </p>

                          <p>
                            Método:{" "}
                            {
                              transformation.method
                            }
                          </p>

                          <p>
                            Equipo:{" "}
                            {
                              transformation.equipment
                            }
                          </p>

                          <p>
                            Responsable:{" "}
                            {
                              transformation.responsible
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  <div className="timeline-item final">
                    <span className="timeline-dot" />

                    <div>
                      <small>
                        PRODUCTO
                      </small>

                      <h4>
                        Producto terminado
                      </h4>

                      <p>
                        {number(
                          selectedLot.outputKg
                        )}{" "}
                        kg vendibles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {activeSection === "alertas" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU05 · RF04
                </p>

                <h3>
                  Alertas de merma
                </h3>
              </div>
            </div>

            <div className="rule-card">
              <h4>Regla de decisión</h4>

              <p>
                La alerta aparece cuando la merma
                supera el 15 %.
              </p>

              <div className="formula">
                Merma = ((kg recibidos − kg
                vendibles) / kg recibidos) × 100
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="empty-state">
                No existen alertas de merma.
              </div>
            ) : (
              <div className="alert-list">
                {alerts.map((lot) => (
                  <article
                    className="alert-card"
                    key={lot.id}
                  >
                    <div>
                      <span className="alert-icon">
                        !
                      </span>
                    </div>

                    <div>
                      <h4>
                        {lot.id} · Merma
                        superior al límite
                      </h4>

                      <p>
                        Entrada:{" "}
                        {number(lot.quantity)} kg
                      </p>

                      <p>
                        Salida:{" "}
                        {number(lot.outputKg)} kg
                      </p>

                      <strong>
                        Merma:{" "}
                        {lot.merma.toFixed(2)}%
                      </strong>

                      <small>
                        Regla: alerta si merma
                        &gt; 15%
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "costos" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU06 · HU14
                </p>

                <h3>
                  Costos y margen
                </h3>
              </div>
            </div>

            <div className="cost-grid">
              {lots.map((lot) => {
                const unitCost =
                  calculateUnitCost(
                    lot.cost,
                    lot.outputKg
                  );

                const margin =
                  calculateMargin(
                    lot.salePrice,
                    unitCost
                  );

                return (
                  <article
                    className="cost-card"
                    key={lot.id}
                  >
                    <div className="cost-card-header">
                      <div>
                        <span>
                          {lot.id}
                        </span>

                        <h4>
                          {lot.origin}
                        </h4>
                      </div>

                      <strong>
                        {unitCost !== null
                          ? money(unitCost)
                          : "Sin salida"}
                      </strong>
                    </div>

                    <div className="cost-data">
                      <div>
                        <span>
                          Costo de etapa
                        </span>

                        <strong>
                          {money(lot.cost)}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Kg vendibles
                        </span>

                        <strong>
                          {number(
                            lot.outputKg
                          )}{" "}
                          kg
                        </strong>
                      </div>

                      <div>
                        <span>
                          Precio venta/kg
                        </span>

                        <strong>
                          {money(
                            lot.salePrice
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Margen
                        </span>

                        <strong>
                          {margin !== null
                            ? `${margin.toFixed(
                                2
                              )}%`
                            : "No calculable"}
                        </strong>
                      </div>
                    </div>

                    <div className="formula-box">
                      <strong>
                        Costo unitario
                      </strong>

                      <p>
                        Costo total ÷ kg
                        vendibles
                      </p>

                      <code>
                        {money(lot.cost)} ÷{" "}
                        {number(
                          lot.outputKg
                        )} kg
                      </code>

                      <strong>
                        ={" "}
                        {unitCost !== null
                          ? `${money(
                              unitCost
                            )}/kg`
                          : "No calculable"}
                      </strong>
                    </div>

                    <div className="formula-box">
                      <strong>
                        Margen sobre venta
                      </strong>

                      <p>
                        (Precio − Costo) ÷
                        Precio × 100
                      </p>

                      {margin !== null ? (
                        <code>
                          ({money(
                            lot.salePrice
                          )} −{" "}
                          {money(unitCost)}) ÷{" "}
                          {money(
                            lot.salePrice
                          )} × 100
                        </code>
                      ) : (
                        <code>
                          No calculable con
                          precio 0
                        </code>
                      )}

                      <strong>
                        {margin !== null
                          ? `= ${margin.toFixed(
                              2
                            )}%`
                          : "Sin margen"}
                      </strong>
                    </div>

                    <p className="assumptions">
                      Supuesto: el costo registrado
                      corresponde al costo total de
                      la etapa y la salida representa
                      los kg vendibles.
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeSection === "estados" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU11
                </p>

                <h3>
                  Control de estados
                </h3>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Origen</th>
                    <th>Estado</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {lots.map((lot) => (
                    <tr key={lot.id}>
                      <td>
                        <strong>
                          {lot.id}
                        </strong>
                      </td>

                      <td>
                        {lot.origin}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${lot.status.toLowerCase()}`}
                        >
                          {lot.status}
                        </span>
                      </td>

                      <td>
                        {lot.blockReason ||
                          "—"}
                      </td>

                      <td>
                        <div className="action-group">
                          <button
                            onClick={() =>
                              changeStatus(
                                lot.id,
                                "PENDIENTE"
                              )
                            }
                          >
                            Pendiente
                          </button>

                          <button
                            className="success-button"
                            onClick={() =>
                              changeStatus(
                                lot.id,
                                "LIBERADO"
                              )
                            }
                          >
                            Liberar
                          </button>

                          <button
                            className="danger-button"
                            onClick={() =>
                              changeStatus(
                                lot.id,
                                "BLOQUEADO"
                              )
                            }
                          >
                            Bloquear
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Regla de seguridad</strong>

              <p>
                Estas acciones están disponibles
                únicamente en el panel del
                Administrador. El Operador no debe
                disponer de una acción de liberación.
              </p>
            </div>
          </section>
        )}

        {activeSection === "auditoria" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU12
                </p>

                <h3>
                  Historial de auditoría
                </h3>
              </div>
            </div>

            <div className="audit-list">
              {audit.length === 0 ? (
                <div className="empty-state">
                  Todavía no hay cambios
                  registrados.
                </div>
              ) : (
                audit.map((item) => (
                  <article
                    className="audit-card"
                    key={item.id}
                  >
                    <div className="audit-top">
                      <strong>
                        {item.action}
                      </strong>

                      <span>
                        {new Date(
                          item.date
                        ).toLocaleString(
                          "es-CO"
                        )}
                      </span>
                    </div>

                    <p>
                      Usuario:{" "}
                      <strong>
                        {item.user}
                      </strong>
                    </p>

                    <p>
                      Registro:{" "}
                      <strong>
                        {item.entityId}
                      </strong>
                    </p>

                    <div className="audit-values">
                      <div>
                        <span>
                          Valor anterior
                        </span>

                        <pre>
                          {JSON.stringify(
                            item.oldValue,
                            null,
                            2
                          )}
                        </pre>
                      </div>

                      <div>
                        <span>
                          Valor nuevo
                        </span>

                        <pre>
                          {JSON.stringify(
                            item.newValue,
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="info-box">
              <strong>
                Historial protegido
              </strong>

              <p>
                Esta interfaz no ofrece una acción
                para eliminar registros de auditoría.
              </p>
            </div>
          </section>
        )}

        {activeSection === "exportar" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU13
                </p>

                <h3>
                  Consulta y exportación
                </h3>
              </div>
            </div>

            <div className="filters">
              <div>
                <label htmlFor="origin-filter">
                  Filtrar por origen
                </label>

                <input
                  id="origin-filter"
                  value={originFilter}
                  onChange={(event) =>
                    setOriginFilter(
                      event.target.value
                    )
                  }
                  placeholder="Ej. Rivera"
                />
              </div>

              <div>
                <label htmlFor="status-filter">
                  Filtrar por estado
                </label>

                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  <option value="PENDIENTE">
                    Pendiente
                  </option>

                  <option value="LIBERADO">
                    Liberado
                  </option>

                  <option value="BLOQUEADO">
                    Bloqueado
                  </option>
                </select>
              </div>

              <button
                className="primary-button"
                onClick={exportCSV}
              >
                Descargar CSV
              </button>
            </div>

            <p className="filter-result">
              Registros encontrados:{" "}
              <strong>
                {filteredLots.length}
              </strong>
            </p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Origen</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Estado</th>
                    <th>Costo</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLots.map((lot) => (
                    <tr key={lot.id}>
                      <td>{lot.id}</td>
                      <td>{lot.origin}</td>
                      <td>
                        {number(
                          lot.quantity
                        )}{" "}
                        kg
                      </td>
                      <td>
                        {number(
                          lot.outputKg
                        )}{" "}
                        kg
                      </td>
                      <td>
                        <span
                          className={`status-badge ${lot.status.toLowerCase()}`}
                        >
                          {lot.status}
                        </span>
                      </td>
                      <td>
                        {money(lot.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "hora12" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU15
                </p>

                <h3>
                  Incidencia de la hora 12
                </h3>
              </div>
            </div>

            <div className="hour12-card">
              <div className="hour12-header">
                <span>
                  Prueba de regresión
                </span>

                <strong>
                  CAC001
                </strong>
              </div>

              {(() => {
                const lot = lots.find(
                  (item) =>
                    item.id === "CAC001"
                );

                if (!lot) {
                  return (
                    <p>
                      CAC001 no está disponible.
                    </p>
                  );
                }

                return (
                  <>
                    <div className="hour12-data">
                      <div>
                        <span>
                          Origen
                        </span>

                        <strong>
                          {lot.origin}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cantidad recibida
                        </span>

                        <strong>
                          {number(
                            lot.quantity
                          )}{" "}
                          kg
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cantidad afectada
                        </span>

                        <strong>
                          {number(
                            lot.outputKg
                          )}{" "}
                          kg
                        </strong>
                      </div>

                      <div>
                        <span>
                          Estado
                        </span>

                        <strong>
                          {lot.status}
                        </strong>
                      </div>
                    </div>

                    {lot.blockReason && (
                      <div className="block-reason">
                        <strong>
                          Motivo:
                        </strong>

                        <p>
                          {lot.blockReason}
                        </p>
                      </div>
                    )}

                    <button
                      className="danger-button large"
                      onClick={simulateHour12}
                    >
                      Bloquear CAC001 por
                      incidencia
                    </button>
                  </>
                );
              })()}
            </div>

            <div className="info-box">
              <strong>
                Resultado esperado
              </strong>

              <p>
                CAC001 debe quedar bloqueado,
                conservar Rivera como origen,
                conservar sus cantidades y generar
                un registro de auditoría.
              </p>
            </div>
          </section>
        )}

        {activeSection === "backup" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HU17
                </p>

                <h3>
                  Backup y restauración
                </h3>
              </div>
            </div>

            <div className="backup-grid">
              <article className="backup-card">
                <div className="backup-icon">
                  ↓
                </div>

                <h3>
                  Crear respaldo
                </h3>

                <p>
                  Guarda lotes, transformaciones y
                  auditoría en un archivo JSON.
                </p>

                <button
                  className="primary-button"
                  onClick={createBackup}
                >
                  Descargar respaldo
                </button>
              </article>

              <article className="backup-card">
                <div className="backup-icon">
                  ↑
                </div>

                <h3>
                  Restaurar respaldo
                </h3>

                <p>
                  Recupera identificadores,
                  cantidades, transformaciones y
                  auditoría.
                </p>

                <label className="file-button">
                  Seleccionar respaldo
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={restoreBackup}
                  />
                </label>
              </article>
            </div>

            {backupMessage && (
              <div className="system-message">
                {backupMessage}
              </div>
            )}

            <div className="info-box">
              <strong>
                Verificación
              </strong>

              <p>
                Antes de restaurar se valida que el
                respaldo contenga las colecciones de
                lotes, transformaciones y auditoría.
                Al restaurar, los identificadores y
                cantidades se toman directamente del
                respaldo.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;