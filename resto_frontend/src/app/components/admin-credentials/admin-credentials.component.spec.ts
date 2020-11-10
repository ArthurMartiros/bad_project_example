import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCredentialsComponent } from './admin-credentials.component';

describe('AdminCredentialsComponent', () => {
  let component: AdminCredentialsComponent;
  let fixture: ComponentFixture<AdminCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
