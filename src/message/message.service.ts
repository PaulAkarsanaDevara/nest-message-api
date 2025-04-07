/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable()
export class MessageService {
  private filePath = path.join(__dirname, '..', '..', 'data', 'messages.json');

  private readMessages(): Message[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeMessages(message: Message[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(message, null, 2));
  }

  create(createMessageDto: CreateMessageDto): Message {
    const messages: Message[] = this.readMessages();
    const message: Message = {
      id: uuidv4(),
      sender: createMessageDto.sender,
      content: createMessageDto.content,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);
    this.writeMessages(messages);
    return message;
  }
  findAll(): Message[] {
    return this.readMessages();
  }
  findOne(id: string): Message {
    const messages: Message[] = this.readMessages();
    const msg = messages.find((m) => m.id == id);
    if (!msg) throw new NotFoundException('Message Not found');
    return msg;
  }
  remove(id: string): void {
    const messages: Message[] = this.readMessages();

    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException('Message Not found');
    }
    messages.splice(index, 1);
    this.writeMessages(messages);
  }
}
