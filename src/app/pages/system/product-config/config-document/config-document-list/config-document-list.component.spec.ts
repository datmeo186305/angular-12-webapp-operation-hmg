import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDocumentListComponent } from './config-document-list.component';

describe('ConfigDocumentListComponent', () => {
  let component: ConfigDocumentListComponent;
  let fixture: ComponentFixture<ConfigDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigDocumentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
