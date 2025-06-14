import { Request, Response } from 'express';
import * as memberService from '../services/member.service';

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
