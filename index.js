const Connection = require('./core/Connection');
const Request = require('./core/Request');
const Response = require('./core/Response');

class Broker {
	/**
	 *
	 * Adds listener for subject
	 *
	 * @param Listening Subject [String]
	 * @param Subject Handler [Function]
	 * @param in step when multiple listeners with same subject, to handle only in one instance [String]
	 *
	 * @return Subscription Id [String]
	 */
	
	static async on(route, handler, queue) {
		return Connection.subscribe(route, {
			queue: queue || process.env.npm_package_name
		}, (data, replyTo, subject) => {
			const req = new Request(subject, data);
			const res = new Response(replyTo);

			handler(req, res);
		});
	}

	/**
	 *
	 * Requests for subject and waits for response 
	 *
	 * @param Subject [String]
	 * @param Subject Data [JSON]
	 *
	 * @return [JSON]
	 */
	
	static async get(subject, data) {
		return new Promise((resolve, reject) => {
			Connection.requestOne(subject, data, {}, 1000, function(response) {
				if (response instanceof Connection.instance.NatsError) {
					console.warn("Subject ->", subject, "not processed", response);
					return reject(null);
				}

				return resolve(new Request(subject, response));
			});
		})
	}

	/**
	 *
	 * Pushs subject data 
	 *
	 * @param Subject [String]
	 * @param Subject Data [JSON]
	 *
	 * @return [Boolean]
	 */

	static async push(subject, data) {
		return new Promise((resolve, reject) => {
			Connection.publish(subject, data, function(err) {
				if (err) {
					console.warn("Subject ->", subject, "not deliverd");
					return reject(err);
				}

				return resolve(1);
			});
		});
	}
};

module.exports = Broker;