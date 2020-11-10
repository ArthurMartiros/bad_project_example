import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMenuCategoryComponent } from './update-menu-category.component';

describe('UpdateMenuCategoryComponent', () => {
  let component: UpdateMenuCategoryComponent;
  let fixture: ComponentFixture<UpdateMenuCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateMenuCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
