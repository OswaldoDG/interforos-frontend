import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePromodelComponent } from './home-promodel.component';

describe('HomePromodelComponent', () => {
  let component: HomePromodelComponent;
  let fixture: ComponentFixture<HomePromodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePromodelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePromodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
