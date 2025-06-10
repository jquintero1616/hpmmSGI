export const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-900 text-purple-200 py-2 w-full text-xs">
      <div className="flex justify-end items-center px-4">
        <span className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-right">
          <span>
            © {new Date().getFullYear()} HPMM · Sistema de Inventario · v1.0.0
          </span>
          <a
            href="mailto:soporte@hpmm.com"
            className="underline hover:text-white transition"
          >
            soporte@hpmm.com
          </a>
        </span>
      </div>
    </footer>
  );
};
