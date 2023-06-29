import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { sessionPersistStorage } from './app/state/session.store';

if (environment.production) {
  enableAkitaProdMode();
  enableProdMode();
}

// const storage = persistState();
const providers = [{ provide: 'persistStorage', useValue: sessionPersistStorage, multi: true }];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
