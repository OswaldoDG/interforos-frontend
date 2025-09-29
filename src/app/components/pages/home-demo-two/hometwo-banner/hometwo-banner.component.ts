import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hometwo-banner',
    templateUrl: './hometwo-banner.component.html',
    styleUrls: ['./hometwo-banner.component.scss']
})
export class HometwoBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        this.resetOption = [this.options[0]];
    }

    bannerContent = [
        {
            title: 'Interforos Casting',
            paragraph: 'En busca de talento',
            linkLabel: 'Nuestro trabajo',
            linkUrl: '/proyectos/videos',
            popularSearchList: [
                // {
                //     title: 'Televisión',
                //     link: 'grid-listings-left-sidebar'
                // },
                // {
                //     title: 'Cine',
                //     link: 'grid-listings-left-sidebar'
                // },
                // {
                //     title: 'Carteleras',
                //     link: 'grid-listings-left-sidebar'
                // },
                // {
                //     title: 'Revistas',
                //     link: 'grid-listings-left-sidebar'
                // }
            ]
        }
    ]
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

}
