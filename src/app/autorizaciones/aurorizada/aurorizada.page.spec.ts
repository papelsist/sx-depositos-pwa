import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AurorizadaPage } from './aurorizada.page';

describe('AurorizadaPage', () => {
  let component: AurorizadaPage;
  let fixture: ComponentFixture<AurorizadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AurorizadaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AurorizadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
