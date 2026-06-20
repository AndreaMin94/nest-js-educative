import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressBookModule } from './address-book/address-book.module';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';

@Module({
  imports: [AddressBookModule],
  controllers: [AppController, AddressController],
  providers: [AppService, AddressService],
})
export class AppModule {}
