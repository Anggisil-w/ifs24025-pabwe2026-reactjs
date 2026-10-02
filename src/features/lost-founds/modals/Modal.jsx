export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Tutup" className="text-slate-500">✕</button></div>
        {children}
      </div>
    </div>
  );
}