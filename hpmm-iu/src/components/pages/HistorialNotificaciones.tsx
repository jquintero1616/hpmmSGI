import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";

const HistorialNotificaciones = () => {
  const { userId } = useAuth();
  const { notificaciones } = useNotificacion();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Historial de notificaciones</h2>
      {notificaciones
        .filter(n => n.id_user === userId)
        .map(noti => (
          <div
            key={noti.id_noti}
            className={`p-3 mb-2 rounded ${
              noti.estado ? "bg-blue-50" : "bg-gray-100"
            }`}
          >
            <div className="font-semibold">{noti.mensaje}</div>
            <div className="text-xs text-gray-500">
              Estado: {noti.estado ? "Activa" : "Inactiva"}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistorialNotificaciones;