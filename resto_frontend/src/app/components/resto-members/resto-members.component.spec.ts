import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoMembersComponent } from './resto-members.component';

describe('RestoMembersComponent', () => {
  let component: RestoMembersComponent;
  let fixture: ComponentFixture<RestoMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
