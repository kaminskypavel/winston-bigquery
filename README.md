# winston-bigquery
[Bigquery](http://bigquery.cloud.google.com) transport for [winston logger](https://www.npmjs.com/package/winston)

[![CircleCI](https://circleci.com/gh/kaminskypavel/winston-bigquery.svg?style=svg)](https://circleci.com/gh/kaminskypavel/winston-bigquery)
[![npm version](http://img.shields.io/npm/v/winston-bigquery.svg?style=flat)](https://npmjs.org/package/winston-bigquery "View this project on npm")

## Usage
``` js
import {WinstonBigQuery} from 'winston-bigquery';
import winston, {format} from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		.....
		new WinstonBigQuery({
			dataset: 'logs',
			table: 'winston_logs',
		})
		.....
	]
});

logger.info('Hello World', {
	meta1: 1,
	meta2: 'string',
	meta3: {deepObj: 1}
});

```
## Credentials  
in order to access bigquery we need a service account credentials, there are 3 ways to set it

1. pass `applicationCredentials` containing a path to your key file in options
2. pass `bigquery` option that is already initialized
3. set `GOOGLE_APPLICATION_CREDENTIALS` environment settings
4. set `SERVICE_ACCOUNT` environment settings (recommended)

the latter was added since adding `GOOGLE_APPLICATION_CREDENTIALS` is reported 
to sometimes [break other google sdks](https://stackoverflow.com/questions/54711038/firebase-cloud-functions-failed-to-read-credentials-from-file) (such as firebase) 


## Motivation
Google has its own log solution, [Stackdriver Logging](https://cloud.google.com/logging/).
Unfortunately, I find it messy , inconvenient, and hard to query. On the other hand , Bigquery has an excellent UI
and easy sql-like querying capabilities, it is also optimized to search through HUGE amount of data. 

## Typescript Support
winston-bigquery comes with its' own type definitions, so you wont have to use [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

## Schema
BigQuery need a schema for the its table.
this can be achieved by 2 ways :

1. create your schema manually
2. use the `dropCreate:true` and `schema:{...}` options in the constructor.  
   please refer the [create-table example](./src/examples/create-table.ts)

the following field will always be auto-created for you 

``` js
[
  {
    "name": "timestamp",
    "type": "TIMESTAMP"
  },
  {
    "name": "level",
    "type": "STRING"
  },
  {
    "name": "message",
    "type": "STRING"
  },
  {
    "name": "meta",
    "type": "STRING"
  }
]
```

### Metadata field
everything outside the schema will automatically be flattened out,
converted to string and pushed into the "meta" fieldl

later on you can query the json data with the built-in BigQuery functions
for example : 
```sql 
SELECT t.*, JSON_EXTRACT(t.meta,"$.character_name") FROM `project.schema.table` t LIMIT 1000
```
 
### Installing Winston-Bigquery
`npm i winston-bigquery`

### Run Tests
`npm test`

### Author: [Pavel 'PK' Kaminsky](https://www.pavel-kaminsky.com)

[0]: https://cloud.google.com/logging/docs/setup/nodejs#using_winston
[1]: https://github.com/winstonjs/winston/blob/master/docs/transports.md
[2]: https://cloud.google.com/bigquery/docs/quickstarts/quickstart-client-libraries
[3]: https://github.com/googleapis/nodejs-bigquery/blob/master/samples/insertRowsAsStream.js
[4]: https://googleapis.dev/nodejs/bigquery/latest
