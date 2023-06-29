import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginadoPersonasComponent } from './paginado-personas.component';

describe('PaginadoPersonasComponent', () => {
  let component: PaginadoPersonasComponent;
  let fixture: ComponentFixture<PaginadoPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginadoPersonasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginadoPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
