
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-container">

          <div className="brand">
            {/*<div className="brand-icon">🍫</div>*/}

            <div>
              <h2>CacaoTrace</h2>
              <span>Huila</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#trazabilidad">Trazabilidad</a>
            <a href="#beneficios">Beneficios</a>
          </nav>

          <a href="/login" className="nav-button"> Ingresar</a>
          <a href="/login" className="nav-button"> Registrarse</a>

        </div>
      </header>


      
      <main>

        <section id="inicio" className="hero-section">

          <div className="hero-content">

            <h1>
              Del origen
              <br />
              <span>al producto.</span>
            </h1>

            <p>
              CacaoTrace Huila permite conocer el recorrido del cacao
              desde su origen hasta su transformación, fortaleciendo
              la transparencia y el control de cada lote.
            </p>

            <div className="hero-buttons">
              <a href="/login" className="primary-button">
                Comenzar ahora →
              </a>

              <a href="#trazabilidad" className="secondary-button">
                Conocer el proyecto
              </a>
            </div>

          </div>


          <div className="hero-visual">

            <div className="hero-card">

              <div className="cacao-icon">
                🍫
              </div>

              <div>
                <span className="card-label">
                  LOTE TRAZABLE
                </span>

                <h3>CAC001</h3>

                <p>
                  📍 Rivera, Huila
                </p>
              </div>

              <div className="status-badge">
                ✓ Liberado
              </div>

            </div>


            <div className="trace-line">

              <div className="trace-item">
                <div className="trace-number">01</div>

                <div>
                  <strong>Origen</strong>
                  <span>Productor · Rivera</span>
                </div>
              </div>


              <div className="trace-item">
                <div className="trace-number">02</div>

                <div>
                  <strong>Transformación</strong>
                  <span>Procesamiento del cacao</span>
                </div>
              </div>


              <div className="trace-item">
                <div className="trace-number">03</div>

                <div>
                  <strong>Producto</strong>
                  <span>Listo para comercialización</span>
                </div>
              </div>

            </div>

          </div>

        </section>


        {}

        <section id="nosotros" className="info-section">

          <div className="section-header">

            <span className="section-tag">
              NUESTRA PROPUESTA
            </span>

            <h2>
              Una historia que se puede
              <span> verificar.</span>
            </h2>

            <p>
              Centralizamos la información de cada lote para facilitar
              el control interno y ofrecer al comprador una visión
              clara del recorrido del producto.
            </p>

          </div>


          <div className="feature-grid">

            <article className="feature-card">

              <div className="feature-icon">
                🌱
              </div>

              <h3>Origen</h3>

              <p>
                Identifica el productor, municipio y fecha de recepción
                de cada lote.
              </p>

            </article>


            <article className="feature-card">

              <div className="feature-icon">
                🔄
              </div>

              <h3>Transformación</h3>

              <p>
                Registra las diferentes etapas del proceso agroindustrial
                y sus responsables.
              </p>

            </article>


            <article className="feature-card">

              <div className="feature-icon">
                📊
              </div>

              <h3>Control</h3>

              <p>
                Consulta cantidades, mermas, costos y estados asociados
                a cada lote.
              </p>

            </article>

          </div>

        </section>


        {}

        <section id="trazabilidad" className="trace-section">

          <div className="trace-content">

            <span className="section-tag">
              TRAZABILIDAD
            </span>

            <h2>
              Todo el recorrido
              <br />
              <span>en un solo lugar.</span>
            </h2>

            <p>
              Cada lote cuenta con una historia digital que permite
              consultar su origen, transformación y estado.
            </p>

            <a href="/login" className="primary-button">
              Explorar trazabilidad →
            </a>

          </div>


          <div className="trace-demo">

            <div className="demo-header">
              <span>Ficha del lote</span>
              <strong>CAC001</strong>
            </div>

            <div className="demo-row">
              <span>Origen</span>
              <strong>Rivera, Huila</strong>
            </div>

            <div className="demo-row">
              <span>Cantidad inicial</span>
              <strong>100 kg</strong>
            </div>

            <div className="demo-row">
              <span>Salida vendible</span>
              <strong>80 kg</strong>
            </div>

            <div className="demo-row">
              <span>Merma</span>
              <strong className="warning">20%</strong>
            </div>

            <div className="demo-status">
              ✓ Lote liberado
            </div>

          </div>

        </section>


        {}

        <section id="beneficios" className="benefits-section">

          <div className="section-header">

            <span className="section-tag">
              BENEFICIOS
            </span>

            <h2>
              Información clara para
              <span> mejores decisiones.</span>
            </h2>

          </div>


          <div className="benefits-grid">

            <div>
              <strong>01</strong>
              <h3>Mayor transparencia</h3>
              <p>
                Consulta información relevante del recorrido del producto.
              </p>
            </div>

            <div>
              <strong>02</strong>
              <h3>Mejor control</h3>
              <p>
                Mantén un registro centralizado de lotes y transformaciones.
              </p>
            </div>

            <div>
              <strong>03</strong>
              <h3>Información verificable</h3>
              <p>
                Facilita al comprador conocer el origen y proceso del cacao.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand">
              

              <div>
                <h2>CacaoTrace</h2>
                <span>Huila</span>
              </div>
            </div>

          </div>


          <div className="footer-column">

            <h4>Proyecto</h4>

            <a href="#inicio">Inicio</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#trazabilidad">Trazabilidad</a>
            <a href="#beneficios">Beneficios</a>

          </div>


          <div className="footer-column">

            <h4>Sistema</h4>

            <a href="/login">Iniciar sesión</a>
            <a href="/login">Registrarse</a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 CacaoTrace Huila
          </span>

          <span>
            Proyecto académico · DEVURITY
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;