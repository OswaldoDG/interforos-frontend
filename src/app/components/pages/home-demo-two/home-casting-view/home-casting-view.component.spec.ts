import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCastingViewComponent } from './home-casting-view.component';

describe('HomeCastingViewComponent', () => {
  let component: HomeCastingViewComponent;
  let fixture: ComponentFixture<HomeCastingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCastingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCastingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
