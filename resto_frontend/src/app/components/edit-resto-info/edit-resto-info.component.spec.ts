import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestoInfoComponent } from './edit-resto-info.component';

describe('EditRestoInfoComponent', () => {
  let component: EditRestoInfoComponent;
  let fixture: ComponentFixture<EditRestoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRestoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRestoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
