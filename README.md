# JSON generator for Bulk Import in Auth0

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
  

> I dropped the users table after migrating so don't even think about it.