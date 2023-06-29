import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfiguracionApp } from 'src/app/modelos/locales/configuracion-app';
import { SessionService } from 'src/app/state/session.service';
import { ClienteView } from '../api/api-promodel';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private httpClient: HttpClient, private session: SessionService) { }

  load() {
    return new Observable((subscriber) => {
      // HTTP Get call
      this.httpClient.get<ConfiguracionApp>(`./config/config.json?_=${new Date().getMilliseconds}`).subscribe(res => {
        this.session.updateConfig(res);
        this.httpClient.get<ClienteView>(`${res.appbaseurl}/clientes/config`).subscribe( c => {
          this.session.actualizaCliente(c);
          subscriber.complete();
        })
      }, error => {
        console.error(error);
        subscriber.error();
      })
    });
  }
}
