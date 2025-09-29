import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaVideosComponent } from './pagina-videos.component';

describe('PaginaVideosComponent', () => {
  let component: PaginaVideosComponent;
  let fixture: ComponentFixture<PaginaVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
