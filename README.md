# Simple Broker Service Implemented like express using NATS 

## Environment Variables?
| KEY | DEFAULT VALUE |
| ------ | ------ |
| NATS_SERVER_URL | nats://localhost:4222 |
| NATS_CLIENT_NAME | process.env.npm_package_name |

## How to use?
```sh
const broker = require('broker');

broker.on('foo', [Function]);

broker.get('foo', {})
	.then((response) => {
		...	
	});

broker.push('foo', {}); // without response
```
