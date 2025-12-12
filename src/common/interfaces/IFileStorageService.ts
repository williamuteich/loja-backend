export abstract class IFileStorageService {
  abstract save(file: any, destination: string): Promise<string>;
}
