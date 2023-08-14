import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastigReviewComponent } from './castig-review.component';

describe('CastigReviewComponent', () => {
  let component: CastigReviewComponent;
  let fixture: ComponentFixture<CastigReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastigReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastigReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
