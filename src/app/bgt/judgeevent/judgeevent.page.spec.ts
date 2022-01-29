import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeeventPage } from './judgeevent.page';

describe('JudgeeventPage', () => {
  let component: JudgeeventPage;
  let fixture: ComponentFixture<JudgeeventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeeventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
