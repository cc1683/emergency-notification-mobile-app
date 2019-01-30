import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPage } from './link.page';

describe('LinkPage', () => {
  let component: LinkPage;
  let fixture: ComponentFixture<LinkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
