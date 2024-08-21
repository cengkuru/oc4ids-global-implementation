import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('fadeInList', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class InfoModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  objectives = [
    { icon: 'bi-eye-fill', color: 'text-accent5', title: 'Transparency', description: 'Provide a clear, accessible view of how countries around the world are implementing OC4IDS, promoting accountability in infrastructure projects.' },
    { icon: 'bi-graph-up', color: 'text-accent1', title: 'Progress Monitoring', description: 'Track and visualize the advancement of OC4IDS implementation across different regions and countries over time.' },
    { icon: 'bi-bar-chart-fill', color: 'text-accent6', title: 'Impact Assessment', description: 'Showcase the tangible benefits and outcomes of OC4IDS implementation, including improved project efficiency, cost savings, and enhanced public trust.' },
    { icon: 'bi-people-fill', color: 'text-secondary', title: 'Knowledge Sharing', description: 'Facilitate the exchange of best practices, challenges, and success stories among countries and stakeholders involved in OC4IDS implementation.' },
    { icon: 'bi-lightbulb-fill', color: 'text-accent4', title: 'Data-Driven Decision Making', description: 'Offer insights and analytics that can inform policy decisions, guide implementation strategies, and highlight areas for improvement in infrastructure transparency.' },
  ];

  close() {
    this.closeModal.emit();
  }
}
