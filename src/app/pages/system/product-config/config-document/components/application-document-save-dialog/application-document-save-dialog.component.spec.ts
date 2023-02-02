import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDocumentSaveDialogComponent } from './application-document-save-dialog.component';

describe('ApplicationDocumentSaveDialogComponent', () => {
  let component: ApplicationDocumentSaveDialogComponent;
  let fixture: ComponentFixture<ApplicationDocumentSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDocumentSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDocumentSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
