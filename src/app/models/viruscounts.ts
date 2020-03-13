export class VirusCounts {
  last_updated: string;
  latest: number;
  locations: [
    {
      coordinates: {
        lat: string,
        long: string
      },
      country: string,
      country_code: string,
      history: { string: string },
      latest: number,
      province: string
   }
  ]
}
