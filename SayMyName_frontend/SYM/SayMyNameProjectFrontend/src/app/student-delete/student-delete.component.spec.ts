import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDeleteComponent } from './student-delete.component';

describe('StudentDeleteComponent', () => {
  let component: StudentDeleteComponent;
  let fixture: ComponentFixture<StudentDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDeleteComponent]
    });
    fixture = TestBed.createComponent(StudentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
