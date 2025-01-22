import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarModeloComponent } from './modal-agregar-modelo.component';

describe('ModalAgregarModeloComponent', () => {
  let component: ModalAgregarModeloComponent;
  let fixture: ComponentFixture<ModalAgregarModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
