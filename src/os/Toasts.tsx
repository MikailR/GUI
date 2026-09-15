import { useOS } from './store';
import { AppIcon, Logo } from './icons';

export function Toasts() {
  const { toasts, dismissToast, open } = useOS();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast glass"
          role="status"
          onClick={() => {
            if (t.app) open(t.app);
            dismissToast(t.id);
          }}
        >
          <div className="toast__icon">{t.app ? <AppIcon app={t.app} size={34} /> : <Logo size={30} />}</div>
          <div className="toast__text">
            <div className="toast__head">
              <strong>{t.title}</strong>
              <span>now</span>
            </div>
            <p>{t.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
