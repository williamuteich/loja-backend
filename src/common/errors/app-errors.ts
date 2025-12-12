import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class ClientErrors {
  static notFound(id: string) {
    return new NotFoundException(`Client with ID ${id} not found`);
  }

  static emailAlreadyExists() {
    return new ConflictException('Email already exists');
  }

  static failedToCreate() {
    return new InternalServerErrorException('Failed to create client');
  }

  static failedToFetchAll() {
    return new InternalServerErrorException('Failed to fetch clients');
  }

  static failedToFetchOne() {
    return new InternalServerErrorException('Failed to fetch client');
  }

  static failedToUpdate() {
    return new InternalServerErrorException('Failed to update client');
  }
}

export class TeamMemberErrors {
  static notFound(id: string) {
    return new NotFoundException(`Team member with ID ${id} not found`);
  }

  static emailAlreadyExists() {
    return new ConflictException('Email already exists');
  }

  static failedToCreate() {
    return new InternalServerErrorException('Failed to create team member');
  }

  static failedToFetchAll() {
    return new InternalServerErrorException('Failed to fetch team members');
  }

  static failedToFetchOne() {
    return new InternalServerErrorException('Failed to fetch team member');
  }

  static failedToUpdate() {
    return new InternalServerErrorException('Failed to update team member');
  }

  static failedToDelete() {
    return new InternalServerErrorException('Failed to delete team member');
  }
}

export class CategoryErrors {
  static notFound(id: string) {
    return new NotFoundException(`Category with ID ${id} not found`);
  }

  static nameAlreadyExists() {
    return new ConflictException('Category name already exists');
  }

  static failedToCreate() {
    return new InternalServerErrorException('Failed to create category');
  }

  static failedToFetchAll() {
    return new InternalServerErrorException('Failed to fetch categories');
  }

  static failedToFetchOne() {
    return new InternalServerErrorException('Failed to fetch category');
  }

  static failedToUpdate() {
    return new InternalServerErrorException('Failed to update category');
  }

  static failedToDelete() {
    return new InternalServerErrorException('Failed to delete category');
  }
}

export class BrandErrors {
  static notFound(id: string) {
    return new NotFoundException(`Brand with ID ${id} not found`);
  }

  static nameAlreadyExists() {
    return new ConflictException('Brand name already exists');
  }

  static failedToCreate() {
    return new InternalServerErrorException('Failed to create brand');
  }

  static failedToFetchAll() {
    return new InternalServerErrorException('Failed to fetch brands');
  }

  static failedToFetchOne() {
    return new InternalServerErrorException('Failed to fetch brand');
  }

  static failedToUpdate() {
    return new InternalServerErrorException('Failed to update brand');
  }

  static failedToDelete() {
    return new InternalServerErrorException('Failed to delete brand');
  }
}
