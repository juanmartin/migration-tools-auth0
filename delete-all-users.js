require("dotenv").config()
const fs = require("fs")
const fetch = require("node-fetch")


fetch(`${process.env.AUTH0_HOST}/api/v2/users`,
  {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
  .then(data => {
    fs.writeFileSync("auth0-users-backup.json", JSON.stringify(data))
    console.log('Deleting all users from Auth0.')
    data.forEach((u, i) => {
      setTimeout(() => {
        fetch(`${process.env.AUTH0_HOST}/api/v2/users/auth0|${u.identities[0].user_id}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + process.env.AUTH0_TOKEN,
            }
          })
          .then(data => console.log('Deleted User', u.identities[0].user_id, "| Response: ", data.status))
          .catch(err => console.error("Error deleting user.", err))
      }, i * 1000)
    })
  })
  .catch(err => console.error("Error getting users.", err))


