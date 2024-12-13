import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminaListaComponent } from './modal-elimina-lista.component';

describe('ModalEliminaListaComponent', () => {
  let component: ModalEliminaListaComponent;
  let fixture: ComponentFixture<ModalEliminaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminaListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
