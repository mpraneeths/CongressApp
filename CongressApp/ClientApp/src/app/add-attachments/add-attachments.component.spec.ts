import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttachmentsComponent } from './add-attachments.component';

describe('AddAttachmentsComponent', () => {
  let component: AddAttachmentsComponent;
  let fixture: ComponentFixture<AddAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
