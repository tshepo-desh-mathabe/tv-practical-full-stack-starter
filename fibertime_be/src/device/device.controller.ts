import { Controller, Post, Get, Param, Body, UseGuards, Logger } from '@nestjs/common';
import { DeviceService } from './device.service';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericResponsePayload } from '../util/payload';
import { ConnectionResponsePayload } from 'src/util/payload/connection-response';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('create-device-code')
    @Public()
    @ApiOperation({ summary: 'Generate a device pairing code' })
    @ApiResponse({ status: 201, type: DeviceResponseDto })
    async createDeviceCode(): Promise<GenericResponsePayload> {
        return this.deviceService.generatePairingCode();
    }

    @Get(':code')
    @UseGuards(JwtAuthGuard)
    async getDevice(@Param('code') code: string): Promise<DeviceResponseDto> {
        return this.deviceService.getDeviceByCode(code);
    }

    @Post('connect-device')
    @UseGuards(JwtAuthGuard)
    async connectDevice(@Body() connectDeviceDto: ConnectDeviceDto) {
        return this.deviceService.connectDevice(
            connectDeviceDto.phoneNumber,
            connectDeviceDto.deviceCode,
        );
    }

    @Get('/connection-status/:code')
    @UseGuards(JwtAuthGuard)
    async getConnectionStatus(@Param('code') code: string): Promise<ConnectionResponsePayload> {
        return await this.deviceService.getConnectedDevice(code);
    }
}