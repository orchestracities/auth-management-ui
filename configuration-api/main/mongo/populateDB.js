const mongoose = require('mongoose');

//require('dotenv').config({ path: '../.env' });

const connection = mongoose.createConnection(process.env.MONGO_DB || 'mongodb://localhost:27017/graphql');

const usrPreference = new mongoose.Schema({
    name: String,
    icon: String,
    primaryColor: String,
    secondaryColor: String
});

const Preferences = connection.model('UsrPreferences', usrPreference);

Preferences.deleteMany({}, function (err) {
    console.log('PopulateDB: clear old data...');
    if (err) {
        console.log(err);
    } else {
        Preferences.create(
            {
                name: 'Tenant1',
                icon: 'none',
                primaryColor: '#8086ba',
                secondaryColor: '#8086ba'
            },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Tenant1 created!');
                    Preferences.create(
                        {
                            name: 'Tenant2',
                            icon: 'none',
                            primaryColor: '#8086ba',
                            secondaryColor: '#8086ba'
                        },
                        function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Tenant2 created!');
                                process.exit();
                            }
                        }
                    );
                }
            }
        );
    }
});
