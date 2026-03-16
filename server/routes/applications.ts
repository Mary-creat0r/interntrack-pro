import {Router, Request, Response } from 'express';
const router = Router();

//Temporary data - would be replaced by PostgresSQL in Week 3
const applications = [
    {
    id:1,
    company: 'Google',
    role: 'Software Engineer Intern',
    status:'INTERVIEW',
    appliedDate:'2026-03-01',
    nextActionDate:'2026-03-20',
    notes:'Found on LinkedIn'
},
    {
        id:2,
        company: 'Meta',
        role: 'Frontend Intern',
        status:'APPLIED',
        appliedDate:'2026-03-05',
        nextActionDate:'2026-03-25',
        notes:'Referral from friend'
    },
    {
        id:3,
        company: 'Apple',
        role: 'iOS Developer Intern',
        status:'ASSESSMENT',
        appliedDate:'2026-02-28',
        nextActionDate:'2026-02-30',
        notes:'Applied via careers page'
    },
]

//GET/api/applications/stats
//Returns stats
router.get('/stats',(_req:Request, res:Response) => {
    //Total number of applications
    const total = applications.length;
//How many applications in each status
    const byStatus = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
        //record it as String: Number
    }, {} as Record<string, number>);


//Number of applications with response, not equal to applied
    const responded = applications.filter(a => a.status != 'APPLIED').length;
//Percentage of applications responded
    const responseRate = Math.round((responded / total) * 100);

//send the result as JSON
    res.json({
        totalApplications: total,
        responseRate,
        byStatus
    });
});

//GET/api/applications
//Returns all applications
router.get('/',(_req:Request, res:Response) => {
    //return all applications as JSON
res.json({applications});
});

//GET/api/applications/:id
//Returns one application by id
router.get('/:id',(req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const application = applications.find(a  => a.id === id);

if (!application) {
    res.status(404).json('Application not Found');
    return;
}
    res.json({application});
});

//POST/api/applications
//Create a new application
router.post('/', (req:Request, res:Response) => {
    const {company, role, status, appliedDate, nextActionDate, notes} = req.body;

    if (!company || !role || !status) {
        res.status(404).json({
            error: 'Company, role and status are required'
        });
        return;
    }

    const newApplication = {
        id: applications.length + 1,
        company,
        role,
        status,
        appliedDate: appliedDate || new Date().toISOString().split('T')[0],
        nextActionDate: nextActionDate || null,
        notes: notes || '',
    };
    applications.push(newApplication);

    res.status(201).json({
        message: 'Application created successfully.',
    application: newApplication
    });
});

//PUT /api/applications/:id
//Updates an existing application
router.put('/:id',(req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const index = applications.findIndex(a => a.id === id);

    if (index === -1) {
        res.status(404).json({
            error: 'Application not found'
        });
        return;
    }

    applications[index] = {...applications[index], ...req.body};

    res.json({
        message: 'Application updated successfully.',
        application: applications[index]
    });
});

//DELETE/api/applications/:id
//Delete an application
router.delete('/:id',(req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const index = applications.findIndex(a => a.id === id);

    if (index === -1) {
        res.status(404).json({
            error: 'Application not found'
        })
        return;
    }
    applications.splice(index, 1);

    //delete the application
    res.status(200).json({
        message: 'Application deleted successfully.',
    });
});

//import and use the router
export default router;


