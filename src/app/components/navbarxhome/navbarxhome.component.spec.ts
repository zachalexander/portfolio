import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarxhomeComponent } from './navbarxhome.component';

describe('NavbarxhomeComponent', () => {
  let component: NavbarxhomeComponent;
  let fixture: ComponentFixture<NavbarxhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarxhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarxhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
