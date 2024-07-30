import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {Story} from './models/story.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'globalSuccess';
  map!: L.Map;
  stories: Story[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.loadStories();
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadStories(): void {
    this.http.get<{ features: Story[] }>('assets/data/stories.json').subscribe(data => {
      this.stories = data.features;
      this.addMarkers();
    });
  }

  addMarkers(): void {
    this.stories.forEach(story => {
      const marker = L.marker([story.geometry.coordinates[1], story.geometry.coordinates[0]])
        .addTo(this.map)
        .bindPopup(this.createPopupContent(story));

      // Color markers based on status
      const icon = this.getMarkerIcon(story.properties.status);
      marker.setIcon(icon);
    });
  }


  getMarkerIcon(status: string): L.Icon {
    let color: string;
    switch (status) {
      case 'Active':
        color = 'green';
        break;
      case 'Inactive':
        color = 'red';
        break;
      case 'In Development':
        color = 'orange';
        break;
      default:
        color = 'blue';
    }

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
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
}
