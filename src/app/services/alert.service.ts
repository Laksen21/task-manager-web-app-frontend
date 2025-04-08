import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AlertService {
    message: string = '';
    alertClass: string = '';

    showSuccess(message: string) {
        this.message = message;
        this.alertClass = 'alert-success';
    }

    showError(message: string) {
        this.message = message;
        this.alertClass = 'alert-danger';
    }

    showWarning(message: string) {
        this.message = message;
        this.alertClass = 'alert-warning';
    }

    clearAlert() {
        this.message = '';
        this.alertClass = '';
    }
}