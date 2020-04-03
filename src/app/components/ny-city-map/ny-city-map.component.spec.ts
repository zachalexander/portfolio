import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NyCityMapComponent } from './ny-city-map.component';

describe('NyCityMapComponent', () => {
  let component: NyCityMapComponent;
  let fixture: ComponentFixture<NyCityMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NyCityMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NyCityMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
