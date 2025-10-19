import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(private model: Model<T>) {}
  async createDocument(document: Partial<T>): Promise<T> {
    return await this.model.create(document);
  }
  async findDocuments(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T[]> {
    return this.model.find((filter = {}), projection, options);
  }
  async findOneDocument(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options);
  }
  async findByIdDocument(
    id: mongoose.Types.ObjectId|string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model.findById(id, projection, options);
  }
  async findByIdAndDeleteDocument(
    id: mongoose.Types.ObjectId | string,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id, options);
  }
  async findAndUpdateDocument(
    id: mongoose.Types.ObjectId|string,
    payload: UpdateQuery<T>
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, payload, { new: true });
  }
  async deleteDocument(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteOne(filter, options as any);
  }
  async updateDocument(
    filter: FilterQuery<T>,
    payload: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, payload, options as any);
  }
  async deleteManyDocuments(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteMany(filter, options as any);
  }
}
