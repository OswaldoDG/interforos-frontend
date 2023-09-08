import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptacionConsentimientoComponent } from './aceptacion-consentimiento.component';

describe('AceptacionConsentimientoComponent', () => {
  let component: AceptacionConsentimientoComponent;
  let fixture: ComponentFixture<AceptacionConsentimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceptacionConsentimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceptacionConsentimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
