import Package, { packageItemSchema } from "../models/package.js";

export const addPackageCategory = (req, res) => {
    const { name } = req.body;

    const newPackage = new Package({
        p_category_name: name,
        p_items: []
    });

    newPackage
        .save()
        .then(() => {
            return res.status(200).json({ success: true, message: "Successfully created.", package: newPackage });
        })
        .catch(err => {
            console.error(err);

            return res.status(200).json({ success: false, message: "Failed to create.", package: null });
        })
}

export const addPackageItem = (req, res) => {
    const { name, type, altitude, count, descrpition, price } = req.body;
    const { packageId } = req.params;

    Package
        .findByIdAndUpdate(
            packageId,
            { $push: { p_items: { name, type, altitude, count, descrpition, price } } },
            { new: true }
        )
        .then(data => {
            console.log(data);
            
            return res.status(200).json({ success: true, message: "Successfully created", package: data });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: "Failed to create.", package: null });
        })
}

export const deletePackageItem = (req, res) => {
    const { packageId, itemId } = req.params;
    Package
        .findByIdAndUpdate(
            packageId,
            { $pull: { p_items: { _id: itemId } } },
            { new: true }
        )
        .then(updatedPackage => {
            if (!updatedPackage) {
                return res.status(404).json({ success: false, message: "Package not found." });
            }
            return res.status(200).json({ success: true, message: "Successfully deleted.", package: updatedPackage });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to delete.", package: null });
        });
}

export const getPackageList = (req, res) => {
    let match = {};
    Package
        .find(match)
        .then(data => {
            return res.status(200).json({ success: true, packages: data })
        })
        .catch(err => {
            return res.status(500).json({ success: false, packages: [] });
        })
}

export const getPackageDetail = (req, res) => {
    let { packageId } = req.params;

    Package
        .findById(packageId)
        .then(data => {
            return res.status(200).json({ success: true, package: data });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ success: false, package: null });
        })
}