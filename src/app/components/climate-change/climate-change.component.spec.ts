import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateChangeComponent } from './climate-change.component';

describe('ClimateChangeComponent', () => {
  let component: ClimateChangeComponent;
  let fixture: ComponentFixture<ClimateChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClimateChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
