import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Form from 'form-data';
import { CreateShipmentDto } from './optos.dto';
import { OptosService } from './optos.token.service';

@Injectable()
export class OptosShipmentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly OptosService: OptosService,
  ) {}

  async createShipment(createShipment: CreateShipmentDto): Promise<any> {
    const data = new Form();
    data.append('business', createShipment.business);
    data.append('business_address', createShipment.business_address);
    data.append('consignee.name', createShipment.consignee_name);
    data.append('consignee.phone', createShipment.consignee_phone);
    data.append('consignee.city', createShipment.consignee_city);
    data.append('consignee.area', createShipment.consignee_area);
    data.append('consignee.address', createShipment.consignee_address);
    data.append('shipment_types', createShipment.shipment_types);
    data.append('quantity', createShipment.quantity);
    data.append('items_description', createShipment.items_description);
    data.append('is_cod', '1');
    data.append('cod_amount', createShipment.cod_amount);
    data.append('has_return', '1');
    data.append('return_notes', createShipment.return_notes);
    data.append('notes', createShipment.notes);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const access_token = await this.OptosService.Login();
      const response = await this.httpService.axiosRef.post(
        'https://opost.ps/api/resources/shipments',
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error creating shipment:', error.message);
      throw new HttpException(
        'Failed to create shipment',
        //@typescript-eslint/no-unsafe-member-access
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getShipment() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const access_token = await this.OptosService.Login();
      const response = await this.httpService.axiosRef.get(
        `https://opost.ps/api/resources/shipments?col.notes=true&col.is_cod=true&col.consignee.address=true&sort=area&filter=picked_up&limit=150resources/shipments?col.notes=true&col.is_cod=true&col.consignee.address=true&sort=area&filter=picked_up&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
          },
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error fetching shipments:', error.message);
      throw new HttpException(
        'Failed to fetch shipments',
        //@typescript-eslint/no-unsafe-member-access
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getPendingTypes() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const access_token = await this.OptosService.Login();
      console.log(access_token);
      const response = await this.httpService.axiosRef.get(
        'https://opost.ps/api/resources/pending-types',
        {
          headers: {
            Authorization: `${access_token}`,
            Accept: 'application/json',
          },
          maxBodyLength: Infinity,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.response?.data?.message || 'Failed to fetch pending types',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getShipmentType() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const access_token = await this.OptosService.Login();
      const response = await this.httpService.axiosRef.get(
        `https://opost.ps/api/resources/shipment-types`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
          },
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error fetching shipment types:', error.message);
      throw new HttpException(
        'Failed to fetch shipment types',
        //@typescript-eslint/no-unsafe-member-access
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
