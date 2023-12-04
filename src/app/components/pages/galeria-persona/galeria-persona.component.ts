import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-galeria-persona',
  templateUrl: './galeria-persona.component.html',
  styleUrls: ['./galeria-persona.component.scss']
})
export class GaleriaPersonaComponent implements OnInit {
  pageTitleContent = [
    {
      title: '',
      backgroundImage: '',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
