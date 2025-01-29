import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBotonesComponent } from './footer-botones.component';

describe('FooterBotonesComponent', () => {
  let component: FooterBotonesComponent;
  let fixture: ComponentFixture<FooterBotonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterBotonesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterBotonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
