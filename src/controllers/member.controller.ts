import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as memberService from '../services/member.service';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerMember = async (req: Request, res: Response) => {
    try {
        const member = await memberService.createMember(req.body);
        res.json({ status: 'success', data: member });
    } catch {
        res.status(500).json({ status: 'error', message: 'Register failed' });
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

    res.json({
        status: 'success',
        data: member,
        message: 'login successful',
        token
    });
};

export const getMembers = async (_req: Request, res: Response): Promise<void> => {
    const members = await memberService.getAllMembers();
    res.json({ status: 'success', data: members });
};

export const getMemberById = async (req: Request, res: Response): Promise<void> => {
    const member = await memberService.getMemberById(req.params.id);
    res.json({ status: 'success', data: member });
};

export const updateMember = async (req: Request, res: Response): Promise<void> => {
    const updatedMember = await memberService.updateMemberById(req.params.id, req.body);
    res.json({ status: 'success', data: updatedMember });
};

export const deleteMember = async (req: Request, res: Response) => {
    await memberService.deleteMemberById(req.params.id);
    res.json({ status: 'success', message: 'Member deleted' });
};
