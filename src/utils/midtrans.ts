let snapPromise: Promise<void> | null = null;

function attachExistingScriptListeners(
  script: Element,
  resolve: () => void,
  reject: (err: Error) => void,
): void {
  script.addEventListener('load', () => resolve(), { once: true });
  script.addEventListener(
    'error',
    () => {
      snapPromise = null;
      reject(new Error('Snap load failed'));
    },
    { once: true },
  );
}

export function loadSnapScript(): Promise<void> {
  if (snapPromise) return snapPromise;
  snapPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('midtrans-snap');
    if (existing) {
      if (window.snap) {
        resolve();
        return;
      }
      attachExistingScriptListeners(existing, resolve, reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap';
    script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL as string;
    script.setAttribute(
      'data-client-key',
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string,
    );
    script.onload = () => resolve();
    script.onerror = () => {
      snapPromise = null;
      reject(new Error('Snap load failed'));
    };
    document.head.appendChild(script);
  });
  return snapPromise;
}
