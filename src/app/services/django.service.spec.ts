import { TestBed, inject } from '@angular/core/testing';

import { DjangoService } from './django.service';

describe('DjangoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DjangoService]
    });
  });

  it('should be created', inject([DjangoService], (service: DjangoService) => {
    expect(service).toBeTruthy();
  }));
});
