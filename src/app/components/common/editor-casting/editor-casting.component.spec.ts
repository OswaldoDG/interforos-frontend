import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCastingComponent } from './editor-casting.component';

describe('EditorCastingComponent', () => {
  let component: EditorCastingComponent;
  let fixture: ComponentFixture<EditorCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
