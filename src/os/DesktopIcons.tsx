import { IconFor } from "../apps/icons";
import { DESKTOP_ICONS } from "../data/content";
import { cx } from "../lib/cx";
import { useOS } from "./OSContext";

export function DesktopIcons() {
  const { openApp, selectedIcons, selectIcons, setContext, isMobile, trashEmptied } = useOS();
  if (isMobile) return null;

  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.filter((i) => i.id !== "trash").map((icon) => {
        const selected = selectedIcons.includes(icon.id);
        return (
          <button
            key={icon.id}
            type="button"
            className={cx("desk-icon", selected && "is-selected")}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (e.metaKey || e.ctrlKey) {
                selectIcons(
                  selected
                    ? selectedIcons.filter((id) => id !== icon.id)
                    : [...selectedIcons, icon.id],
                );
              } else selectIcons([icon.id]);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(icon.app);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              selectIcons([icon.id]);
              setContext({ x: e.clientX, y: e.clientY, icon: icon.id });
            }}
          >
            <IconFor id={icon.id} />
            <span>{icon.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className={cx(
          "desk-icon trash-corner",
          selectedIcons.includes("trash") && "is-selected",
        )}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          selectIcons(["trash"]);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          openApp("trash");
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          selectIcons(["trash"]);
          setContext({ x: e.clientX, y: e.clientY, icon: "trash" });
        }}
      >
        <IconFor id="trash" empty={trashEmptied} />
        <span>Trash</span>
      </button>
    </div>
  );
}
