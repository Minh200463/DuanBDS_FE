import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlynhathueComponent } from './quanlynhathue.component';

describe('QuanlynhathueComponent', () => {
  let component: QuanlynhathueComponent;
  let fixture: ComponentFixture<QuanlynhathueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlynhathueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlynhathueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
