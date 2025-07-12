import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter{
    catch(exception: RpcException, host:ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();


        if (rpcError.toString().includes('Empty response')) {
            response.status(500).json({
                statusCode: 500,
                message:  rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
            });
            return
        }

        if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
            const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
            response.status(status).json(rpcError);
        }
        response.status(400).json({
            statusCode: 400,
            message: rpcError,
        });

    }

}