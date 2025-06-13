import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
    memberCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    telephone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { versionKey: false });  // ปิด __v

export default mongoose.model('Member', MemberSchema);