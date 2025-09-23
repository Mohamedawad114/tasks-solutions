import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";

export abstract class BaseRepository<T> {
    constructor(private model:Model<T>) {}
   async createDocument(document:Partial<T>):Promise <T>{
    return await this.model.create(document)
   }
async findDocuments(
  filter?: FilterQuery<T>, 
  projection?: ProjectionType<T>, 
  options?: QueryOptions<T>
): Promise<T[]> {
  return this.model.find(filter={}, projection, options);
}
   async findOneDocument( filter: FilterQuery<T>, 
  projection?: ProjectionType<T>, 
  options?: QueryOptions<T>
): Promise<T|null> {
  return this.model.findOne(filter, projection, options);
}
  async findByIdDocument(id: string, 
  projection?: ProjectionType<T>, 
  options?: QueryOptions<T>
): Promise<T|null> {
  return this.model.findById(id, projection, options);
}
 async findAndDeleteDocument(filter:FilterQuery<T>, 
  options?: QueryOptions<T>
 ): Promise<T | null>{
   return this.model.findByIdAndDelete(filter,options)
}
  // async findAndUpdateDocument(id:string,payload:):Promise <T|null>{

  // }
//    async deleteDocument(document:T):Promise <T>
//    async updateDocument(document:T):Promise <T>
//    async deletManyDocuments(document:T):Promise <T>

}