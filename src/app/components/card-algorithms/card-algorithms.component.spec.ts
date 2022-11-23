import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAlgorithmsComponent } from './card-algorithms.component';

describe('CardAlgorithmsComponent', () => {
  let component: CardAlgorithmsComponent;
  let fixture: ComponentFixture<CardAlgorithmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAlgorithmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAlgorithmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
