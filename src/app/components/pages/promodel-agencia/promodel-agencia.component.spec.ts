import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromodelAgenciaComponent } from './promodel-agencia.component';

describe('PromodelAgenciaComponent', () => {
  let component: PromodelAgenciaComponent;
  let fixture: ComponentFixture<PromodelAgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromodelAgenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromodelAgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
