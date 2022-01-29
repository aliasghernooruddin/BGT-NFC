import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCompetitionPage } from './event-competition.page';

describe('EventCompetitionPage', () => {
  let component: EventCompetitionPage;
  let fixture: ComponentFixture<EventCompetitionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCompetitionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCompetitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
