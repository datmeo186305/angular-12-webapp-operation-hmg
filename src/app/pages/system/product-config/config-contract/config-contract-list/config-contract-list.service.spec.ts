import { TestBed } from '@angular/core/testing';

import { ConfigContractListService } from './config-contract-list.service';

describe('ConfigContractListService', () => {
  let service: ConfigContractListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigContractListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
