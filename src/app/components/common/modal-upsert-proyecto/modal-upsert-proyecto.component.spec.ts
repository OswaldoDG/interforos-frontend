import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpsertProyectoComponent } from './modal-upsert-proyecto.component';

describe('ModalUpsertProyectoComponent', () => {
  let component: ModalUpsertProyectoComponent;
  let fixture: ComponentFixture<ModalUpsertProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpsertProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpsertProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
