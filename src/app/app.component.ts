import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Story } from './models/story.model';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  showListView = false;
  selectedStory: Story | null = null;
  filterForm: FormGroup;
  regions: string[] = [];
  statuses: string[] = [];
  statusColors: { [key: string]: string } = {
    'Active': '#61a8bd',
    'Inactive': '#D60000',
    'In Development': '#ffce32',
    'Other': '#58707b'
  };
  statusColorsArray: { name: string; color: string }[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      region: [''],
      status: ['']
    });
    this.initStatusColorsArray();
  }

  initStatusColorsArray(): void {
    this.statusColorsArray = Object.entries(this.statusColors).map(([name, color]) => ({ name, color }));
  }

  async ngOnInit(): Promise<void> {
    await this.initMap();
    await this.loadStories();
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
      this.http.get<{ features: Story[] }>('assets/data/stories.json').subscribe({
        next: (data) => {
          console.log('Data loaded:', data);
          this.stories = data.features;
          this.filteredStories = this.stories;
          this.extractFilters();
          this.addMarkers();
          resolve();
        },
        error: (error) => {
          console.error('Error loading stories:', error);
          reject(error);
        }
      });
    });
  }

  extractFilters(): void {
    this.regions = [...new Set(this.stories.map(story => story.properties.region))];
    this.statuses = [...new Set(this.stories.map(story => story.properties.status))];
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
      <div class="font-sans">
        <h3 class="font-bold text-lg">${story.properties.country}</h3>
        <p class="text-sm"><strong>Region:</strong> ${story.properties.region}</p>
        <p class="text-sm"><strong>Status:</strong> ${story.properties.status}</p>
        <p class="text-sm"><strong>Projects Disclosed:</strong> ${story.properties.projectsDisclosed}</p>
        <p class="text-sm"><strong>Disclosure Mandate:</strong> ${story.properties.disclosureMandate || 'N/A'}</p>
        ${story.properties.achievements.length > 0 ? `
          <p class="text-sm mt-2"><strong>Achievements:</strong></p>
          <ul class="list-disc list-inside text-xs">
            ${story.properties.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  toggleListView(): void {
    this.showListView = !this.showListView;
    console.log('List view toggled:', this.showListView);
  }


  selectStory(story: Story): void {
    this.selectedStory = story;
    const [lng, lat] = story.geometry.coordinates;
    this.map.setView([lat, lng], 6);
  }

  applyFilters(): void {
    const { region, status } = this.filterForm.value;
    this.filteredStories = this.stories.filter(story =>
      (!region || story.properties.region === region) &&
      (!status || story.properties.status === status)
    );
    this.addMarkers();
  }
}
