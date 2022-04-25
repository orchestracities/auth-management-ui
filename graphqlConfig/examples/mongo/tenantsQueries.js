const mongoose = require("mongoose");


const usrPreference = new mongoose.Schema({
    name: String,
    icon: String,
    primaryColor: String,
    secondaryColor: String,
});

const Preferences = mongoose.model('UsrPreferences', usrPreference);

require('dotenv').config({ path: '../.env' })

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.REACT_APP_MONGO_DB);
}

async function get(data) {
    const thisUser = await Preferences.find({ name: { $in: data } })

    return await thisUser;
}


async function update(data) {
    const filter = { name: data.name };
    const update = {
        name: data.name,
        icon: data.icon,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor
    };

    let thisTenant = await Preferences.findOneAndUpdate(filter, update);
    return await thisTenant;
}


async function add(data) {
    const arrayOfData = {
        name: data.name,
        icon: data.icon,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor
    };

    let thisTenant = await arrayOfData.save(function (err) {
        if (err) return handleError(err);
        // that's it!
    });
    return await thisTenant;
}

async function deleteTenant(data) {
    const thisUser = await Preferences.find({ name: { $in: data } })

    for (let e of thisUser) {
        let deletedOwner = await Preferences.findByIdAndRemove(e._id);

    }
    return await (typeof deletedOwner === 'object') ? true : false;
}


module.exports = {
    get,
    update,
    add,
    deleteTenant,
}