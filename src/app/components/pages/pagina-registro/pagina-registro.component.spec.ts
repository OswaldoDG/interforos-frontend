import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaRegistroComponent } from './pagina-registro.component';

describe('PaginaRegistroComponent', () => {
  let component: PaginaRegistroComponent;
  let fixture: ComponentFixture<PaginaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaRegistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
