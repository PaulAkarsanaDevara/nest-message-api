import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Message, MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly msgService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    const newMessage: Message = this.msgService.create(createMessageDto);
    return {
      message: 'Pesan berhasil dibuat',
      data: newMessage,
    };
  }

  @Get()
  findAll() {
    const data: Message[] = this.msgService.findAll();
    return {
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Message {
    return this.msgService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.msgService.remove(id);
    return {
      message: 'Pesan berhasil dihapus',
    };
  }
}
