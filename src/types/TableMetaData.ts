// https://cloud.google.com/nodejs/docs/reference/bigquery/3.0.x/Table#getMetadata

interface TableMetaData {
	kind?: string;
	etag?: string;
	id?: string;
	selfLink?: string;
	tableReference?: TableReference;
	schema?: Schema;
	numBytes?: string;
	numLongTermBytes?: string;
	numRows?: string;
	creationTime?: string;
	lastModifiedTime?: string;
	type?: string;
	location?: string;
	streamingBuffer?: StreamingBuffer;
}
interface ApiResponse {
	headers: Headers;
}

interface Headers {
	'alt-svc': string;
	'cache-control': string;
	'content-encoding': string;
	'content-type': string;
	date: string;
	etag: string;
	server: string;
	'transfer-encoding': string;
	vary: string;
	'x-content-type-options': string;
	'x-frame-options': string;
	'x-xss-protection': string;
}

interface StreamingBuffer {
	estimatedBytes: string;
	estimatedRows: string;
	oldestEntryTime: string;
}

interface Schema {
	fields: Field[];
}

interface Field {
	name: string;
	type: string;
}

interface TableReference {
	projectId: string;
	datasetId: string;
	tableId: string;
}
