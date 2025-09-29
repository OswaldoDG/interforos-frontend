import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  private destroy$ = new Subject();
  autenticado: boolean = false;
  idiomaActual = '';
  contenidoActual: any = null;
  tituloActual: any = null;
  sectionTitle = [
      {
          title: '¿Quiénes somos?',
          i: 'es-mx'
      },
      {
          title: 'Who are we?',
          i: 'en-us'
      }
  ]

  howItWorksBox = [
    {
      icon: 'flaticon-hotel',
      i: 'es-mx',
      p: 'Interforos Casting es una empresa con más de 25 años de experiencia en la industria, especializada en proveer a casas productoras y marcas una cartera amplia y diversa de talentos. Nuestro equipo profesional en dirección de casting, edición y coordinación garantiza un servicio integral, ágil y de alta calidad, respaldado por una sólida trayectoria de excelencia y compromiso.'
    },
    {
      icon: 'flaticon-hotel',
      i: 'en-us',
      p: 'Interforos Casting is a company with over 25 years of experience in the industry, specializing in providing production houses and brands with a broad and diverse portfolio of talent. Our professional team in casting direction, editing, and talent coordination ensures a comprehensive, efficient, and high-quality service, backed by a solid track record of excellence and commitment.'
    }
  ]
  constructor(
        private router: Router,
        private query: SessionQuery,
  ) {
  }

  ngOnInit(): void {
    this.query.autenticado$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.autenticado = u;
    });

    this.idiomaActual = this.query.Idioma;
    console.log(this.idiomaActual);
    this.contenidoActual = this.howItWorksBox.find(c => c.i === this.idiomaActual);
    this.tituloActual = this.sectionTitle.find(t => t.i === this.idiomaActual);
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