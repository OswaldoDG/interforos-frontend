import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromodelStaffComponent } from './promodel-staff.component';

describe('PromodelStaffComponent', () => {
  let component: PromodelStaffComponent;
  let fixture: ComponentFixture<PromodelStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromodelStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromodelStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
