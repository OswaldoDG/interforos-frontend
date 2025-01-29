import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-home-promodel',
  templateUrl: './home-promodel.component.html',
  styleUrls: ['./home-promodel.component.scss'],
})
export class HomePromodelComponent implements OnInit {
  private destroy$ = new Subject();
  autenticado: boolean = false;
  constructor(
        private router: Router,
        private query: SessionQuery,
  ) {}

  ngOnInit(): void {
    this.query.autenticado$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.autenticado = u;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  paginaRegistro(){
    this.router.navigateByUrl('/registro');
  }
  paginaLogin(){
    this.router.navigateByUrl('/login');
  }
}
