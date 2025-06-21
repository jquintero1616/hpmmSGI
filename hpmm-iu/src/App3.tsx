import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Transaction {
  code: string;
  type: 'entrada' | 'salida';
  time: string;
}

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const qrScannerRef = useRef<Html5Qrcode>();
  const [isScanning, setIsScanning] = useState(false);
  const [lastDecoded, setLastDecoded] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Inicializar el scanner una sola vez
  useEffect(() => {
    if (divRef.current) {
      qrScannerRef.current = new Html5Qrcode(divRef.current.id);
    }
    return () => { safeStop(); };
  }, []);

  // Parar el scanner de forma segura
  const safeStop = useCallback(async () => {
    if (qrScannerRef.current && isScanning) {
      try { await qrScannerRef.current.stop(); }
      catch { /* ya estaba parado */ }
      finally {
        setIsScanning(false);
        setLastDecoded(null);
      }
    }
  }, [isScanning]);

  // Arranca el escáner, pero NO lo detiene en el callback
  const handleStartScan = async () => {
    if (!qrScannerRef.current || isScanning) return;
    setLastDecoded(null);
    try {
      await qrScannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        decodedText => {
          console.log('🟢 Detectado:', decodedText);
          setLastDecoded(decodedText);
        },
        _err => {}
      );
      setIsScanning(true);
    } catch (err) {
      console.error('❌ No pude arrancar el scanner:', err);
    }
  };

  // Capturar el texto y registrar como transacción
  const handleCapture = () => {
    if (!lastDecoded) return;
    setScannedText(lastDecoded);
    safeStop();
  };

  // Registrar entrada o salida en el histórico
  const handleRegister = (type: 'entrada' | 'salida') => {
    if (!scannedText) return;
    const newTrans: Transaction = {
      code: scannedText,
      type,
      time: new Date().toLocaleString(),
    };
    setTransactions(prev => [newTrans, ...prev]);
    setScannedText(null);
  };

  // Lectura NFC (sin cambios)
  const handleScanNfc = async () => {
    if (!('NDEFReader' in window)) {
      console.warn('⚠️ Web NFC no disponible aquí.');
      return;
    }
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      console.log('🔍 NFC listo: acerca tu tag…');
      ndef.onreading = (evt: any) => {
        for (const rec of evt.message.records) {
          console.log('📡 NFC:', new TextDecoder().decode(rec.data));
        }
      };
    } catch (err) {
      console.error('❌ Error en Web NFC:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📱 Prueba Scanner Móvil + Kardex</h1>

      <button onClick={handleStartScan} disabled={isScanning} style={{ marginRight: '1rem' }}>
        {isScanning ? '⌛ Escaneando…' : '🔍 Iniciar escaneo'}
      </button>

      {isScanning && (
        <button onClick={handleCapture} disabled={!lastDecoded} style={{ marginRight: '1rem' }}>
          ✅ Capturar
        </button>
      )}

      <button onClick={handleScanNfc}>📡 Leer NFC</button>

      <div
        id="reader"
        ref={divRef}
        style={{ width: 300, height: 300, border: '2px dashed #888', marginTop: '1rem' }}
      />

      {scannedText && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '1.2rem' }}>
            🎉 <strong>Escaneado:</strong> {scannedText}
          </p>
          <button onClick={() => handleRegister('entrada')} style={{ marginRight: '1rem' }}>
            📥 Registrar Entrada
          </button>
          <button onClick={() => handleRegister('salida')}>
            📤 Registrar Salida
          </button>
        </div>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h2>📋 Historial de Transacciones</h2>
        {transactions.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>Sin transacciones registradas.</p>
        ) : (
          <ul>
            {transactions.map((t, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>
                <strong>{t.type === 'entrada' ? 'Entrada' : 'Salida'}:</strong> {t.code} <em>({t.time})</em>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default App;
