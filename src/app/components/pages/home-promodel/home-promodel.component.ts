import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-promodel',
  templateUrl: './home-promodel.component.html',
  styleUrls: ['./home-promodel.component.scss'],
})
export class HomePromodelComponent implements OnInit {
  constructor(
        private router: Router
  ) {}

  ngOnInit() {}

  paginaRegistro(){
    this.router.navigateByUrl('/registro');
  }
  paginaLogin(){
    this.router.navigateByUrl('/login');
  }
}
