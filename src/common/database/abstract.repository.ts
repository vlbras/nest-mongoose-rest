import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create(data: Omit<TDocument, '_id'>): Promise<TDocument> {
    try {
      const createdDocument = new this.model(data);
      return await createdDocument.save();
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(filterQuery?: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean();
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean().exec();
    if (!document) {
      throw new NotFoundException(`${this.model.modelName} not found!`);
    }
    return document as TDocument;
  }

  async updateOne(
    filterQuery: FilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    try {
      const document = await this.model.findOneAndUpdate(filterQuery, data, {
        new: true,
      });
      if (!document) {
        throw new NotFoundException(`${this.model.modelName} not found!`);
      }
      return document;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    await this.findOne(filterQuery);
    return this.model.findOneAndDelete(filterQuery).lean();
  }

  private handleError(error: any): void {
    if (error.code === 11000) {
      const conflictKeys = Object.keys(error.keyValue).join(', ');
      const errorMessage = `${this.model.modelName} already exists with unique key(s): ${conflictKeys}`;
      throw new ConflictException(errorMessage);
    }
    throw error;
  }
}
