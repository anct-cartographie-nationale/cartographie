import '@/styles/globals.css';
import r2wc from '@r2wc/react-to-web-component';
import { App } from './app';

customElements.define('cartographie-inclusion-numerique', r2wc(App));
