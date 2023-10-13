import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaPersonaComponent } from './galeria-persona.component';

describe('GaleriaPersonaComponent', () => {
  let component: GaleriaPersonaComponent;
  let fixture: ComponentFixture<GaleriaPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaleriaPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
