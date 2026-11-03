import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline, locationOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-state-message',
  templateUrl: 'state-message.component.html',
  styleUrl: 'state-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class StateMessageComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly actionLabel = input<string>();
  readonly action = output();

  constructor() {
    addIcons({ cloudOfflineOutline, locationOutline, searchOutline });
  }
}
