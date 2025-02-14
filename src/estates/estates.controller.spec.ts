import { Test, TestingModule } from '@nestjs/testing';
import { EstatesController } from './estates.controller';

describe('EstatesController', () => {
  let controller: EstatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstatesController],
    }).compile();

    controller = module.get<EstatesController>(EstatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
