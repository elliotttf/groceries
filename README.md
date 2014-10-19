# Simple Grocery List

This list app is simple, keep it that way.

## Configuration

The following DB conneciton variables should be exported as environment vars:

* `MONGO_HOST` - the MongoDB host, defaults to `127.0.0.1`.
* `MONGO_PORT` - the MongoDB port, defaults to `27017`.
* `MONGO_USER` - the MongoDB user, optional.
* `MONGO_PASS` - the MongoDB password, optional.
* `MONGO_DB` - the MongoDB database, defaults to `list`.
* `MONGO_COLLECTION` - the MongoDB collection, defaults to `lists`.

## Installing and running

```bash
npm install
npm start
```

