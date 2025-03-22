import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import type { ValidationError } from 'class-validator';

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter
  implements ExceptionFilter<UnprocessableEntityException>
{
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    const exceptionResponse = exception.getResponse() as {
      message: ValidationError[];
    };

    // Extract validation errors in a structured way
    const validationErrors = this.extractValidationErrors(
      exceptionResponse.message,
    );
    console.log(validationErrors);
    response.status(status).json({
      success: false,
      statusCode: status,
      message: 'Validation Failed',
      errors: validationErrors,
      timestamp: new Date().toISOString(),
    });
  }

  private extractValidationErrors(errors: ValidationError[]): any[] {
    console.log(errors);
    return errors.flatMap((error) => {
      if (error.children && error.children.length > 0) {
        // Recursively extract child errors
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.extractValidationErrors(error.children);
      }

      return {
        field: error.property,
        constraints: error.constraints
          ? Object.values(error.constraints)
          : ['Invalid property'],
      };
    });
  }
}
