import { UserBundleDto } from 'src/bundle/dto/user-bundle.dto/user-bundle.dto';

export class ConnectionResponsePayload {
    connectedUserPhoneNumber: string;
    connectionStatus: string | undefined;
    connectionCreatedAt: Date | undefined;
    deviceCode: string;
    deviceExpiresAt: Date;
    deviceCreatedAt: Date;
    bundle: UserBundleDto | null;
}
