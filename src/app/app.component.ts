import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';

import { NavBarComponent } from "./components/nav-bar/nav-bar.component"; 
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'task-manager-web-app-frontend';

  showNavbar = true; 

  constructor (private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Hide navbar if navigating to login or register page
        this.showNavbar = !['/login', '/register'].includes(event.url);
      }
    });
  }
  
}
