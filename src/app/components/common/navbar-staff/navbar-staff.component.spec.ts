import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarStaffComponent } from './navbar-staff.component';

describe('NavbarStaffComponent', () => {
  let component: NavbarStaffComponent;
  let fixture: ComponentFixture<NavbarStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
