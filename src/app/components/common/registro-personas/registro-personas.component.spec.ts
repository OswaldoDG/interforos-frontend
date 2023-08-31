import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPersonasComponent } from './registro-personas.component';

describe('RegistroPersonasComponent', () => {
  let component: RegistroPersonasComponent;
  let fixture: ComponentFixture<RegistroPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPersonasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
