import { Component, OnInit } from '@angular/core';
import {
  CastingClient,
  CastingListElement,
} from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-hometwo-events',
  templateUrl: './hometwo-events.component.html',
  styleUrls: ['./hometwo-events.component.scss'],
})
export class HometwoEventsComponent implements OnInit {
  castingsActuales: CastingListElement[] = [];
  castingPrincipal = {} as CastingListElement;
  hayCasting = false;
  constructor(private castingClient: CastingClient) {}

  ngOnInit(): void {
    this.castingClient.actuales().subscribe((data) => {
      if (data.length > 0) {
        this.castingsActuales = data.slice(1, data.length);
        this.castingPrincipal = data[0];
        this.hayCasting = true;
        console.log(data);
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
}
