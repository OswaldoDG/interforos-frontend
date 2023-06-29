import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaModelComponent } from './galeria-model.component';

describe('GaleriaModelComponent', () => {
  let component: GaleriaModelComponent;
  let fixture: ComponentFixture<GaleriaModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaleriaModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
