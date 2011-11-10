var compress = require('compress');

module.exports = function expressGzipMiddleware() {
	return expressGzip;
};

function supportsGzip() {
	var agent = this.header('User-Agent', '');
	return this.header('Accept-Encoding', '').indexOf('gzip') > -1 && !agent.match(/MSIE [56]|SV1/);
}

function setGzipHeader() {
	this.header('Content-Encoding', 'gzip');
	this.header('Vary', 'Accept-Encoding');
}

function expressGzip(req, res, next) {

	req.supportsGzip = supportsGzip;
	res.setGzipHeader = setGzipHeader;

	res.sendGzipped = function(data, headers) {
		if (req.supportsGzip()) {
			res.setGzipHeader();
			var gzip = new compress.Gzip();
			gzip.init();
			var gzipped = gzip.deflate(data, 'utf-8');
			gzipped += gzip.end();
			data = new Buffer(gzipped, 'binary');
		}
		return res.send(data, headers);
	};

	next();

}

