import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let errorMessage: string | string[] = exception.message;
    let errorDetails = null;

    const exceptionResponse = exception.getResponse() as any;

    // Manejar errores de validación
    if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        errorDetails = this.formatValidationErrors(exceptionResponse.message);
        errorMessage = 'Error de validación';
      } else {
        errorMessage = exceptionResponse.message;
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message: errorMessage,
      ...(errorDetails && { errors: errorDetails }),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error({
      endpoint: request.url,
      method: request.method,
      body: request.body,
      error: errorResponse,
    });

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(errors: any[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (typeof error === 'string') {
        if (!formattedErrors['general']) {
          formattedErrors['general'] = [];
        }
        formattedErrors['general'].push(error);
      } else if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints).map(
          (constraint: string) => this.formatErrorMessage(constraint),
        );
      }
    });

    return formattedErrors;
  }

  private formatErrorMessage(message: string): string {
    const errorMessages: Record<string, string> = {
      isNotEmpty: 'Este campo es requerido',
      isEmail: 'Debe ser un email válido',
      minLength: 'La longitud es muy corta',
      maxLength: 'La longitud es muy larga',
      isString: 'Debe ser texto',
      isNumber: 'Debe ser un número',
      min: 'El valor es muy bajo',
      max: 'El valor es muy alto',
      isPositive: 'Debe ser un número positivo',
    };

    // Buscar y reemplazar mensajes comunes
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.includes(key)) {
        return value;
      }
    }

    return message;
  }
}
