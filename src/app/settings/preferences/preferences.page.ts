import { Component, OnInit } from '@angular/core';
import { DisplayModeService } from 'src/app/core/display-mode.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {
  constructor(public displayService: DisplayModeService) {}

  ngOnInit() {}

  toggleDarkMode(event: any) {
    const {
      detail: { checked },
    } = event;
    this.displayService.toggleDarkMode(checked);
  }
}
