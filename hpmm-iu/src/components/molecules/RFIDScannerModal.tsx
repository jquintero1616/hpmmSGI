import React, { useRef, useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Modal from "./GenericModal";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

const RFIDScannerModal: React.FC<Props> = ({ isOpen, onClose, onScan }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const qrScannerRef = useRef<Html5Qrcode>();
  const [isScanning, setIsScanning] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen && qrScannerRef.current && isScanning) {
      qrScannerRef.current.stop().catch(() => {});
      setIsScanning(false);
      setLastCode(null);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const startCamera = () => {
    if (divRef.current && !isScanning) {
      qrScannerRef.current = new Html5Qrcode(divRef.current.id);
      qrScannerRef.current
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 300 },
          (decodedText) => {
            setLastCode(decodedText); 
          },
          () => {}
        )
        .then(() => setIsScanning(true))
        .catch(() => setIsScanning(false));
    }
  };

  const captureNow = () => {
    if (lastCode) {
      onScan(lastCode);
      handleClose();
    } else {
      toast.error("No se detectó ningún código. Asegúrate de que el QR esté visible.");
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current && isScanning) {
      qrScannerRef.current.stop().catch(() => {});
      setIsScanning(false);
      setLastCode(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 24,
          minWidth: 340,
        }}
      >
        <h2 style={{ marginBottom: 12, color: "#2d3748" }}>Escanear RFID/QR</h2>
        <div
          id="rfid-reader"
          ref={divRef}
          style={{
            width: 300,
            height: 300,
            border: "2px dashed #3182ce",
            borderRadius: 12,
            background: "#f7fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        />
        <div style={{ marginBottom: 12, width: "100%", textAlign: "center" }}>
          {isScanning ? (
            lastCode ? (
              <span style={{ color: "#38a169", fontWeight: 600 }}>
                Código detectado: <b>{lastCode}</b>
              </span>
            ) : (
              <span style={{ color: "#718096" }}>
                Apunta el QR a la cámara y presiona <b>Capturar ahora</b>
              </span>
            )
          ) : (
            <span style={{ color: "#a0aec0" }}>
              La cámara está apagada
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center" }}>
          <button
            onClick={startCamera}
            disabled={isScanning}
            style={{
              padding: "8px 16px",
              background: isScanning ? "#e2e8f0" : "#3182ce",
              color: isScanning ? "#a0aec0" : "#fff",
              border: "none",
              borderRadius: 6,
              cursor: isScanning ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            Encender cámara
          </button>
          <button
            onClick={captureNow}
            disabled={!isScanning}
            style={{
              padding: "8px 16px",
              background: !isScanning ? "#e2e8f0" : "#38a169",
              color: !isScanning ? "#a0aec0" : "#fff",
              border: "none",
              borderRadius: 6,
              cursor: !isScanning ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            Capturar ahora
          </button>
          <button
            onClick={stopCamera}
            disabled={!isScanning}
            style={{
              padding: "8px 16px",
              background: !isScanning ? "#e2e8f0" : "#e53e3e",
              color: !isScanning ? "#a0aec0" : "#fff",
              border: "none",
              borderRadius: 6,
              cursor: !isScanning ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            Apagar cámara
          </button>
          <button
            onClick={handleClose}
            style={{
              padding: "8px 16px",
              background: "#edf2f7",
              color: "#2d3748",
              border: "1px solid #cbd5e0",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RFIDScannerModal;