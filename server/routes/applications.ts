import { authenticateToken, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import {Router, Request, Response } from 'express';
const router = Router();

//GET/api/applications/stats
//Returns stats
router.get('/stats', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const userId = req.user!.userId;
        //Total number of applications
        const total = await prisma.application.count({
            where: { userId }
        });
        const byStatusRaw = await prisma.application.groupBy({
            by: ['status'],
            where: { userId },
            _count: {status: true }
        });
//How many applications in each status
        const byStatus = byStatusRaw.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
            //record it as String: Number
        }, {} as Record<string, number>);


//Number of applications with response, not equal to applied
        const responded = await prisma.application.count({
            where: {
                userId,
                status: {not: 'APPLIED'}}
        });
//Percentage of applications responded
        const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

//send the result as JSON
        res.json({
            totalApplications: total,
            responseRate,
            byStatus
        });
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch stats'});
    }
});

//GET/api/applications
//Returns all applications
router.get('/', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const userId = req.user!.userId;
        const applications = await prisma.application.findMany({
            where: { userId },
            orderBy: {appliedDate: 'desc'}
        });
        //return all applications as JSON
        res.json({ applications });
    } catch(error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
    });


//GET/api/applications/:id
//Returns one application by id
router.get('/:id', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const userId = req.user!.userId;

        const application = await prisma.application.findFirst({
            where: {
                id,
                userId //ensures user can only see their own application
            }
        });
        if (!application) {
            res.status(404).json({error: 'Application not found'});
            return;
        }
        res.json({application});
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch application'});
    }
    });


//POST/api/applications
//Create a new application
router.post('/', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const {company, role, status, appliedDate, nextActionDate, notes, jobUrl} = req.body;
        const userId = req.user!.userId;

        if (!company || !role || !status) {
            res.status(404).json({
                error: 'Company, role and status are required'
            });
            return;
        }

        const application = await prisma.application.create({
            data: {
                company,
                role,
                status,
                appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
                nextActionDate: nextActionDate ? new Date(nextActionDate) : null,
                notes: notes || '',
                jobUrl: jobUrl || null,
                userId // real userId from JWT token
            }
        });

        res.status(201).json({
            message: 'Application created successfully.',
            application
        });
    } catch(error) {
        res.status(500).json({ error: 'Failed to create application' });
    }
    });


//PUT /api/applications/:id
//Updates an existing application
router.put('/:id', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const userId = req.user!.userId;

        const existing = await prisma.application.findFirst(
            {where: {id, userId }}
        );

        if (!existing) {
            res.status(404).json({
                error: 'Application not found'
            });
            return;
        }

        const application = await prisma.application.update({
            where: { id },
            data: req.body
        });

        res.json({
            message: 'Application updated successfully.',
            application
        });
    } catch(error) {
        res.status(500).json({error: 'Failed to update application'});
    }
    });


//DELETE/api/applications/:id
//Delete an application
router.delete('/:id', authenticateToken, async (req:AuthRequest, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const userId = req.user!.userId;

        const existing = await prisma.application.findFirst({
            where: { id, userId }
        });
        if (!existing) {
            res.status(404).json({error: 'Application not found'});
            return;
        }

        const application = await prisma.application.delete({
            where: { id }
        });

        res.status(200).json({
            message: 'Application deleted successfully.',
            application
        });
    } catch (error) {
        res.status(500).json({error: 'Failed to delete application'});
    }
});

//import and use the router
export default router;


