import Claim from '../models/claim.js';

export const getClaimRequestListByClient = (req, res) => {
    const clientId = req.query.clientId;

    Claim
    .find({c_job_owner: clientId})
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