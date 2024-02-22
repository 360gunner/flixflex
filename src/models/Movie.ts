import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  apiId: string; 
  title: string;
  isMovie: boolean; 
  details: any; 
  trailer: string; 
}

const movieSchema: Schema = new Schema({
  apiId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  isMovie: { type: Boolean, required: true },
  details: { type: Schema.Types.Mixed },
  trailer: { type: String },
});

export default mongoose.model<IMovie>('Movie', movieSchema);
