import type { AppId } from "../types";
import { useOS } from "./OSContext";

function appFromIcon(icon: string): AppId {
  if (icon === "readme") return "writing";
  return icon as AppId;
}

export function ContextMenu() {
  const { contextMenu, setContext, openApp, setWallpaper, reboot, askEmptyTrash } = useOS();
  if (!contextMenu) return null;
  const { x, y, icon } = contextMenu;
  const style = { left: Math.min(x, window.innerWidth - 220), top: Math.min(y, window.innerHeight - 220) };

  return (
    <div className="ctx-scrim" onMouseDown={() => setContext(null)}>
      <ul className="ctx" style={style} onMouseDown={(e) => e.stopPropagation()}>
        {icon ? (
          <>
            <li>
              <button
                type="button"
                onClick={() => {
                  openApp(appFromIcon(icon));
                  setContext(null);
                }}
              >
                Open
              </button>
            </li>
            {icon === "trash" && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    askEmptyTrash();
                    setContext(null);
                  }}
                >
                  Empty Trash…
                </button>
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              <button type="button" onClick={() => { openApp("about"); setContext(null); }}>
                About this machine
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setWallpaper("helios"); setContext(null); }}>
                Wallpaper · Helios
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setWallpaper("polar"); setContext(null); }}>
                Wallpaper · Polar
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setWallpaper("noir"); setContext(null); }}>
                Wallpaper · Noir
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { reboot(); setContext(null); }}>
                Restart
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export function Dialog() {
  const { dialog, confirmDialog, cancelDialog } = useOS();
  if (!dialog) return null;
  return (
    <div className="modal-scrim" onMouseDown={cancelDialog}>
      <div className="modal" role="alertdialog" aria-labelledby="dlg-t" onMouseDown={(e) => e.stopPropagation()}>
        <h3 id="dlg-t">{dialog.title}</h3>
        <p>{dialog.body}</p>
        <div className="modal-actions">
          <button type="button" onClick={cancelDialog}>
            Cancel
          </button>
          <button type="button" className={dialog.danger ? "danger" : undefined} onClick={confirmDialog}>
            {dialog.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast, isMobile, windows, focusedId } = useOS();
  if (!toast) return null;
  const sheetOpen = isMobile && windows.some((w) => w.id === focusedId && !w.minimized);
  if (sheetOpen) return null;
  const text = isMobile
    ? toast.replace("⌘ Space opens Spotlight.", "Tap an app to open.")
    : toast;
  return <div className="toast">{text}</div>;
}
