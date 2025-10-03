import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SizeTableController } from '../src/product/size-table.controller';
import { SizeTableService } from '../src/product/size-table.service';
import {
  SizeDimensionResponseDto,
  SizeFieldResponseDto,
  SizeTableResponseDto,
} from '../src/product/dto/size-table.dto';

describe('SizeTableController (e2e)', () => {
  let app: INestApplication;
  const sizeField: SizeFieldResponseDto = {
    id: 100,
    fieldName: 'Chest',
    fieldValue: '38',
  };
  const sizeDimension: SizeDimensionResponseDto = {
    id: 10,
    sizeName: 'M',
    fields: [sizeField],
  };
  const sanitizedResponse: SizeTableResponseDto[] = [
    {
      id: 1,
      tableName: 'Men\'s Shirts',
      sizeDimensions: [sizeDimension],
    },
  ];

  const sizeTableServiceMock = {
    getAllSizeTables: jest.fn().mockResolvedValue(sanitizedResponse),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SizeTableController],
      providers: [
        {
          provide: SizeTableService,
          useValue: sizeTableServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /size-tables returns sanitized payload', async () => {
    const response = await request(app.getHttpServer()).get('/size-tables').expect(200);

    expect(response.body).toEqual(
      sanitizedResponse.map((table) => ({
        ...table,
        sizeDimensions: table.sizeDimensions?.map((dimension) => ({
          ...dimension,
          fields: dimension.fields?.map((field) => ({ ...field })),
        })),
      })),
    );

    const dimension = response.body[0].sizeDimensions[0];
    expect(dimension).not.toHaveProperty('sizeTable');
    expect(dimension.fields[0]).not.toHaveProperty('sizeDimension');
    expect(sizeTableServiceMock.getAllSizeTables).toHaveBeenCalledTimes(1);
  });
});
