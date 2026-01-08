import type { FC } from 'react';
import { Route, Switch } from 'wouter';
import { WebComponentLayout } from './layout';
import { AuvergneRhoneAlpesPage } from './pages/auvergne-rhone-alpes.page';
import { HomePage } from './pages/home.page';

export const App: FC = () => (
  <WebComponentLayout>
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/auvergne-rhone-alpes' component={AuvergneRhoneAlpesPage} />
      <Route>Page non trouvée</Route>
    </Switch>
  </WebComponentLayout>
);
