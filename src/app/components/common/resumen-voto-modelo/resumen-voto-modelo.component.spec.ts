import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenVotoModeloComponent } from './resumen-voto-modelo.component';

describe('ResumenVotoModeloComponent', () => {
  let component: ResumenVotoModeloComponent;
  let fixture: ComponentFixture<ResumenVotoModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenVotoModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenVotoModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
