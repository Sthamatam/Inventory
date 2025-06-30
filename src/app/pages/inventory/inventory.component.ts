import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);

  inventoryForm!: FormGroup;
  inventoryDto: any[] = [];

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      stockAvailable: [0, [Validators.required, Validators.min(0)]],
      reorderStock: [0, [Validators.required, Validators.min(0)]]
    });
    this.loadInventory();
  }

  loadInventory(): void {
    this.http.get<any[]>('https://localhost:7124/api/inventory')
      .subscribe({
        next: (data: any[]) => {
          this.inventoryDto = data;
        },
        error: err => {
          console.error('API error:', err);
          this.inventoryDto = [];
        }
      });
  }

  onSubmit(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    this.http.post('https://localhost:7124/api/inventory', this.inventoryForm.value)
      .subscribe({
        next: () => {
          this.inventoryForm.reset({
            productId: '',
            productName: '',
            stockAvailable: 0,
            reorderStock: 0
          });
          this.loadInventory();
        },
        error: err => console.error('API error:', err)
      });
  }
}
