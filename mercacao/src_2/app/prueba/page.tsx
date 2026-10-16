import { verificarConexion } from '@/actions/prueba';

export default async function PruebaPage() {
  const resultado = await verificarConexion();

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Prueba de conexión a Supabase 🚀</h1>
      
      {resultado.exito ? (
        <div style={{ padding: '20px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', marginTop: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>✅ ¡Conexión Exitosa!</h2>
          <p>Tu proyecto Next.js está conectado correctamente a tu base de datos en la nube.</p>
          <p><strong>Datos encontrados en la tabla "lotes":</strong></p>
          <pre style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
            {JSON.stringify(resultado.datos, null, 2)}
          </pre>
          <p><small>(Si salen corchetes vacíos <code>[]</code>, es porque la conexión funciona pero la tabla aún no tiene registros, ¡lo cual es correcto!)</small></p>
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginTop: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>❌ Error de conexión</h2>
          <p>Hubo un problema al conectar. Revisa tu archivo .env.local y asegúrate de haber reiniciado el servidor.</p>
          <p><strong>Detalle del error:</strong> {resultado.mensaje}</p>
        </div>
      )}
    </div>
  );
}