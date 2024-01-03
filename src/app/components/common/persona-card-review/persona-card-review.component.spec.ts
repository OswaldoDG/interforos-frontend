import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaCardReviewComponent } from './persona-card-review.component';

describe('PersonaCardReviewComponent', () => {
  let component: PersonaCardReviewComponent;
  let fixture: ComponentFixture<PersonaCardReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonaCardReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaCardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
