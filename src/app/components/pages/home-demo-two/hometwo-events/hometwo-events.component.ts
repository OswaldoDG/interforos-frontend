import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hometwo-events',
    templateUrl: './hometwo-events.component.html',
    styleUrls: ['./hometwo-events.component.scss']
})
export class HometwoEventsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'Eventos próximos',
            paragraph: 'lista de eventos que tenemos para tí, no olvides inscribirte vía nuestro portal, si tienes alguna duda contáctanos.'
        }
    ]
    eventsBox = [
        {
            img: 'assets/img/events/events-big.jpg',
            title: 'Banco del Sol Summit & Festival',
            date: 'Sab, Jul 30, 11:30 am - 10:00 pm',
            link: 'single-events'
        }
    ]
    singleEventsBox = [
        {
            img: 'assets/img/events/events1x.jpg',
            title: 'Pasarela naútica Campeche',
            date: 'Sab, Jul 30, 11:30 am - 10:00 pm',
            link: 'single-events'
        },
        {
            img: 'assets/img/events/events2x.jpg',
            title: 'Anuncio baile latino',
            date: 'Mie, Jul 29, 11:30 am - 10:00 pm',
            link: 'single-events'
        },
        {
            img: 'assets/img/events/events3x.jpg',
            title: 'Catálogo modas PH',
            date: 'Jue, Jul 28, 11:30 am - 10:00 pm',
            link: 'single-events'
        }
    ]

}