import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContractSaveDialogComponent } from './config-contract-save-dialog.component';

describe('ConfigContractSaveDialogComponent', () => {
  let component: ConfigContractSaveDialogComponent;
  let fixture: ComponentFixture<ConfigContractSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigContractSaveDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContractSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
