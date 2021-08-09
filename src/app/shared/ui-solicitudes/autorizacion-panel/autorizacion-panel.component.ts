import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Autorizacion } from '@papx/models';

@Component({
  selector: 'papx-autorizacion-panel',
  templateUrl: 'autorizacion-panel.component.html',
  styleUrls: ['./autorizacion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizacionPanelComponent implements OnInit {
  @Input() autorizacion: Autorizacion;
  constructor() {}

  ngOnInit() {}
}
