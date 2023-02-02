import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentButtonComponent } from './document-button.component';

describe('DocumentButtonComponent', () => {
  let component: DocumentButtonComponent;
  let fixture: ComponentFixture<DocumentButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
