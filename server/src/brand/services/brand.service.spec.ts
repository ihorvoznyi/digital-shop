import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Connection, Repository } from 'typeorm';

import { Brand } from '../../database/entities';
import { BrandService } from './brand.service';
import { IClientBrand } from '../interfaces';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
});

describe('BrandService', () => {
  let service: BrandService;
  let brandRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Brand),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    brandRepository = module.get<MockRepository>(getRepositoryToken(Brand));
  });

  afterEach(() => jest.clearAllMocks());

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBrands', () => {
    it('should return brands', async () => {
      const expectedBrands: Brand[] = [];

      brandRepository.find.mockReturnValue([] as Brand[]);
      const brands: IClientBrand[] = await service.getBrands({});
      expect(brands).toEqual(expectedBrands);
    });
  });

  describe('getBrand', () => {
    describe('when brand with correct ID', () => {
      it('should return the brand object', async () => {
        const brandId = 'fdb0cffa-9107-4b06-afd5-50ed5f812a14';
        const expectedBrand = {
          id: brandId,
          brand: 'samsung',
        };

        brandRepository.findOne.mockReturnValue(expectedBrand);
        const brand = await service.getBrand(brandId);
        expect(brand).toEqual(expectedBrand);
      });
    });

    describe('when brand is not found', () => {
      it('should throw the "HttpException"', async () => {
        const brandId = 'fdb0cffa-9107-4b06-afd5-50ed5f812a14';
        brandRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getBrand(brandId);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.message).toEqual(`Brand #${brandId} not found`);
        }
      });
    });
  });

  describe('createBrand', () => {
    describe('when brand successfuly created', () => {
      it('should create a brand', async () => {
        const brandName = 'samsung';
        const expectedBrand = {};

        const findOneBySpy = jest.spyOn(brandRepository, 'findOneBy');
        const createSpy = jest.spyOn(brandRepository, 'create');
        const saveSpy = jest.spyOn(brandRepository, 'save');

        brandRepository.save.mockReturnValue(expectedBrand);
        const brand = await service.createBrand(brandName);

        expect(brand).toEqual(expectedBrand);
        expect(findOneBySpy).toBeCalledWith({ brand: brandName });
        expect(createSpy).toHaveBeenCalled();
        expect(createSpy).toBeCalledWith({ brand: brandName });
        expect(saveSpy).toHaveBeenCalled();
      });
    });

    describe('when brand is not created', () => {
      it('brand is already exist', async () => {
        const brandName = 'samsung';
        const brandMock = {
          id: '1',
          brand: brandName,
        };

        brandRepository.findOneBy.mockReturnValue(brandMock);

        const findOneBySpy = jest.spyOn(brandRepository, 'findOneBy');
        const createSpy = jest.spyOn(brandRepository, 'create');
        const saveSpy = jest.spyOn(brandRepository, 'save');

        try {
          await service.createBrand(brandName);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.status).toEqual(400);
          expect(err.message).toEqual(`Brand #${brandName} is already exists`);
        }

        expect(findOneBySpy).toBeCalledWith({ brand: brandName });
        expect(createSpy).not.toHaveBeenCalled();
        expect(saveSpy).not.toHaveBeenCalled();
      });

      it('internal error', async () => {
        const brandName = 'samsung';

        const findOneBySpy = jest.spyOn(brandRepository, 'findOneBy');
        const createSpy = jest.spyOn(brandRepository, 'create');
        const saveSpy = jest.spyOn(brandRepository, 'save');

        brandRepository.findOneBy.mockReturnValue('');

        try {
          brandRepository.create.mockImplementation(() => {
            throw new InternalServerErrorException();
          });

          await service.createBrand(brandName);
        } catch (err) {
          expect(err).toBeInstanceOf(InternalServerErrorException);
        }

        expect(findOneBySpy).toBeCalledWith({ brand: brandName });
        expect(createSpy).toHaveBeenCalled();
        expect(saveSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteBrand', () => {
    describe('when brand successfuly deleted', () => {
      it('brand deleted', async () => {
        const brandId = '1';
        const expectedDeletedBrand = {
          id: brandId,
          brand: '',
        };

        const removeSpy = jest.spyOn(brandRepository, 'remove');

        brandRepository.findOneBy.mockReturnValue(expectedDeletedBrand);
        brandRepository.remove.mockReturnValue(expectedDeletedBrand);
        const brand = await service.deleteBrand(brandId);

        expect(brand).toEqual(expectedDeletedBrand);
        expect(removeSpy).toHaveBeenCalledWith(expectedDeletedBrand);
      });
    });

    describe('otherwise', () => {
      it('should return "NotFoundException"', async () => {
        const brandId = '1';

        const removeSpy = jest.spyOn(brandRepository, 'remove');

        brandRepository.findOneBy.mockReturnValue(undefined);

        try {
          await service.deleteBrand(brandId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Brand #${brandId} not found`);
        }

        expect(removeSpy).not.toHaveBeenCalled();
      });
    });
  });
});
