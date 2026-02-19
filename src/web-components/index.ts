import '@/styles/globals.css';
import r2wc from '@r2wc/react-to-web-component';
import { App } from './app';

customElements.define(
  'cartographie-inclusion-numerique',
  r2wc(App, {
    props: {
      apiUrl: 'string',
      logoUrl: 'string',
      appName: 'string',
      helpUrl: 'string',
      helpLabel: 'string',
      latitude: 'number',
      longitude: 'number',
      zoom: 'number',
      territoireType: 'string',
      territoires: 'string',
      routeInitiale: 'string'
    }
  })
);
