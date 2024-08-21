import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {CoSTDataset, Story} from './models/story.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'globalSuccess';
  map!: L.Map;
  stories: Story[] = [];
  filteredStories: Story[] = [];
  selectedStory: Story | null = null;
  statusColors: { [key: string]: string } = {
    'Active': '#61a8bd',
    'Inactive': '#D60000',
    'In Development': '#ffce32',
    'Other': '#58707b'
  };
  statusColorsArray: { name: string; color: string }[] = [];
  activeFilters: string[] = [];

  coSTDataset: CoSTDataset | null = null;
  implementationPercentage: number = 0;
  commonChallenges: string[] = [];
  implementationProgress: { [key: string]: number } = {};

  lastUpdated: Date = new Date('2024-08-21'); // Replace with your desired date; // Add this line to create a new Date object


  constructor(private http: HttpClient) {
    this.initStatusColorsArray();
  }

  initStatusColorsArray(): void {
    this.statusColorsArray = Object.entries(this.statusColors).map(([name, color]) => ({ name, color }));
  }

  async ngOnInit(): Promise<void> {
    await this.initMap();
    await this.loadStories();
    this.calculateImplementationMetrics();
  }

  initMap(): Promise<void> {
    return new Promise((resolve) => {
      this.map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      console.log('Map initialized');
      resolve();
    });
  }

  loadStories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<CoSTDataset>('assets/data/stories.json').subscribe({
        next: (data) => {
          console.log('Data loaded:', data);
          this.coSTDataset = data;
          this.stories = data.features;
          this.filteredStories = this.stories;
          this.addMarkers();
          this.calculateImplementationMetrics(); // Move this call here
          resolve();
        },
        error: (error) => {
          console.error('Error loading stories:', error);
          reject(error);
        }
      });
    });
  }

  calculateImplementationMetrics(): void {
    if (!this.stories || this.stories.length === 0) {
      console.error('Stories data is not available');
      return;
    }

    const totalCountries = this.stories.length;
    const fullyImplemented = this.stories.filter(story =>
      story.properties.status === 'Active' && story.properties.projectsDisclosed > 0
    ).length;

    this.implementationPercentage = (fullyImplemented / totalCountries) * 100;

    // Calculate implementation progress
    const statusCounts = this.stories.reduce((acc, story) => {
      acc[story.properties.status] = (acc[story.properties.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    Object.keys(statusCounts).forEach(status => {
      this.implementationProgress[status] = (statusCounts[status] / totalCountries) * 100;
    });

    // Identify common challenges (this is a placeholder - you'd need real data for this)
    this.commonChallenges = [
      'Data standardization across different systems',
      'Ensuring data quality and completeness',
      'Building capacity for data disclosure',
      'Overcoming technical barriers in implementation'
    ];
  }

  addMarkers(): void {
    if (!this.map) {
      console.error('Map not initialized when trying to add markers');
      return;
    }

    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    console.log('Adding markers for', this.filteredStories.length, 'stories');

    this.filteredStories.forEach((story, index) => {
      if (!story.geometry || !Array.isArray(story.geometry.coordinates) || story.geometry.coordinates.length < 2) {
        console.error('Invalid story geometry:', story);
        return;
      }

      const [lng, lat] = story.geometry.coordinates;
      console.log(`Adding marker ${index + 1}:`, lat, lng, story.properties.country);

      try {
        const marker = L.marker([lat, lng], {
          icon: this.getPulsingIcon(story.properties.status)
        })
          .addTo(this.map)
          .bindPopup(this.createPopupContent(story));

        marker.on('click', () => {
          this.selectedStory = story;
        });
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

    console.log('Finished adding markers');
  }

  getPulsingIcon(status: string): L.DivIcon {
    const color = this.getColorForStatus(status);
    return L.divIcon({
      className: 'pulsing-icon',
      html: `
        <div class="pulse-ring" style="border-color: ${color};"></div>
        <div class="pulse-core" style="background-color: ${color};"></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }

  getColorForStatus(status: string): string {
    return this.statusColors[status] || this.statusColors['Other'];
  }

  createPopupContent(story: Story): string {
    return `
    <div class="font-sans p-2">
      <h3 class="font-bold text-lg text-secondary mb-2">${story.properties.country}</h3>
      <p class="text-sm mb-1"><i class="bi bi-globe2 mr-1 text-accent4"></i> <strong>Region:</strong> ${story.properties.region}</p>
      <p class="text-sm mb-1"><i class="bi bi-circle-fill mr-1 text-xs" style="color: ${this.getColorForStatus(story.properties.status)}"></i> <strong>Status:</strong> ${story.properties.status}</p>
      <p class="text-sm mb-1"><i class="bi bi-bar-chart-fill mr-1 text-accent5"></i> <strong>Projects Disclosed:</strong> ${story.properties.projectsDisclosed}</p>
      <p class="text-sm mb-1"><i class="bi bi-file-earmark-text mr-1 text-accent6"></i> <strong>Disclosure Mandate:</strong> ${story.properties.disclosureMandate || 'N/A'}</p>
      ${story.properties.achievements.length > 0 ? `
        <p class="text-sm mt-2 font-bold"><i class="bi bi-trophy-fill mr-1 text-accent5"></i> Achievements:</p>
        <ul class="list-disc list-inside text-xs">
          ${story.properties.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
  }

  toggleFilter(status: string): void {
    const index = this.activeFilters.indexOf(status);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
    } else {
      this.activeFilters.push(status);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.activeFilters = [];
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.activeFilters.length === 0) {
      this.filteredStories = this.stories;
    } else {
      this.filteredStories = this.stories.filter(story =>
        this.activeFilters.includes(story.properties.status)
      );
    }
    this.addMarkers();
  }

  selectStory(story: Story): void {
    this.selectedStory = story;
    const [lng, lat] = story.geometry.coordinates;
    this.map.setView([lat, lng], 6);
  }

  closeSelectedStory(): void {
    this.selectedStory = null;
  }
}
