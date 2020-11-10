import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMenuCategoryComponent } from './create-menu-category.component';

describe('CreateMenuCategoryComponent', () => {
  let component: CreateMenuCategoryComponent;
  let fixture: ComponentFixture<CreateMenuCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMenuCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
