import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sin-acceso',
  templateUrl: './sin-acceso.component.html',
  styleUrls: ['./sin-acceso.component.scss'],
})
export class SinAccesoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  pageTitleContent = [
    {
      title: '404 Error Page',
      backgroundImage: 'assets/img/page-title/page-title3.jpg',
    },
  ];
  errorContent = [
    {
      img: 'assets/img/profile-not-found.png',
      title: 'Sin Acceso',
      paragraph: 'No tines acceso para ingresar a esta pagina',
    },
  ];
}
