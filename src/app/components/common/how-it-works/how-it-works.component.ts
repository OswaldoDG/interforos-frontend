import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: '¿Cómo funciona?',
            paragraph: 'Forma parte de nuestro talento y deja que Intereforos se ocupe de encontrar un papel para ti.'
        }
    ]
    howItWorksBox = [
        {
            icon: 'flaticon-support-1',
            title: 'Inscríbete en nuestro portal',
            paragraph: 'Detalla tus características físicas y las habilidades o destrezas al inscribirte en el portal.'
        },
        {
            icon: 'flaticon-placeholder',
            title: 'Búsqueda de oportunidades',
            paragraph: 'Interforos promoverá a su talento con todos sus clientes y publicará ofertas que podrían interesarte.'
        },
        {
            icon: 'flaticon-tick',
            title: 'Participa en los casting',
            paragraph: 'Participa en los castings y tu esfuerzo se verá recompensado, no pierdas la oportunidad.'
        }
    ]

}
