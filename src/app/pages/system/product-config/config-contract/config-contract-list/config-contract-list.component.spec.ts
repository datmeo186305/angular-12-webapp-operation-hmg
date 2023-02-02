import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContractListComponent } from './config-contract-list.component';

describe('ConfigContractListComponent', () => {
  let component: ConfigContractListComponent;
  let fixture: ComponentFixture<ConfigContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigContractListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
