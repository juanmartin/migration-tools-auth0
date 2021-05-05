require("dotenv").config()
const db = require("./db")
// db models
const initModels = require("./db/models/init-models")
const models = initModels(db.sequelize)
const fs = require('fs')


const getUsers = async () => {
  try {
    const usersDB = await models.cbo_usuario.findAll()
    // console.log(JSON.stringify(usersDB))
    const userJSON = usersDB.map(u => {
      const email = u.uio_login + "@" + "siniestros" + ".com"
      return {
        email: email,
        email_verified: true,
        given_name: u.uio_primernombre ?? "SinNombre",
        family_name: u.uio_segundonombre ?? "SinApellido",
        username: u.uio_login,
        custom_password_hash: {
          algorithm: "md5",
          hash: {
            value: u.uio_password,
            encoding: "base64"
          }
        },
        app_metadata: {
          rol: u.uio_rol
        }
      }
    })
    // console.log(JSON.stringify(userJSON))
    fs.writeFile("users-for-auth0.json", JSON.stringify(userJSON), (err) => {
      if (err) throw err
      console.log('JSON saved successfully.')
    })
  } catch (err) {
    console.error("Error fetching from DB.", err)
  }
}

getUsers()