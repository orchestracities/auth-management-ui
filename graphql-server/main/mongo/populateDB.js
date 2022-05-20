const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });

const connection = mongoose.createConnection(process.env.GRAPHQL_MONGO_DB);

const usrPreference = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
});

const Preferences = connection.model("UsrPreferences", usrPreference);

const usrSettings = new mongoose.Schema({
  usrName: String,
  language: String,
});

const Settings = connection.model("UsrSettings", usrSettings);

Preferences.deleteMany({}, function (err, small) {
  console.log('clear everything that was here before..');
  Preferences.create(
    {
      name: "Tenant1",
      icon: "none",
      primaryColor: "#8086ba",
      secondaryColor: "#8086ba",
    },
    function (err, small) {
      if (err) {
        console.log(err);
      } else {
        console.log("Tenant1 created!");
        Preferences.create(
          {
            name: "Tenant2",
            icon: "none",
            primaryColor: "#8086ba",
            secondaryColor: "#8086ba",
          },
          function (err, small) {
            if (err) {
              console.log(err);
            } else {
              console.log("Tenant2 created!");
              process.exit();
            }
          }
        );
      }
    }
  )
}
);
