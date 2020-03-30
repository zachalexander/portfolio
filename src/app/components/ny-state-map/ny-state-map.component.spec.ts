import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NyStateMapComponent } from './ny-state-map.component';

describe('NyStateMapComponent', () => {
  let component: NyStateMapComponent;
  let fixture: ComponentFixture<NyStateMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NyStateMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NyStateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
