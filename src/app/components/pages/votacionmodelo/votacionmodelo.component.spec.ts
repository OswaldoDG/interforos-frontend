import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionmodeloComponent } from './votacionmodelo.component';

describe('VotacionmodeloComponent', () => {
  let component: VotacionmodeloComponent;
  let fixture: ComponentFixture<VotacionmodeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotacionmodeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotacionmodeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
