# Migration Tools for Auth0 users

This repo is now a set of tools I wrote to be able to use Auth0 as my authentication and authorization provider in an app I made which already had a users table in its db.

Since I still needed to keep my users table for some functionality, I implemented these tools to do bulk operations on my db and auth0's user store.

I know I could have chosen a different path for my app (I don't like the fact that I'm keeping users in two stores, feels wrong) but for now, I wrote these tools to help me achieve my urgent goals. And it worked!
## JSON generator for Bulk Import in Auth0

This little and simple tool connects to PosgreSQL db, gets all users and generates a JSON file formatted according to [Auth0 docs](https://auth0.com/docs/users/bulk-user-import-database-schema-and-examples).

I needed this to bulk import all my users from legacy database to Auth0 without paying for a plan and making use of proper features like Custom Database Connections or the automatic lazy migration.

### NEW and DANGEROUS feature! now you can **bulk delete** ALL of your users!
 - Create `.env` file as stated below (only AUTH0... vars needed if you're only deleting).
 - Run `node delete-all-users.js`.

## Instructions
- Clone repo.
- `npm i`
- Create `.env` file in project's root directory replacing with your information:
  ```
  PGHOST=ip.to.your.host
  PGUSER=username
  PGDATABASE=database-name
  PGPASSWORD=password
  PGPORT=port
  // The ones below are only needed to bulk delete all users.
  AUTH0_HOST=https://your.auth0.host.com
  AUTH0_TOKEN=bearer_token
  ```
- Create sequelize models with **[this](https://github.com/sequelize/sequelize-auto)**.
  - You'll get a `.js` file for each table and an `init-models.js` which should be put in `db/models/`. We only need the table containing user data though.
- *The script comes with the structure I used*. Modify `index.js` according to your user data and needs. You can uncomment the `console.log`s to check how's your data structured, or directly write it to the JSON file.
- Run `node index.js`
- ???
- Profit
- Oh right, upload `users-for-auth0.json` to the bulk import plugin in Auth0.
- Done. You have migrated from your old rusty db users to an almighty corporate IDaaS production ready infrastructure.
  

## Add legacy user id to Auth0 `app_metadata`

This one puts your user id from legacy db to `app_metadata` field in Auth0 users. 

- Configure code according to your user db.
- Run `node add-legacy-id-users.js`

## Add Roles to users in Auth0

This one assigns roles in Auth0 users according to roles in my db.

- Modify code according to your user roles.
- Run `node add-roles-users.js`


# TO-DO
- Better explain how to adapt the tools to anyone's need. But if you need help just hit me up or open an issue.
- Add to this repo the actions and rules I wrote in Auth0 to consume this data.