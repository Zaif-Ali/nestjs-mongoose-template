/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ObjectId, Schema, Document } from 'mongoose';

// ✅ Ensure proper typing for Mongoose documents
export interface DocumentConfig extends Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Add default fields & hooks for all schemas
export const mongooseSchemaConfig = (schema: Schema) => {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // ✅ Ensure `updatedAt` updates on save
  schema.pre('save', function (this: DocumentConfig, next) {
    if (!this.isNew) {
      this.updatedAt = new Date();
    }
    next();
  });

  // ✅ Ensure `updatedAt` updates on update queries
  schema.pre('updateOne', function (this) {
    this.set({ updatedAt: new Date() });
  });

  schema.pre('findOneAndUpdate', function (this) {
    this.set({ updatedAt: new Date() });
  });

  // ✅ Virtual 'id' field for better JSON output
  schema.virtual('id').get(function (this: { _id: any }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this._id.toHexString(); // ✅ Proper way to convert ObjectId to string
  });

  // ✅ Clean JSON & Object output
  const transformFunction = (_: unknown, ret: Record<string, string>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  };
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false, // ✅ Remove __v
    transform: transformFunction,
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: transformFunction,
  });
};
