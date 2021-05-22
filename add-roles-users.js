require("dotenv").config()
const fetch = require("node-fetch")
const fs = require("fs")


// tipos de usuario
let admins = [] // id rol 1
let pas = []    // id rol 2
const adminRoleId = "rol_33f0f1rAvQjFj0ES"
const pasRoleId = "rol_26G1WmyNAf1Cp7ky"

// MAIN
getUsers()
  .then(users => {
    fs.writeFileSync("auth0-updated-users.json", JSON.stringify(users))
    console.log("saved users to json.")

    admins = getUsersWithRole(users, 1)
    pas = getUsersWithRole(users, 2)
    // console.log("admins:", admins)
    // console.log("pas:", pas)
    const body = {
      users: []
    }

    body.users = admins
    setUsersToRole(JSON.stringify(body), adminRoleId)
      .then(res => console.log("set users to role admin", res))
      .catch(err => console.error("set users to role admin err", err))

    body.users = pas
    setUsersToRole(JSON.stringify(body), pasRoleId)
      .then(res => console.log("set users to role pas", res))
      .catch(err => console.error("set users to role pas err", err))

  })
  .catch(e => console.error("error al get users", e))



// get users from auth0
async function getUsers() {
  const users = await fetch(`${process.env.AUTH0_HOST}/api/v2/users`,
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
        "Content-Type": "application/json"
      }
    })
  const usersJSON = await users.json()
  return usersJSON
}

// create array of users id with specified rol
function getUsersWithRole(users, rol) {
  const usersWithRole = users.filter(u => {
    return u.app_metadata.rol === rol
  })
  return usersWithRole.map(u => u.user_id)
}

// set rol to specified users
async function setUsersToRole(users, rol) {
  const response = await fetch(`${process.env.AUTH0_HOST}/api/v2/roles/${rol}/users`,
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
        "Content-Type": "application/json"
      },
      body: users
    }
  )
  const resJson = await response.json()
  return resJson
}
