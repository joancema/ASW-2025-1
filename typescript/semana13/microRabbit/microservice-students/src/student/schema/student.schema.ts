import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema(
  {
    identificacion: { type: String, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    tipo: { type: Number, required: true },
  },
  { timestamps: true },
);

StudentSchema.index({ nombre: 1 }, { unique: true });
StudentSchema.index({ identificacion: 1 }, { unique: true });
