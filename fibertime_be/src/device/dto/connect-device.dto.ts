import { IsNotEmpty, Length } from 'class-validator';

export class ConnectDeviceDto {
    @IsNotEmpty()
    phoneNumber: string;

    @Length(4, 4)
    @IsNotEmpty()
    deviceCode: string;
}