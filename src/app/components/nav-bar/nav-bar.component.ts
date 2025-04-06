import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, FontAwesomeModule ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  faListCheck = faListCheck;
}
