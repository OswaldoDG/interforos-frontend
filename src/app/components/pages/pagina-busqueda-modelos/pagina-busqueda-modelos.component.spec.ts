import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaBusquedaModelosComponent } from './pagina-busqueda-modelos.component';

describe('PaginaBusquedaModelosComponent', () => {
  let component: PaginaBusquedaModelosComponent;
  let fixture: ComponentFixture<PaginaBusquedaModelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaBusquedaModelosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaBusquedaModelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
