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
        return;
    }

    const isMatch = await memberService.comparePassword(password, member.password);
    if (!isMatch) {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign({ id: member._id }, JWT_SECRET, { expiresIn: '1d' });

    // ลบ password ออกจาก object ก่อนส่งกลับ
    const { password: _, ...safeMember } = member.toObject();

    res.json({ status: 'success', data: safeMember, message: 'login successful', token });
};

