import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as memberService from '../services/member.service';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const member = await memberService.createMember(req.body);

        // ลบ password ออกจาก object ก่อนส่งกลับ
        const { password, ...safeMember } = member.toObject();

        res.json({ status: "success", data: safeMember });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
};

export const loginMember = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const member = await memberService.findMemberByUsername(username);

    if (!member) {
        res.status(401).json({ status: 'error', message: 'User not found' });
        return;  // return แค่หยุดฟังก์ชัน ไม่ return response
    }

    const isMatch = await memberService.comparePassword(password, member.password);
    if (!isMatch) {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign({ id: member._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ status: 'success', data: member, message: 'login successful', token });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const memberId = (req as any).user.id;
        if (!memberId) {
            res.status(401).json({ status: 'error', message: 'Unauthorized' });
            return;
        }

        const member = await memberService.getMemberById(memberId);
        if (!member) {
            res.status(404).json({ status: 'error', message: 'Member not found' });
            return;
        }

        // ลบ password ก่อนส่งกลับ
        const { password, ...safeMember } = member.toObject();

        res.json({ status: 'success', data: safeMember });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
    }
};