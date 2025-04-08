import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faListCheck, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, CommonModule, FontAwesomeModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  faListCheck = faListCheck;
  faRightFromBracket = faRightFromBracket;

  username: string = '';  // Store username
  isLoggedIn: boolean = false;  // Track login state
  isLogoutMsg: boolean = false;  // Track logout state

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.authService.getUserName();
    }
  }

  logout(): void {
    // this.isLogoutMsg = true; // for logout message
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = '';
  }
  
  confirmLogout() {
    
  }
}
