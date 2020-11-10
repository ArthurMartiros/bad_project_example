import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InRestoComponent } from './in-resto.component';

describe('InRestoComponent', () => {
  let component: InRestoComponent;
  let fixture: ComponentFixture<InRestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InRestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
