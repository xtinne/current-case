import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonButton, IonIcon, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';

@Component({
  selector: 'app-load-error',
  templateUrl: 'load-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonText, IonButton, IonIcon],
})
export class LoadErrorComponent {
  readonly message = input.required<string>();
  readonly retry = output();

  constructor() {
    addIcons({ refresh });
  }
}
