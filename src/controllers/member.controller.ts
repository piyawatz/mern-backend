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

export const getMembers = async (_req: Request, res: Response): Promise<void> => {
    const members = await memberService.getAllMembers();
    res.json({ status: 'success', data: members });
};

export const getMemberById = async (req: Request, res: Response): Promise<void> => {
    try {
        const member = await memberService.getMemberById(req.params.id);

        if (!member) {
            res.status(404).json({ status: "error", message: "Member not found" });
            return;
        }

        res.json({ status: "success", data: member });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const updateMember = async (req: Request, res: Response): Promise<void> => {
    const data: any = {
        fullName: req.body.fullName,
        telephone: req.body.telephone,
    }
    const updatedMember = await memberService.updateMemberById(req.params.id, data);
    res.json({ status: 'success', data: updatedMember });
};

export const deleteMember = async (req: Request, res: Response) => {
    await memberService.deleteMemberById(req.params.id);
    res.json({ status: 'success', message: 'Member deleted' });
};
