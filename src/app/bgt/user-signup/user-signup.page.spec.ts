import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignupPage } from './user-signup.page';

describe('UserSignupPage', () => {
  let component: UserSignupPage;
  let fixture: ComponentFixture<UserSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
