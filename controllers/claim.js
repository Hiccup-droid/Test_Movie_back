import Claim from '../models/claim.js';
import Job from '../models/job.js';

export const getClaimRequestListByClient = (req, res) => {
    const clientId = req.query.clientId;

    Claim
    .find({c_job_owner: clientId, c_done: false})
    .populate([
        {path: 'c_claimer'},
        {path: 'c_job'}
    ])
    .then(claims => {
        return res.status(200).json({success: true, claims});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({success: false, claims: []});
    })
}

export const makeNewClaimRequestByPilot = (req, res) => {
    const {c_job_owner, c_job, c_content, c_claimer } = req.body;

    Claim
    .findOne({c_job_owner: c_job_owner, c_job: c_job})
    .then(data => {
        if(data) {
            return res.status(500).send({message: 'Already claimed', success: false});
        }
        const newClaim = new Claim({
            c_job_owner,
            c_job,
            c_content,
            c_claimer
        });
    
        newClaim
        .save()
        .then(() => {
            return res.status(200).send({message: 'Claim succeed.', success: true});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'Claim failed.', success: false})
        })
    })
}

export const approveClaimByClient = (req, res) => {
    const { claimId, claimerId, jobId } = req.body;

    Claim
    .findByIdAndUpdate(claimId, {c_done: true})
    .then((a) => {

        console.log(claimId);
        
        Job
        .findByIdAndUpdate(jobId, {$push: {j_developers: claimerId}, j_progress: 'doing'})
        .then(() => {
            return res.status(200).json({message: 'Successfully approved.', success: true});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({message: 'Approve Failed.', success: false});
        })

    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({message: 'Approve Failed.', success: false});
    })
}