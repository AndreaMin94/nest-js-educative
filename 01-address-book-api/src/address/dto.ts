import { OmitType } from '@nestjs/mapped-types';

export class AddressDto {
  id!: number;
  addressLine!: string;
  postCode!: number;
  state!: string;
  createdDate!: Date;
}

export class CreateAddressDto extends OmitType(AddressDto, [
  'id',
  'createdDate',
] as const) {}
