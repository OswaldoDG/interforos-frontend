import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotoModeloComponentComponent } from './voto-modelo-component.component';

describe('VotoModeloComponentComponent', () => {
  let component: VotoModeloComponentComponent;
  let fixture: ComponentFixture<VotoModeloComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotoModeloComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotoModeloComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
