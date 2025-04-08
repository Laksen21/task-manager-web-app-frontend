import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-task-form',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  isEditMode = false;
  taskForm!: FormGroup;
  errorMessage: string | undefined;
  taskId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private fb: FormBuilder,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    const taskIdParam = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!taskIdParam;

    //task form validators
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['', [Validators.required]],
    });

    if (this.isEditMode && taskIdParam) {
      this.taskId = +taskIdParam;
      this.loadTaskData(this.taskId);
    }
  }

  // Load data for edit 
  loadTaskData(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.taskForm.setValue({
          title: task.title,
          description: task.description,
          status: task.status
        });
      },
      error: (err) => {
        console.error(err);
        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else {
          this.alertService.showError('Failed to load task data.');
        }
      }
    });
  }

  // check create or update
  onSubmit(): void {
    if (this.isEditMode) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  // Create task method
  createTask(): void {
    this.taskService.createTask({
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      status: this.taskForm.get('status')?.value
    }).subscribe({
      next: () => {
        this.alertService.showSuccess('Task created successfully!');
        setTimeout(() => {
          this.router.navigate(['/tasks'], { replaceUrl: true });
        }, 3000);
      },
      error: err => {
        console.error(err);
        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else if (err.status === 403) {
          this.alertService.showError('Authentication failure. Please log in again.');
        } else {
          this.alertService.showError('Creating task failed. Please try again.');
        }
      }
    });
  }

  // Update task method
  updateTask(): void {
    if (this.taskForm.valid && this.taskId) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.alertService.showSuccess('Task updated successfully!');
          setTimeout(() => {
            this.router.navigate(['/tasks'], { replaceUrl: true });
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          if (err.status === 0) {
            this.alertService.showError('Unable to connect to the server. Please try again later.');
          } else if (err.status === 403) {
            this.alertService.showError('Authentication failure. Please log in again.');
          } else {
            this.alertService.showError('Failed to update task. Please try again.');
          }
        }
      });
    }
  }

}
