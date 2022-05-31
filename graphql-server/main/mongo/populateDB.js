const mongoose = require('mongoose')

require('dotenv').config({ path: '../.env' })

const connection = mongoose.createConnection(process.env.GRAPHQL_SEED)

const usrPreference = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String
})

const Preferences = connection.model('UsrPreferences', usrPreference)


Preferences.deleteMany({}, function (err) {
  console.log('clear everything that was here before..')
  if (err) {
    console.log(err)
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
          console.log(err)
        } else {
          console.log('Tenant1 created!')
          Preferences.create(
            {
              name: 'Tenant2',
              icon: 'none',
              primaryColor: '#8086ba',
              secondaryColor: '#8086ba'
            },
            function (err) {
              if (err) {
                console.log(err)
              } else {
                console.log('Tenant2 created!')
                process.exit()
              }
            }
          )
        }
      }
    )
  }
})
