import { setWorkerUrl } from 'maplibre-gl';
import workerSource from 'maplibre-gl/dist/maplibre-gl-worker.mjs?raw';

setWorkerUrl(URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })));
