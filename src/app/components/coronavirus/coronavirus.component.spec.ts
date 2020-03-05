import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoronavirusComponent } from './coronavirus.component';

describe('CoronavirusComponent', () => {
  let component: CoronavirusComponent;
  let fixture: ComponentFixture<CoronavirusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronavirusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronavirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
