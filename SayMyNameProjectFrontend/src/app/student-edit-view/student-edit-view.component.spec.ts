import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditViewComponent } from './student-edit-view.component';

describe('StudentEditViewComponent', () => {
  let component: StudentEditViewComponent;
  let fixture: ComponentFixture<StudentEditViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentEditViewComponent]
    });
    fixture = TestBed.createComponent(StudentEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
