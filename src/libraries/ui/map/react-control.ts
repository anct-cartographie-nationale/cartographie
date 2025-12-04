import { type ReactNode, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useControl } from 'react-map-gl/maplibre';

type ReactControlProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children: ReactNode;
};

export const ReactControl = ({ position = 'top-right', children }: ReactControlProps) => {
  const rootRef = useRef<ReactDOM.Root | null>(null);
  useControl(
    () => ({
      onAdd() {
        const container = document.createElement('div');
        container.className = 'maplibregl-ctrl';

        if (!rootRef.current) {
          rootRef.current = ReactDOM.createRoot(container);
          rootRef.current.render(children);
        }

        return container;
      },
      onRemove() {}
    }),
    { position }
  );

  return null;
};
