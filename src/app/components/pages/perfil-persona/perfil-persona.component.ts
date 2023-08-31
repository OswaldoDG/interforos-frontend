import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-persona',
  templateUrl: './perfil-persona.component.html',
  styleUrls: ['./perfil-persona.component.scss'],
})
export class PerfilPersonaComponent  {

  pageTitleContent = [
    {
      title: 'Mi Perfil',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];
}
