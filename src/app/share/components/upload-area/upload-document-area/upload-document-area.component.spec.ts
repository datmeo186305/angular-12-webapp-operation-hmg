import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentAreaComponent } from './upload-document-area.component';

describe('UploadDocumentAreaComponent', () => {
  let component: UploadDocumentAreaComponent;
  let fixture: ComponentFixture<UploadDocumentAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDocumentAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
