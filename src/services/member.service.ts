import CounterModel from '../models/counter.model';
import MemberModel from '../models/member.model';
import bcrypt from 'bcryptjs';

export async function getNextMemberCode(): Promise<string> {
    const counter = await CounterModel.findOneAndUpdate(
        { _id: 'memberCode' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return `M${counter.seq.toString().padStart(6, '0')}`; // M000001, M000002 ...
}

export const createMember = async (data: any) => {
  // เช็ค username ซ้ำ
  const existingUser = await MemberModel.findOne({ username: data.username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const memberCode = await getNextMemberCode();

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const member = new MemberModel({
    memberCode,
    ...data,
    password: hashedPassword,
  });

  return await member.save();
};


export const findMemberByUsername = async (username: string) => {
    return await MemberModel.findOne({ username });
};

export const comparePassword = async (inputPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
};

export const getAllMembers = async () => {
    return await MemberModel.find();
};

export const getMemberById = async (id: string) => {
    return await MemberModel.findById(id);
};

export const updateMemberById = async (id: string, data: Partial<typeof MemberModel>) => {
    return await MemberModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMemberById = async (id: string) => {
    return await MemberModel.findByIdAndDelete(id);
};
