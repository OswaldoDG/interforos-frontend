import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {
    sectionTitle: any;
    howItWorksBox: any[] = [];

    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
        this.cargarTraducciones();
        this.translate.onLangChange.subscribe(() => {
            this.cargarTraducciones();
        });
    }

    cargarTraducciones(){
        this.translate.get('howItWorks').subscribe((res) => {
            this.sectionTitle = [res.sectionTitle];
            this.howItWorksBox = res.steps;
        });
    }

}
