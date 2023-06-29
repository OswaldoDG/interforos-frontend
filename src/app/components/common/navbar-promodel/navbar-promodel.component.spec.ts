import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPromodelComponent } from './navbar-promodel.component';

describe('NavbarPromodelComponent', () => {
  let component: NavbarPromodelComponent;
  let fixture: ComponentFixture<NavbarPromodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarPromodelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPromodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
