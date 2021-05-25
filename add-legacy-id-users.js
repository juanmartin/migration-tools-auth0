require("dotenv").config()
const fetch = require("node-fetch")
// const fs = require("fs")


const DELAY = 1000 // ms between auth0 api calls.

// MAIN
main()


async function main() {
  try {
    const api_users = await getUsersFromAPI()
    const auth0_users = await getUsersFromAuth0()

    auth0_users.forEach((u, i) => {
      const userObj = api_users.find(usr => {
        return usr.uio_login.toLowerCase() === u.username
      })
      if (userObj) {
        console.log("Match!", u.username, userObj.uio_id)
        setTimeout(() => {
          setAppMetadata(u.user_id, userObj.uio_id)
            .then(res => {
              console.log("Setting app_metadata for user", u.username, res)
            })
            .catch(err => console.error("Error setting app_metadata", err))
        }, i * DELAY)
      } else {
        console.log("No match in DB for auth0 user", u.username)
      }
    })
  } catch (err) {
    console.error("Error getting APIs", err)
  }

}

// get users from API
async function getUsersFromAPI() {
  const users = await fetch(`http://localhost:3000/api/v1/usuarios`,
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + process.env.API_TOKEN,
        "Content-Type": "application/json"
      }
    }
  )
  const usersJSON = await users.json()
  // console.log("Get Users from API", usersJSON)
  return usersJSON.users
}

// get users from auth0
async function getUsersFromAuth0() {
  const users = await fetch(`${process.env.AUTH0_HOST}/api/v2/users`,
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
        "Content-Type": "application/json"
      }
    }
  )
  const usersJSON = await users.json()
  // console.log("Get Users from Auth0", usersJSON)
  return usersJSON
}

// set app_metadata to users in auth0
async function setAppMetadata(userId, legacyId) {
  const body = {
    app_metadata: {
      uio_id: legacyId
    }
  }
  const response = await fetch(`${process.env.AUTH0_HOST}/api/v2/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  )
  const resJson = await response.json()
  return resJson
}
