import type { FC } from 'react';
import { Route, Switch } from 'wouter';
import { provide } from '@/libraries/injection';
import { API_BASE_URL } from './api/api-base-url.key';
import { WebComponentLayout } from './layout';
import { AuvergneRhoneAlpesPage } from './pages/auvergne-rhone-alpes.page';
import { HomePage } from './pages/home.page';

type AppProps = {
  apiUrl?: string;
};

export const App: FC<AppProps> = ({ apiUrl = '' }) => {
  provide(API_BASE_URL, apiUrl);

  return (
    <WebComponentLayout>
      <Switch>
        <Route path='/' component={HomePage} />
        <Route path='/auvergne-rhone-alpes' component={AuvergneRhoneAlpesPage} />
        <Route>Page non trouvée</Route>
      </Switch>
    </WebComponentLayout>
  );
};
