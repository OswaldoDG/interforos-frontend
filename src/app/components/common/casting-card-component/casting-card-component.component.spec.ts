import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastingCardComponentComponent } from './casting-card-component.component';

describe('CastingCardComponentComponent', () => {
  let component: CastingCardComponentComponent;
  let fixture: ComponentFixture<CastingCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastingCardComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastingCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
