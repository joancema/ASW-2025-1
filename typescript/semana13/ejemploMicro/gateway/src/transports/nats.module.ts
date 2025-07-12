import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs, NATS_SERVICE } from "src/config";

@Module({
    imports:[
        ClientsModule.register([
            {
                name: NATS_SERVICE ,
                transport:  Transport.NATS,
                options: {
                    servers: envs.NATS_SERVERS,
                    maxReconnectAttempts: -1,
                }
            }
        ])
    ],
    exports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE ,
                transport:  Transport.NATS,
                options: {
                    servers: envs.NATS_SERVERS,
                }
            }
        ])
    ]
})

export class NatsModule{}