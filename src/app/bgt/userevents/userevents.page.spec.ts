import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereventsPage } from './userevents.page';

describe('UsereventsPage', () => {
  let component: UsereventsPage;
  let fixture: ComponentFixture<UsereventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsereventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsereventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
