import PropTypes from "prop-types";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md animate-pop rounded-3xl border border-white/60 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold tracking-tight">{title}</h2><button onClick={onClose} aria-label="Tutup" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">✕</button></div>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
