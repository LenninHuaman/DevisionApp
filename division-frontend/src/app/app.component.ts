import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DivisionComponent } from './division/division.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DivisionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'division-frontend';
}
