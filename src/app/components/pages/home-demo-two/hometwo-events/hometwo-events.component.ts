import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CastingClient,
  CastingListElement,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-hometwo-events',
  templateUrl: './hometwo-events.component.html',
  styleUrls: ['./hometwo-events.component.scss'],
})
export class HometwoEventsComponent implements OnInit {
  castingsActuales: CastingListElement[] = [];
  castingPrincipal = {} as CastingListElement;
  hayCasting = false;
  constructor(private castingClient: CastingClient, private ruta: Router) {}

  ngOnInit(): void {
    this.castingClient.actuales().subscribe((data) => {
      if (data.length > 0) {
        this.castingsActuales = data.slice(1, data.length);
        this.castingPrincipal = data[0];
        this.hayCasting = true;
      }
    });
  }
  sectionTitle = [
    {
      title: 'Eventos próximos',
      paragraph:
        'lista de eventos que tenemos para tí, no olvides inscribirte vía nuestro portal, si tienes alguna duda contáctanos.',
    },
  ];
  public irCasting(id: string) {
    this.ruta.navigateByUrl('casting/' + id + '/actual');
    //this.ruta.navigateByUrl('casting/' + id);
  }
}
