import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromodelRevisorComponent } from './promodel-revisor.component';

describe('PromodelRevisorComponent', () => {
  let component: PromodelRevisorComponent;
  let fixture: ComponentFixture<PromodelRevisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromodelRevisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromodelRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
