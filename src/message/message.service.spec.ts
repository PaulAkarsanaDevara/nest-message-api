import { Test, TestingModule } from '@nestjs/testing';
import { Message, MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs'); // mock fs module

describe('MessageService', () => {
  let service: MessageService;

  const fakeFilePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'messages.json',
  );

  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'Farhan',
      content: 'Hello!',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      sender: 'Budi',
      content: 'Hi!',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockMessages),
    );
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all messages', () => {
    const result = service.findAll();
    expect(result.length).toBe(2);
    expect(result[0].sender).toBe('Farhan');
  });

  it('should find one message by id', () => {
    const result = service.findOne('1');
    expect(result).toBeDefined();
    expect(result.sender).toBe('Farhan');
  });

  it('should throw error if message not found', () => {
    expect(() => service.findOne('999')).toThrowError('Message Not found');
  });

  it('should create a new message', () => {
    const dto: CreateMessageDto = {
      sender: 'Agus',
      content: 'Testing message',
    };

    const newMessage = service.create(dto);
    expect(newMessage).toHaveProperty('id');
    expect(newMessage.sender).toBe('Agus');
  });

  it('should delete a message by id', () => {
    service.remove('1');

    // expect fs.writeFileSync to be called with updated array
    const updatedMessages = mockMessages.filter((m) => m.id !== '1');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      fakeFilePath,
      JSON.stringify(updatedMessages, null, 2),
    );
  });

  it('should throw error when deleting non-existent message', () => {
    expect(() => service.remove('999')).toThrowError('Message Not found');
  });
});
