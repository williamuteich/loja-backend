import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class AuthErrors {
  static invalidCredentials() {
    return new InternalServerErrorException({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid credentials',
    });
  }

  static unauthorized(message: string = 'Invalid credentials') {
    return new (require('@nestjs/common').UnauthorizedException)({
      code: 'AUTH_UNAUTHORIZED',
      message,
    });
  }

  static accessDenied(message: string = 'Access denied') {
    return new (require('@nestjs/common').ForbiddenException)({
      code: 'AUTH_ACCESS_DENIED',
      message,
    });
  }

  static userNotAuthenticated() {
    return new (require('@nestjs/common').ForbiddenException)({
      code: 'AUTH_USER_NOT_AUTHENTICATED',
      message: 'User not authenticated',
    });
  }
}

export class ClientErrors {
  static notFound(id: string) {
    return new NotFoundException({
      code: 'CLIENT_NOT_FOUND',
      message: `Client with ID ${id} not found`,
    });
  }

  static emailAlreadyExists() {
    return new ConflictException({
      code: 'CLIENT_EMAIL_ALREADY_EXISTS',
      message: 'Email already exists',
    });
  }

  static failedToCreate() {
    return new InternalServerErrorException({
      code: 'CLIENT_FAILED_TO_CREATE',
      message: 'Failed to create client',
    });
  }

  static failedToUpdate() {
    return new InternalServerErrorException({
      code: 'CLIENT_FAILED_TO_UPDATE',
      message: 'Failed to update client',
    });
  }
}

export class TeamMemberErrors {
  static notFound(id: string) {
    return new NotFoundException({
      code: 'TEAM_MEMBER_NOT_FOUND',
      message: `Team member with ID ${id} not found`,
    });
  }

  static emailAlreadyExists() {
    return new ConflictException({
      code: 'TEAM_MEMBER_EMAIL_ALREADY_EXISTS',
      message: 'Email already exists',
    });
  }

  static failedToCreate() {
    return new InternalServerErrorException({
      code: 'TEAM_MEMBER_FAILED_TO_CREATE',
      message: 'Failed to create team member',
    });
  }

  static failedToUpdate() {
    return new InternalServerErrorException({
      code: 'TEAM_MEMBER_FAILED_TO_UPDATE',
      message: 'Failed to update team member',
    });
  }

  static failedToDelete() {
    return new InternalServerErrorException({
      code: 'TEAM_MEMBER_FAILED_TO_DELETE',
      message: 'Failed to delete team member',
    });
  }
}

export class CategoryErrors {
  static notFound(id: string) {
    return new NotFoundException({
      code: 'CATEGORY_NOT_FOUND',
      message: `Category with ID ${id} not found`,
    });
  }

  static nameAlreadyExists() {
    return new ConflictException({
      code: 'CATEGORY_NAME_ALREADY_EXISTS',
      message: 'Category name already exists',
    });
  }

  static failedToCreate() {
    return new InternalServerErrorException({
      code: 'CATEGORY_FAILED_TO_CREATE',
      message: 'Failed to create category',
    });
  }

  static failedToUpdate() {
    return new InternalServerErrorException({
      code: 'CATEGORY_FAILED_TO_UPDATE',
      message: 'Failed to update category',
    });
  }

  static failedToDelete() {
    return new InternalServerErrorException({
      code: 'CATEGORY_FAILED_TO_DELETE',
      message: 'Failed to delete category',
    });
  }
}

export class BrandErrors {
  static notFound(id: string) {
    return new NotFoundException({
      code: 'BRAND_NOT_FOUND',
      message: `Brand with ID ${id} not found`,
    });
  }

  static nameAlreadyExists() {
    return new ConflictException({
      code: 'BRAND_NAME_ALREADY_EXISTS',
      message: 'Brand name already exists',
    });
  }

  static failedToCreate() {
    return new InternalServerErrorException({
      code: 'BRAND_FAILED_TO_CREATE',
      message: 'Failed to create brand',
    });
  }

  static failedToUpdate() {
    return new InternalServerErrorException({
      code: 'BRAND_FAILED_TO_UPDATE',
      message: 'Failed to update brand',
    });
  }

  static failedToDelete() {
    return new InternalServerErrorException({
      code: 'BRAND_FAILED_TO_DELETE',
      message: 'Failed to delete brand',
    });
  }
}
