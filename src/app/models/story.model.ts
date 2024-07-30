export interface Story {
  type: string;
  properties: {
    country: string;
    projectsDisclosed: number;
    region: string;
    status: string;
    disclosureMandate: string;
    achievements: string[];
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}
