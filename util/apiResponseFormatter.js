// See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html for http status codes

/*
	Handles the sending of responses back to clients. Used
	for consistency across api responses.

	TAKES:
		res: Express response object
		status: Number; status code for the api response,
		message: String; Message to display back to the client,
		payload: Object; The object to optionally deliver back to the client,

*/
var send = function(res, status, message, payload){
	res.send({"status": status, "message":message, "payload": payload});
};

module.exports = {send: send};