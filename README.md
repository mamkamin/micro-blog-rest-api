# Micro Blog Application

![Educational Purposes](https://img.shields.io/badge/Purpose-Educational-blue)

Micro blog application just like `Thread` and `X/Twitter`. You can create your profile, view, edit and delete your profile. You can also post, view, edit and delete the micro blog you posted. You can follow other user or be followed by other user.

## Seed data

After applying the database migrations and setting `PSQL_CONNECTION_STRING` in `.env`, run:

```sh
npm run seed
```

This adds the sample users `alice` and `bob`, each with two posts. Both use the password `password123`. Existing users and matching posts are left unchanged, so the command is safe to rerun.
