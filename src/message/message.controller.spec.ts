import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { Message, MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  const mockMessage: Message = {
    id: '1',
    sender: 'Farhan',
    content: 'Halo dari NestJS',
    createdAt: new Date().toISOString(),
  };

  const mockService = {
    create: jest.fn((dto: CreateMessageDto) => ({
      ...mockMessage,
      sender: dto.sender,
      content: dto.content,
    })),
    findAll: jest.fn(() => [mockMessage]),
    findOne: jest.fn((id: string) => mockMessage),
    remove: jest.fn((id: string) => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a message and return success response', () => {
    const dto: CreateMessageDto = {
      sender: 'Farhan',
      content: 'Halo Nest',
    };

    const result = controller.create(dto);
    expect(result).toHaveProperty('message', 'Pesan berhasil dibuat');
    expect(result).toHaveProperty('data');
    expect(result.data.sender).toBe('Farhan');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all messages', () => {
    const result = controller.findAll();
    expect(result.data.length).toBe(1);
    expect(service.findAll()).toHaveBeenCalled();
  });

  it('should return a message by id', () => {
    const result = controller.findOne('1');
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should delete a message and return success response', () => {
    const result = controller.remove('1');
    expect(result).toEqual({ message: 'Pesan berhasil dihapus' });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
