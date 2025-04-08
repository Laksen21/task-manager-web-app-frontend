import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {

  searchForm!: FormGroup;
  statusFilter = new FormControl('All'); //status filter
  tasks: any[] = []; // task array
  searchedTask: any = null;
  taskIdToDelete: any;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();

    this.searchForm = this.fb.group({
      searchId: ['', [Validators.pattern('^[0-9]*$')]]
    });

    this.statusFilter.valueChanges.subscribe((status) => {
      // console.log('Selected status:', status);
    });

    this.searchForm.get('searchId')?.valueChanges.subscribe(value => { // clear search
      if (!value) {
        this.clearSearch();
      }
    });
  }

  // get all tasks 
  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.clearSearch();
        this.tasks = tasks;
        if (this.tasks.length === 0) {
          this.alertService.showWarning('Looks like you don’t have any tasks yet!');
        }
        // console.log(this.tasks);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else if (err.status === 403) {
          this.alertService.showWarning('Authentication failure. Please log in again.');
        } else {
          this.alertService.showError('Failed to load tasks. Please try again.');
        }
      }
    });
  }

  // search task by id
  searchTask(): void {
    const id = this.searchForm.get('searchId')?.value;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.searchedTask = task;
        this.alertService.clearAlert();
      },
      error: (err) => {
        console.error(err);
        this.searchedTask = null;
        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else if (err.status === 403) {
          this.alertService.showWarning('No task found with the given ID.');
        } else {
          this.alertService.showError('Failed to load task. Please try again.');
        }
      }
    });
  }

  // clear search input and message
  clearSearch(): void {
    this.searchedTask = null;
    this.alertService.message = '';
  }

  openDeleteModal(taskId: any): void {
    this.taskIdToDelete = taskId;
    // Show modal
    const modalElement = document.getElementById('deleteConfirmModal');
    const modal = new (window as any).bootstrap.Modal(modalElement!);
    modal.show();
  }

  // delete task by id
  deleteTask(): void {
    if (this.taskIdToDelete) {
      this.taskService.deleteTask(this.taskIdToDelete).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== this.taskIdToDelete);
          this.alertService.showSuccess('Task deleted successfully!');
          setTimeout(() => this.alertService.clearAlert(), 3000);
          this.taskIdToDelete = null;
  
          // Close modal manually
          const modalElement = document.getElementById('deleteConfirmModal');
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement!);
          modal?.hide();
        },
        error: (err: any) => {
          console.error(err);
          if (err.status === 0) {
            this.alertService.showError('Unable to connect to the server. Please try again later.');
          } else if (err.status === 403) {
            this.alertService.showError('Authentication failure. Please log in again.');
          } else {
            this.alertService.showError('Failed to delete the task. Please try again.');
          }
        }
      });
    }
  }

  get filteredTasks() {
    const selectedStatus = this.statusFilter.value;
    if (selectedStatus === 'All') return this.tasks;
    return this.tasks.filter(task => task.status === selectedStatus);
  }

}
