# Tweetmix: A Twitter clone built with Remix

- [Remix Docs](https://remix.run/docs)

## Development

We'll be using a local `sqlite` database to power our [Cloudflare D1](https://developers.cloudflare.com/d1/) database. To create this local database, run:

```sh
npm run db:migrate:fresh
```

You can also re-run this task any time you want to wipe your database and start over.

Start the local development server with:

```sh
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!
