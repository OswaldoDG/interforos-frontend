import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCastingViewComponent } from './categoria-casting-view.component';

describe('CategoriaCastingViewComponent', () => {
  let component: CategoriaCastingViewComponent;
  let fixture: ComponentFixture<CategoriaCastingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaCastingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCastingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
