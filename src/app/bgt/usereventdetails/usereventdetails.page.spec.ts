import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereventdetailsPage } from './usereventdetails.page';

describe('UsereventdetailsPage', () => {
  let component: UsereventdetailsPage;
  let fixture: ComponentFixture<UsereventdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsereventdetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsereventdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
