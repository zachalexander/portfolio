import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresRegressionComponent } from './pres-regression.component';

describe('PresRegressionComponent', () => {
  let component: PresRegressionComponent;
  let fixture: ComponentFixture<PresRegressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresRegressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresRegressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
