import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLeaderboardPage } from './event-leaderboard.page';

describe('EventLeaderboardPage', () => {
  let component: EventLeaderboardPage;
  let fixture: ComponentFixture<EventLeaderboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLeaderboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLeaderboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
