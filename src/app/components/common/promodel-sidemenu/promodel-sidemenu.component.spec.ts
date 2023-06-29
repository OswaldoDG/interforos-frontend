import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromodelSidemenuComponent } from './promodel-sidemenu.component';

describe('PromodelSidemenuComponent', () => {
  let component: PromodelSidemenuComponent;
  let fixture: ComponentFixture<PromodelSidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromodelSidemenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromodelSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
