import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-galeria-persona',
  templateUrl: './galeria-persona.component.html',
  styleUrls: ['./galeria-persona.component.scss']
})
export class GaleriaPersonaComponent implements OnInit {
  pageTitleContent = [
    {
      title: 'Mi Perfil',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
