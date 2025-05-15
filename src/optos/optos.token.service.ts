import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import FormData = require('form-data');
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

@Injectable()
export class OptosService {
  constructor(private readonly httpService: HttpService) {}

  async Login(): Promise<any> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const grantType = process.env.GRANT_TYPE;
    const username = process.env.USERNAME1;
    const password = process.env.PASSWORD;
    const scope = process.env.SCOPE;

    if (!clientId || !clientSecret || !grantType || !username || !password) {
      const missingVars: string[] = [];
      if (!clientId) missingVars.push('CLIENT_ID');
      if (!clientSecret) missingVars.push('CLIENT_SECRET');
      if (!grantType) missingVars.push('GRANT_TYPE');
      if (!username) missingVars.push('USERNAME');
      if (!password) missingVars.push('PASSWORD');

      throw new HttpException(
        `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const data = new FormData();
    data.append('grant_type', grantType);
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('username', username);
    data.append('password', password);
    if (scope) {
      data.append('scope', scope);
    }

    const urlLogin = 'https://opost.ps/oauth/token';

    if (!urlLogin) {
      throw new HttpException(
        'URL_LOGIN configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await this.httpService.axiosRef.post(
        urlLogin.trim(),
        data,
        {
          headers: {
            Accept: 'application/json',
            ...data.getHeaders(),
          },
          maxBodyLength: Infinity,
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return response.data.access_token;
    } catch (error) {
      console.error(
        'Error creating token:',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data || error.message,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.data?.error === 'invalid_grant') {
        throw new HttpException(
          'Authentication failed: Please check your username and password are correct',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to create token: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userInfo(access_token: string): Promise<any> {
    if (!access_token) {
      throw new HttpException(
        'Access token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const urlUserInfo = 'https://opost.ps/api/oauth/user';

    try {
      const response = await this.httpService.axiosRef.get(urlUserInfo, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching user info:',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data || error.message,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 401) {
        throw new HttpException(
          'Invalid or expired access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to fetch user info: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
