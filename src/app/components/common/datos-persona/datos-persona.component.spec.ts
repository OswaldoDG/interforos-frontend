import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPersonaComponent } from './datos-persona.component';

describe('DatosPersonaComponent', () => {
  let component: DatosPersonaComponent;
  let fixture: ComponentFixture<DatosPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
