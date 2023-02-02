import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeSaveDialogComponent } from './document-type-save-dialog.component';

describe('DocumentTypeSaveDialogComponent', () => {
  let component: DocumentTypeSaveDialogComponent;
  let fixture: ComponentFixture<DocumentTypeSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTypeSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
