import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-hometwo-banner',
    templateUrl: './hometwo-banner.component.html',
    styleUrls: ['./hometwo-banner.component.scss']
})
export class HometwoBannerComponent implements OnInit {
    animacionPalabras: string[] = [];
    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
        this.resetOption = [this.options[0]];
        this.cargarPalabrasTraducidas();
        this.translate.onLangChange.subscribe(() => {
            this.cargarPalabrasTraducidas();
        });
    }
    bannerImage = [
        {
            img: 'assets/img/banner-inicial.png'
        }
    ]

    // Category Select
    singleSelect: any = [];
    multiSelect: any = [];
    stringArray: any = [];
    objectsArray: any = [];
    resetOption: any;
    config = {
        displayKey: "name",
        search: true
    };
    options = [
        // Type here your category name
        {
            name: "Televisión",
        },
        {
            name: "Cine",
        },
        {
            name: "Carteleras",
        },
        {
            name: "Revistas",
        }
    ];
    searchChange($event) {
        console.log($event);
    }
    reset() {
        this.resetOption = [];
    }
    cargarPalabrasTraducidas(){
        this.translate.get('animacion.palabras').subscribe((palabras: string[]) => {this.animacionPalabras = palabras});
    }

}
