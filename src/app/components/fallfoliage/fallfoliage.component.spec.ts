import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallfoliageComponent } from './fallfoliage.component';

describe('FallfoliageComponent', () => {
  let component: FallfoliageComponent;
  let fixture: ComponentFixture<FallfoliageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallfoliageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallfoliageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
