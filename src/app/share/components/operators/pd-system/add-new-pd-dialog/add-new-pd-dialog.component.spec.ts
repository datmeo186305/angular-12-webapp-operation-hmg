import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPdDialogComponent } from './add-new-pd-dialog.component';

describe('AddNewPdDialogComponent', () => {
  let component: AddNewPdDialogComponent;
  let fixture: ComponentFixture<AddNewPdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewPdDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
