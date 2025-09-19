import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OptosService } from './optos.token.service';
@Injectable()
export class OptosApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly OptosService: OptosService,
  ) {}

  async Businesses() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const access_token = await this.OptosService.Login();
    const response = await this.httpService.axiosRef.get(
      'https://opost.ps/api/resources/businesses',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        maxBodyLength: Infinity,
      },
    );
    return response.data;
  }
  async BusinessesAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const access_token = await this.OptosService.Login();
    const response = await this.httpService.axiosRef.get(
      'https://opost.ps/api/resources/business-addresses',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        maxBodyLength: Infinity,
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  }
  async Cities() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const access_token = await this.OptosService.Login();
    const response = await this.httpService.axiosRef.get(
      'https://opost.ps/api/resources/cities',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        maxBodyLength: Infinity,
      },
    );
    return response.data;
  }
  async Area(city: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const access_token = await this.OptosService.Login();
    const City = city;
    const response = await this.httpService.axiosRef.get(
      `https://opost.ps/api/resources/areas?city=${City}&limit=1000`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        maxBodyLength: Infinity,
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  }
}
