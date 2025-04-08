import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component"; 
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, NgIf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'task-manager-web-app-frontend';

  showNavbar = true; 

  constructor (private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // navbar behavior
        this.showNavbar = !['/login', '/register'].includes(event.url);
      }
    });
  }
  
}
