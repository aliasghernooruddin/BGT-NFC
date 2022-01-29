import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListingPage } from './event-listing.page';

describe('EventListingPage', () => {
  let component: EventListingPage;
  let fixture: ComponentFixture<EventListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
