import { Test, TestingModule } from '@nestjs/testing';

import { BrandService } from '../services/brand.service';
import { BrandController } from './brand.controller';

import { RoleGuard } from '../../auth/guards/role.guard';

import { CreateBrandDto } from '../dtos';

describe('BrandController', () => {
  let controller: BrandController;
  let spyService: BrandService;

  const roleGuardMock = {};

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: BrandService,
      useFactory: () => ({
        getBrands: jest.fn(() => []),
        getBrand: jest.fn((brandId: string) => ({
          id: brandId,
          brand: 'iphone',
        })),
        createBrand: jest.fn((brandName: string) => ({
          id: 'someid',
          brand: brandName,
        })),
        deleteBrand: jest.fn((brandId: string) => ({
          id: brandId,
          brand: 'someBrand',
        })),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [BrandService, ApiServiceProvider],
    })
      .overrideGuard(RoleGuard)
      .useValue(roleGuardMock)
      .compile();

    controller = module.get<BrandController>(BrandController);
    spyService = module.get<BrandService>(BrandService);
  });

  it('calling getBrands method', async () => {
    controller.getBrands();
    expect(spyService.getBrands).toHaveBeenCalled();
    expect(spyService.getBrands({})).toEqual([]);
  });

  it('calling getBrand method', async () => {
    const brandId = 'someid';

    controller.getBrand(brandId);

    expect(spyService.getBrand).toHaveBeenCalledWith(brandId);
    expect(spyService.getBrand(brandId)).toEqual({
      id: brandId,
      brand: expect.any(String),
    });
  });

  it('calling createBrand method', async () => {
    const dto = new CreateBrandDto();
    dto.brandName = 'iPhone';

    const brandName = dto.brandName.toLocaleLowerCase();

    controller.createBrand(dto);

    expect(spyService.createBrand).toHaveBeenCalledWith(brandName);
    expect(spyService.createBrand(brandName)).toEqual({
      id: expect.any(String),
      brand: brandName,
    });
  });

  it('calling deleteBrand method', async () => {
    const brandId = 'someid';

    controller.deleteBrand(brandId);

    expect(spyService.deleteBrand).toHaveBeenCalledWith(brandId);
    expect(spyService.deleteBrand(brandId)).toEqual({
      id: brandId,
      brand: expect.any(String),
    });
  });
});
