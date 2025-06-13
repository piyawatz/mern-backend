import { Schema, model, Document } from 'mongoose';

interface ICounter extends Document {
  _id: string;   // ชื่อ sequence เช่น 'memberCode'
  seq: number;   // ค่าปัจจุบันของตัวนับ
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const CounterModel = model<ICounter>('Counter', counterSchema);

export default CounterModel;
