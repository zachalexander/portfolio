import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessEloComponent } from './chess-elo.component';

describe('ChessEloComponent', () => {
  let component: ChessEloComponent;
  let fixture: ComponentFixture<ChessEloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessEloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessEloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
