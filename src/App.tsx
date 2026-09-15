import { useCallback, useEffect, useRef, useState } from 'react';
import { Boot } from './os/Boot';
import { Desktop } from './os/Desktop';
import { MobileShell } from './os/MobileShell';
import { Wallpaper } from './os/Wallpaper';
import { useOS } from './os/store';
import { useMediaQuery, modKey } from './lib/hooks';

export default function App() {
  const os = useOS();
  const mobile = useMediaQuery('(max-width: 760px), (pointer: coarse) and (max-width: 1024px) and (orientation: portrait)');
  const [booting, setBooting] = useState(() => !sessionStorage.getItem('mikail.os:booted'));
  const firstBoot = useRef(os.bootCount);

  useEffect(() => {
    if (os.bootCount !== firstBoot.current) setBooting(true);
  }, [os.bootCount]);

  const done = useCallback(() => {
    sessionStorage.setItem('mikail.os:booted', '1');
    setBooting(false);
    setTimeout(
      () =>
        os.notify({
          title: 'Welcome to mikail.os',
          body: mobile ? 'Tap an app to open it. Swipe up on the bar to go home.' : `Double-click an icon, or press ${modKey}K to search everything.`,
        }),
      500,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  return (
    <>
      <Wallpaper />
      {!booting && (mobile ? <MobileShell /> : <Desktop />)}
      {booting && <Boot onDone={done} />}
    </>
  );
}
