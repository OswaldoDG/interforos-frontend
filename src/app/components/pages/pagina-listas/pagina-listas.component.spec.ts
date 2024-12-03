import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaListasComponent } from './pagina-listas.component';

describe('PaginaListasComponent', () => {
  let component: PaginaListasComponent;
  let fixture: ComponentFixture<PaginaListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaListasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
