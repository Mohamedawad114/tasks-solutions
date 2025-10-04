import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
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
    id: mongoose.Types.ObjectId,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model.findById(id, projection, options);
  }
  async findAndDeleteDocument(
    id: mongoose.Types.ObjectId | string
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
  async findAndUpdateDocument(
    id: mongoose.Types.ObjectId,
    payload: UpdateQuery<T>
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, payload, { new: true });
  }
  async deleteDocument(
    id: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteOne({ _id: id });
  }
  //    async updateDocument(document:T):Promise <T>
  async deletManyDocuments(
    filter: FilterQuery<T>
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteMany( filter);
  }
}
