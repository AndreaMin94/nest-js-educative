import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, CreateAddressDto } from './dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('all')
  async getAll(): Promise<AddressDto[]> {
    const data = await this.addressService.getAll();
    return data;
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<AddressDto> {
    const address = await this.addressService.get(id);
    return address;
  }

  @Post()
  @HttpCode(200)
  async create(@Body() address: CreateAddressDto) {
    return await this.addressService.create(address);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() address: AddressDto,
  ) {
    return await this.addressService.update(id, address);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.delete(id);
  }
}
