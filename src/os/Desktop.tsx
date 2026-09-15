import { AppBody } from "../apps/registry";
import { BootScreen } from "./BootScreen";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { MobileHome } from "./MobileHome";
import { ContextMenu, Dialog, Toast } from "./Overlays";
import { Spotlight } from "./Spotlight";
import { Wallpaper } from "./Wallpaper";
import { WindowFrame } from "./Window";
import { useOS } from "./OSContext";

export function Desktop() {
  const { wallpaper, windows, selectIcons, setContext, setHeliosMenu, setClock, booted } =
    useOS();

  return (
    <div
      className="os"
      onPointerDown={() => {
        selectIcons([]);
        setContext(null);
        setHeliosMenu(false);
        setClock(false);
      }}
      onContextMenu={(e) => {
        const t = e.target as HTMLElement;
        if (t.closest(".window, .sheet, .dock, .menubar, .spotlight, .ctx")) return;
        e.preventDefault();
        setContext({ x: e.clientX, y: e.clientY });
      }}
    >
      <Wallpaper id={wallpaper} />
      <MenuBar />
      <DesktopIcons />
      <MobileHome />
      {windows.map((w) => (
        <WindowFrame key={w.id} win={w}>
          <AppBody id={w.appId} />
        </WindowFrame>
      ))}
      <Dock />
      <Spotlight />
      <ContextMenu />
      <Dialog />
      <Toast />
      {!booted && <BootScreen />}
    </div>
  );
}
