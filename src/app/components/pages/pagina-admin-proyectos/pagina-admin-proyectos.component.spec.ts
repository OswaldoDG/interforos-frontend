import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAdminProyectosComponent } from './pagina-admin-proyectos.component';

describe('PaginaAdminProyectosComponent', () => {
  let component: PaginaAdminProyectosComponent;
  let fixture: ComponentFixture<PaginaAdminProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaAdminProyectosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaAdminProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
