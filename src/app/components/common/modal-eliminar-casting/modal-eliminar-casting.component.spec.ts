import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarCastingComponent } from './modal-eliminar-casting.component';

describe('ModalEliminarCastingComponent', () => {
  let component: ModalEliminarCastingComponent;
  let fixture: ComponentFixture<ModalEliminarCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminarCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
