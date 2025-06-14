import { Request, Response } from 'express';
import * as memberService from '../services/member.service';

export const getMembers = async (_req: Request, res: Response): Promise<void> => {
    const members = await memberService.getAllMembers();

    // ลบ password ออกจากแต่ละสมาชิกก่อนส่ง
    const safeMembers = members.map(member => {
        const { password, ...safeMember } = member.toObject ? member.toObject() : member;
        return safeMember;
    });

    res.json({ status: 'success', data: safeMembers });
};


export const getMemberById = async (req: Request, res: Response): Promise<void> => {
    try {
        const member = await memberService.getMemberById(req.params.id);

        if (!member) {
            res.status(404).json({ status: "error", message: "Member not found" });
            return;
        }

        // ลบ password ออกจาก member ก่อนส่ง
        const { password, ...safeMember } = member.toObject ? member.toObject() : member;

        res.json({ status: "success", data: safeMember });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


export const updateMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: any = {
            fullName: req.body.fullName,
            telephone: req.body.telephone,
        };
        const updatedMember = await memberService.updateMemberById(req.params.id, data);

        if (!updatedMember) {
            res.status(404).json({ status: 'error', message: 'Member not found' });
            return;
        }

        // ลบ password ก่อนส่ง
        const { password, ...safeMember } = updatedMember.toObject ? updatedMember.toObject() : updatedMember;

        res.json({ status: 'success', data: safeMember });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};


export const deleteMember = async (req: Request, res: Response) => {
    await memberService.deleteMemberById(req.params.id);
    res.json({ status: 'success', message: 'Member deleted' });
};
