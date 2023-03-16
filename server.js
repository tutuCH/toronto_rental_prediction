import require$$1, { resolve, join, normalize, dirname } from 'path';
import require$$0$1 from 'buffer';
import require$$0$2 from 'tty';
import require$$1$1 from 'util';
import * as fs from 'fs';
import fs__default, { readdirSync, statSync } from 'fs';
import require$$4 from 'net';
import require$$7 from 'zlib';
import { readFile } from 'fs/promises';
import http from 'http';
import * as qs from 'querystring';
import { once } from 'events';
import { Readable } from 'stream';
import { Headers as Headers$1, Request as Request$1, FormData, File, Response as Response$1, fetch as fetch$1 } from 'undici';
import crypto from 'crypto';
import Streams from 'stream/web';
import { fileURLToPath } from 'url';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var compressionExports$1 = {};
var compression$1 = {
  get exports(){ return compressionExports$1; },
  set exports(v){ compressionExports$1 = v; },
};

var negotiatorExports = {};
var negotiator = {
  get exports(){ return negotiatorExports; },
  set exports(v){ negotiatorExports = v; },
};

var charsetExports = {};
var charset = {
  get exports(){ return charsetExports; },
  set exports(v){ charsetExports = v; },
};

/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredCharset;

function requireCharset () {
	if (hasRequiredCharset) return charsetExports;
	hasRequiredCharset = 1;

	/**
	 * Module exports.
	 * @public
	 */

	charset.exports = preferredCharsets;
	charsetExports.preferredCharsets = preferredCharsets;

	/**
	 * Module variables.
	 * @private
	 */

	var simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

	/**
	 * Parse the Accept-Charset header.
	 * @private
	 */

	function parseAcceptCharset(accept) {
	  var accepts = accept.split(',');

	  for (var i = 0, j = 0; i < accepts.length; i++) {
	    var charset = parseCharset(accepts[i].trim(), i);

	    if (charset) {
	      accepts[j++] = charset;
	    }
	  }

	  // trim accepts
	  accepts.length = j;

	  return accepts;
	}

	/**
	 * Parse a charset from the Accept-Charset header.
	 * @private
	 */

	function parseCharset(str, i) {
	  var match = simpleCharsetRegExp.exec(str);
	  if (!match) return null;

	  var charset = match[1];
	  var q = 1;
	  if (match[2]) {
	    var params = match[2].split(';');
	    for (var j = 0; j < params.length; j++) {
	      var p = params[j].trim().split('=');
	      if (p[0] === 'q') {
	        q = parseFloat(p[1]);
	        break;
	      }
	    }
	  }

	  return {
	    charset: charset,
	    q: q,
	    i: i
	  };
	}

	/**
	 * Get the priority of a charset.
	 * @private
	 */

	function getCharsetPriority(charset, accepted, index) {
	  var priority = {o: -1, q: 0, s: 0};

	  for (var i = 0; i < accepted.length; i++) {
	    var spec = specify(charset, accepted[i], index);

	    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
	      priority = spec;
	    }
	  }

	  return priority;
	}

	/**
	 * Get the specificity of the charset.
	 * @private
	 */

	function specify(charset, spec, index) {
	  var s = 0;
	  if(spec.charset.toLowerCase() === charset.toLowerCase()){
	    s |= 1;
	  } else if (spec.charset !== '*' ) {
	    return null
	  }

	  return {
	    i: index,
	    o: spec.i,
	    q: spec.q,
	    s: s
	  }
	}

	/**
	 * Get the preferred charsets from an Accept-Charset header.
	 * @public
	 */

	function preferredCharsets(accept, provided) {
	  // RFC 2616 sec 14.2: no header = *
	  var accepts = parseAcceptCharset(accept === undefined ? '*' : accept || '');

	  if (!provided) {
	    // sorted list of all charsets
	    return accepts
	      .filter(isQuality)
	      .sort(compareSpecs)
	      .map(getFullCharset);
	  }

	  var priorities = provided.map(function getPriority(type, index) {
	    return getCharsetPriority(type, accepts, index);
	  });

	  // sorted list of accepted charsets
	  return priorities.filter(isQuality).sort(compareSpecs).map(function getCharset(priority) {
	    return provided[priorities.indexOf(priority)];
	  });
	}

	/**
	 * Compare two specs.
	 * @private
	 */

	function compareSpecs(a, b) {
	  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
	}

	/**
	 * Get full charset string.
	 * @private
	 */

	function getFullCharset(spec) {
	  return spec.charset;
	}

	/**
	 * Check if a spec has any quality.
	 * @private
	 */

	function isQuality(spec) {
	  return spec.q > 0;
	}
	return charsetExports;
}

var encodingExports = {};
var encoding = {
  get exports(){ return encodingExports; },
  set exports(v){ encodingExports = v; },
};

/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredEncoding;

function requireEncoding () {
	if (hasRequiredEncoding) return encodingExports;
	hasRequiredEncoding = 1;

	/**
	 * Module exports.
	 * @public
	 */

	encoding.exports = preferredEncodings;
	encodingExports.preferredEncodings = preferredEncodings;

	/**
	 * Module variables.
	 * @private
	 */

	var simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

	/**
	 * Parse the Accept-Encoding header.
	 * @private
	 */

	function parseAcceptEncoding(accept) {
	  var accepts = accept.split(',');
	  var hasIdentity = false;
	  var minQuality = 1;

	  for (var i = 0, j = 0; i < accepts.length; i++) {
	    var encoding = parseEncoding(accepts[i].trim(), i);

	    if (encoding) {
	      accepts[j++] = encoding;
	      hasIdentity = hasIdentity || specify('identity', encoding);
	      minQuality = Math.min(minQuality, encoding.q || 1);
	    }
	  }

	  if (!hasIdentity) {
	    /*
	     * If identity doesn't explicitly appear in the accept-encoding header,
	     * it's added to the list of acceptable encoding with the lowest q
	     */
	    accepts[j++] = {
	      encoding: 'identity',
	      q: minQuality,
	      i: i
	    };
	  }

	  // trim accepts
	  accepts.length = j;

	  return accepts;
	}

	/**
	 * Parse an encoding from the Accept-Encoding header.
	 * @private
	 */

	function parseEncoding(str, i) {
	  var match = simpleEncodingRegExp.exec(str);
	  if (!match) return null;

	  var encoding = match[1];
	  var q = 1;
	  if (match[2]) {
	    var params = match[2].split(';');
	    for (var j = 0; j < params.length; j++) {
	      var p = params[j].trim().split('=');
	      if (p[0] === 'q') {
	        q = parseFloat(p[1]);
	        break;
	      }
	    }
	  }

	  return {
	    encoding: encoding,
	    q: q,
	    i: i
	  };
	}

	/**
	 * Get the priority of an encoding.
	 * @private
	 */

	function getEncodingPriority(encoding, accepted, index) {
	  var priority = {o: -1, q: 0, s: 0};

	  for (var i = 0; i < accepted.length; i++) {
	    var spec = specify(encoding, accepted[i], index);

	    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
	      priority = spec;
	    }
	  }

	  return priority;
	}

	/**
	 * Get the specificity of the encoding.
	 * @private
	 */

	function specify(encoding, spec, index) {
	  var s = 0;
	  if(spec.encoding.toLowerCase() === encoding.toLowerCase()){
	    s |= 1;
	  } else if (spec.encoding !== '*' ) {
	    return null
	  }

	  return {
	    i: index,
	    o: spec.i,
	    q: spec.q,
	    s: s
	  }
	}
	/**
	 * Get the preferred encodings from an Accept-Encoding header.
	 * @public
	 */

	function preferredEncodings(accept, provided) {
	  var accepts = parseAcceptEncoding(accept || '');

	  if (!provided) {
	    // sorted list of all encodings
	    return accepts
	      .filter(isQuality)
	      .sort(compareSpecs)
	      .map(getFullEncoding);
	  }

	  var priorities = provided.map(function getPriority(type, index) {
	    return getEncodingPriority(type, accepts, index);
	  });

	  // sorted list of accepted encodings
	  return priorities.filter(isQuality).sort(compareSpecs).map(function getEncoding(priority) {
	    return provided[priorities.indexOf(priority)];
	  });
	}

	/**
	 * Compare two specs.
	 * @private
	 */

	function compareSpecs(a, b) {
	  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
	}

	/**
	 * Get full encoding string.
	 * @private
	 */

	function getFullEncoding(spec) {
	  return spec.encoding;
	}

	/**
	 * Check if a spec has any quality.
	 * @private
	 */

	function isQuality(spec) {
	  return spec.q > 0;
	}
	return encodingExports;
}

var languageExports = {};
var language = {
  get exports(){ return languageExports; },
  set exports(v){ languageExports = v; },
};

/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredLanguage;

function requireLanguage () {
	if (hasRequiredLanguage) return languageExports;
	hasRequiredLanguage = 1;

	/**
	 * Module exports.
	 * @public
	 */

	language.exports = preferredLanguages;
	languageExports.preferredLanguages = preferredLanguages;

	/**
	 * Module variables.
	 * @private
	 */

	var simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;

	/**
	 * Parse the Accept-Language header.
	 * @private
	 */

	function parseAcceptLanguage(accept) {
	  var accepts = accept.split(',');

	  for (var i = 0, j = 0; i < accepts.length; i++) {
	    var language = parseLanguage(accepts[i].trim(), i);

	    if (language) {
	      accepts[j++] = language;
	    }
	  }

	  // trim accepts
	  accepts.length = j;

	  return accepts;
	}

	/**
	 * Parse a language from the Accept-Language header.
	 * @private
	 */

	function parseLanguage(str, i) {
	  var match = simpleLanguageRegExp.exec(str);
	  if (!match) return null;

	  var prefix = match[1];
	  var suffix = match[2];
	  var full = prefix;

	  if (suffix) full += "-" + suffix;

	  var q = 1;
	  if (match[3]) {
	    var params = match[3].split(';');
	    for (var j = 0; j < params.length; j++) {
	      var p = params[j].split('=');
	      if (p[0] === 'q') q = parseFloat(p[1]);
	    }
	  }

	  return {
	    prefix: prefix,
	    suffix: suffix,
	    q: q,
	    i: i,
	    full: full
	  };
	}

	/**
	 * Get the priority of a language.
	 * @private
	 */

	function getLanguagePriority(language, accepted, index) {
	  var priority = {o: -1, q: 0, s: 0};

	  for (var i = 0; i < accepted.length; i++) {
	    var spec = specify(language, accepted[i], index);

	    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
	      priority = spec;
	    }
	  }

	  return priority;
	}

	/**
	 * Get the specificity of the language.
	 * @private
	 */

	function specify(language, spec, index) {
	  var p = parseLanguage(language);
	  if (!p) return null;
	  var s = 0;
	  if(spec.full.toLowerCase() === p.full.toLowerCase()){
	    s |= 4;
	  } else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) {
	    s |= 2;
	  } else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
	    s |= 1;
	  } else if (spec.full !== '*' ) {
	    return null
	  }

	  return {
	    i: index,
	    o: spec.i,
	    q: spec.q,
	    s: s
	  }
	}
	/**
	 * Get the preferred languages from an Accept-Language header.
	 * @public
	 */

	function preferredLanguages(accept, provided) {
	  // RFC 2616 sec 14.4: no header = *
	  var accepts = parseAcceptLanguage(accept === undefined ? '*' : accept || '');

	  if (!provided) {
	    // sorted list of all languages
	    return accepts
	      .filter(isQuality)
	      .sort(compareSpecs)
	      .map(getFullLanguage);
	  }

	  var priorities = provided.map(function getPriority(type, index) {
	    return getLanguagePriority(type, accepts, index);
	  });

	  // sorted list of accepted languages
	  return priorities.filter(isQuality).sort(compareSpecs).map(function getLanguage(priority) {
	    return provided[priorities.indexOf(priority)];
	  });
	}

	/**
	 * Compare two specs.
	 * @private
	 */

	function compareSpecs(a, b) {
	  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
	}

	/**
	 * Get full language string.
	 * @private
	 */

	function getFullLanguage(spec) {
	  return spec.full;
	}

	/**
	 * Check if a spec has any quality.
	 * @private
	 */

	function isQuality(spec) {
	  return spec.q > 0;
	}
	return languageExports;
}

var mediaTypeExports = {};
var mediaType = {
  get exports(){ return mediaTypeExports; },
  set exports(v){ mediaTypeExports = v; },
};

/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredMediaType;

function requireMediaType () {
	if (hasRequiredMediaType) return mediaTypeExports;
	hasRequiredMediaType = 1;

	/**
	 * Module exports.
	 * @public
	 */

	mediaType.exports = preferredMediaTypes;
	mediaTypeExports.preferredMediaTypes = preferredMediaTypes;

	/**
	 * Module variables.
	 * @private
	 */

	var simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;

	/**
	 * Parse the Accept header.
	 * @private
	 */

	function parseAccept(accept) {
	  var accepts = splitMediaTypes(accept);

	  for (var i = 0, j = 0; i < accepts.length; i++) {
	    var mediaType = parseMediaType(accepts[i].trim(), i);

	    if (mediaType) {
	      accepts[j++] = mediaType;
	    }
	  }

	  // trim accepts
	  accepts.length = j;

	  return accepts;
	}

	/**
	 * Parse a media type from the Accept header.
	 * @private
	 */

	function parseMediaType(str, i) {
	  var match = simpleMediaTypeRegExp.exec(str);
	  if (!match) return null;

	  var params = Object.create(null);
	  var q = 1;
	  var subtype = match[2];
	  var type = match[1];

	  if (match[3]) {
	    var kvps = splitParameters(match[3]).map(splitKeyValuePair);

	    for (var j = 0; j < kvps.length; j++) {
	      var pair = kvps[j];
	      var key = pair[0].toLowerCase();
	      var val = pair[1];

	      // get the value, unwrapping quotes
	      var value = val && val[0] === '"' && val[val.length - 1] === '"'
	        ? val.substr(1, val.length - 2)
	        : val;

	      if (key === 'q') {
	        q = parseFloat(value);
	        break;
	      }

	      // store parameter
	      params[key] = value;
	    }
	  }

	  return {
	    type: type,
	    subtype: subtype,
	    params: params,
	    q: q,
	    i: i
	  };
	}

	/**
	 * Get the priority of a media type.
	 * @private
	 */

	function getMediaTypePriority(type, accepted, index) {
	  var priority = {o: -1, q: 0, s: 0};

	  for (var i = 0; i < accepted.length; i++) {
	    var spec = specify(type, accepted[i], index);

	    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
	      priority = spec;
	    }
	  }

	  return priority;
	}

	/**
	 * Get the specificity of the media type.
	 * @private
	 */

	function specify(type, spec, index) {
	  var p = parseMediaType(type);
	  var s = 0;

	  if (!p) {
	    return null;
	  }

	  if(spec.type.toLowerCase() == p.type.toLowerCase()) {
	    s |= 4;
	  } else if(spec.type != '*') {
	    return null;
	  }

	  if(spec.subtype.toLowerCase() == p.subtype.toLowerCase()) {
	    s |= 2;
	  } else if(spec.subtype != '*') {
	    return null;
	  }

	  var keys = Object.keys(spec.params);
	  if (keys.length > 0) {
	    if (keys.every(function (k) {
	      return spec.params[k] == '*' || (spec.params[k] || '').toLowerCase() == (p.params[k] || '').toLowerCase();
	    })) {
	      s |= 1;
	    } else {
	      return null
	    }
	  }

	  return {
	    i: index,
	    o: spec.i,
	    q: spec.q,
	    s: s,
	  }
	}

	/**
	 * Get the preferred media types from an Accept header.
	 * @public
	 */

	function preferredMediaTypes(accept, provided) {
	  // RFC 2616 sec 14.2: no header = */*
	  var accepts = parseAccept(accept === undefined ? '*/*' : accept || '');

	  if (!provided) {
	    // sorted list of all types
	    return accepts
	      .filter(isQuality)
	      .sort(compareSpecs)
	      .map(getFullType);
	  }

	  var priorities = provided.map(function getPriority(type, index) {
	    return getMediaTypePriority(type, accepts, index);
	  });

	  // sorted list of accepted types
	  return priorities.filter(isQuality).sort(compareSpecs).map(function getType(priority) {
	    return provided[priorities.indexOf(priority)];
	  });
	}

	/**
	 * Compare two specs.
	 * @private
	 */

	function compareSpecs(a, b) {
	  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
	}

	/**
	 * Get full type string.
	 * @private
	 */

	function getFullType(spec) {
	  return spec.type + '/' + spec.subtype;
	}

	/**
	 * Check if a spec has any quality.
	 * @private
	 */

	function isQuality(spec) {
	  return spec.q > 0;
	}

	/**
	 * Count the number of quotes in a string.
	 * @private
	 */

	function quoteCount(string) {
	  var count = 0;
	  var index = 0;

	  while ((index = string.indexOf('"', index)) !== -1) {
	    count++;
	    index++;
	  }

	  return count;
	}

	/**
	 * Split a key value pair.
	 * @private
	 */

	function splitKeyValuePair(str) {
	  var index = str.indexOf('=');
	  var key;
	  var val;

	  if (index === -1) {
	    key = str;
	  } else {
	    key = str.substr(0, index);
	    val = str.substr(index + 1);
	  }

	  return [key, val];
	}

	/**
	 * Split an Accept header into media types.
	 * @private
	 */

	function splitMediaTypes(accept) {
	  var accepts = accept.split(',');

	  for (var i = 1, j = 0; i < accepts.length; i++) {
	    if (quoteCount(accepts[j]) % 2 == 0) {
	      accepts[++j] = accepts[i];
	    } else {
	      accepts[j] += ',' + accepts[i];
	    }
	  }

	  // trim accepts
	  accepts.length = j + 1;

	  return accepts;
	}

	/**
	 * Split a string of parameters.
	 * @private
	 */

	function splitParameters(str) {
	  var parameters = str.split(';');

	  for (var i = 1, j = 0; i < parameters.length; i++) {
	    if (quoteCount(parameters[j]) % 2 == 0) {
	      parameters[++j] = parameters[i];
	    } else {
	      parameters[j] += ';' + parameters[i];
	    }
	  }

	  // trim parameters
	  parameters.length = j + 1;

	  for (var i = 0; i < parameters.length; i++) {
	    parameters[i] = parameters[i].trim();
	  }

	  return parameters;
	}
	return mediaTypeExports;
}

/*!
 * negotiator
 * Copyright(c) 2012 Federico Romero
 * Copyright(c) 2012-2014 Isaac Z. Schlueter
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredNegotiator;

function requireNegotiator () {
	if (hasRequiredNegotiator) return negotiatorExports;
	hasRequiredNegotiator = 1;

	var preferredCharsets = requireCharset();
	var preferredEncodings = requireEncoding();
	var preferredLanguages = requireLanguage();
	var preferredMediaTypes = requireMediaType();

	/**
	 * Module exports.
	 * @public
	 */

	negotiator.exports = Negotiator;
	negotiatorExports.Negotiator = Negotiator;

	/**
	 * Create a Negotiator instance from a request.
	 * @param {object} request
	 * @public
	 */

	function Negotiator(request) {
	  if (!(this instanceof Negotiator)) {
	    return new Negotiator(request);
	  }

	  this.request = request;
	}

	Negotiator.prototype.charset = function charset(available) {
	  var set = this.charsets(available);
	  return set && set[0];
	};

	Negotiator.prototype.charsets = function charsets(available) {
	  return preferredCharsets(this.request.headers['accept-charset'], available);
	};

	Negotiator.prototype.encoding = function encoding(available) {
	  var set = this.encodings(available);
	  return set && set[0];
	};

	Negotiator.prototype.encodings = function encodings(available) {
	  return preferredEncodings(this.request.headers['accept-encoding'], available);
	};

	Negotiator.prototype.language = function language(available) {
	  var set = this.languages(available);
	  return set && set[0];
	};

	Negotiator.prototype.languages = function languages(available) {
	  return preferredLanguages(this.request.headers['accept-language'], available);
	};

	Negotiator.prototype.mediaType = function mediaType(available) {
	  var set = this.mediaTypes(available);
	  return set && set[0];
	};

	Negotiator.prototype.mediaTypes = function mediaTypes(available) {
	  return preferredMediaTypes(this.request.headers.accept, available);
	};

	// Backwards compatibility
	Negotiator.prototype.preferredCharset = Negotiator.prototype.charset;
	Negotiator.prototype.preferredCharsets = Negotiator.prototype.charsets;
	Negotiator.prototype.preferredEncoding = Negotiator.prototype.encoding;
	Negotiator.prototype.preferredEncodings = Negotiator.prototype.encodings;
	Negotiator.prototype.preferredLanguage = Negotiator.prototype.language;
	Negotiator.prototype.preferredLanguages = Negotiator.prototype.languages;
	Negotiator.prototype.preferredMediaType = Negotiator.prototype.mediaType;
	Negotiator.prototype.preferredMediaTypes = Negotiator.prototype.mediaTypes;
	return negotiatorExports;
}

var mimeTypes = {};

var mimeDbExports = {};
var mimeDb = {
  get exports(){ return mimeDbExports; },
  set exports(v){ mimeDbExports = v; },
};

var require$$0 = {
	"application/1d-interleaved-parityfec": {
	source: "iana"
},
	"application/3gpdash-qoe-report+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/3gpp-ims+xml": {
	source: "iana",
	compressible: true
},
	"application/3gpphal+json": {
	source: "iana",
	compressible: true
},
	"application/3gpphalforms+json": {
	source: "iana",
	compressible: true
},
	"application/a2l": {
	source: "iana"
},
	"application/ace+cbor": {
	source: "iana"
},
	"application/activemessage": {
	source: "iana"
},
	"application/activity+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/alto-directory+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcost+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcostparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointprop+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointpropparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-error+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/alto-updatestreamcontrol+json": {
	source: "iana",
	compressible: true
},
	"application/alto-updatestreamparams+json": {
	source: "iana",
	compressible: true
},
	"application/aml": {
	source: "iana"
},
	"application/andrew-inset": {
	source: "iana",
	extensions: [
		"ez"
	]
},
	"application/applefile": {
	source: "iana"
},
	"application/applixware": {
	source: "apache",
	extensions: [
		"aw"
	]
},
	"application/at+jwt": {
	source: "iana"
},
	"application/atf": {
	source: "iana"
},
	"application/atfx": {
	source: "iana"
},
	"application/atom+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atom"
	]
},
	"application/atomcat+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomcat"
	]
},
	"application/atomdeleted+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomdeleted"
	]
},
	"application/atomicmail": {
	source: "iana"
},
	"application/atomsvc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomsvc"
	]
},
	"application/atsc-dwd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dwd"
	]
},
	"application/atsc-dynamic-event-message": {
	source: "iana"
},
	"application/atsc-held+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"held"
	]
},
	"application/atsc-rdt+json": {
	source: "iana",
	compressible: true
},
	"application/atsc-rsat+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rsat"
	]
},
	"application/atxml": {
	source: "iana"
},
	"application/auth-policy+xml": {
	source: "iana",
	compressible: true
},
	"application/bacnet-xdd+zip": {
	source: "iana",
	compressible: false
},
	"application/batch-smtp": {
	source: "iana"
},
	"application/bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/beep+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/calendar+json": {
	source: "iana",
	compressible: true
},
	"application/calendar+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xcs"
	]
},
	"application/call-completion": {
	source: "iana"
},
	"application/cals-1840": {
	source: "iana"
},
	"application/captive+json": {
	source: "iana",
	compressible: true
},
	"application/cbor": {
	source: "iana"
},
	"application/cbor-seq": {
	source: "iana"
},
	"application/cccex": {
	source: "iana"
},
	"application/ccmp+xml": {
	source: "iana",
	compressible: true
},
	"application/ccxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ccxml"
	]
},
	"application/cdfx+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cdfx"
	]
},
	"application/cdmi-capability": {
	source: "iana",
	extensions: [
		"cdmia"
	]
},
	"application/cdmi-container": {
	source: "iana",
	extensions: [
		"cdmic"
	]
},
	"application/cdmi-domain": {
	source: "iana",
	extensions: [
		"cdmid"
	]
},
	"application/cdmi-object": {
	source: "iana",
	extensions: [
		"cdmio"
	]
},
	"application/cdmi-queue": {
	source: "iana",
	extensions: [
		"cdmiq"
	]
},
	"application/cdni": {
	source: "iana"
},
	"application/cea": {
	source: "iana"
},
	"application/cea-2018+xml": {
	source: "iana",
	compressible: true
},
	"application/cellml+xml": {
	source: "iana",
	compressible: true
},
	"application/cfw": {
	source: "iana"
},
	"application/city+json": {
	source: "iana",
	compressible: true
},
	"application/clr": {
	source: "iana"
},
	"application/clue+xml": {
	source: "iana",
	compressible: true
},
	"application/clue_info+xml": {
	source: "iana",
	compressible: true
},
	"application/cms": {
	source: "iana"
},
	"application/cnrp+xml": {
	source: "iana",
	compressible: true
},
	"application/coap-group+json": {
	source: "iana",
	compressible: true
},
	"application/coap-payload": {
	source: "iana"
},
	"application/commonground": {
	source: "iana"
},
	"application/conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/cose": {
	source: "iana"
},
	"application/cose-key": {
	source: "iana"
},
	"application/cose-key-set": {
	source: "iana"
},
	"application/cpl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cpl"
	]
},
	"application/csrattrs": {
	source: "iana"
},
	"application/csta+xml": {
	source: "iana",
	compressible: true
},
	"application/cstadata+xml": {
	source: "iana",
	compressible: true
},
	"application/csvm+json": {
	source: "iana",
	compressible: true
},
	"application/cu-seeme": {
	source: "apache",
	extensions: [
		"cu"
	]
},
	"application/cwt": {
	source: "iana"
},
	"application/cybercash": {
	source: "iana"
},
	"application/dart": {
	compressible: true
},
	"application/dash+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpd"
	]
},
	"application/dash-patch+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpp"
	]
},
	"application/dashdelta": {
	source: "iana"
},
	"application/davmount+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"davmount"
	]
},
	"application/dca-rft": {
	source: "iana"
},
	"application/dcd": {
	source: "iana"
},
	"application/dec-dx": {
	source: "iana"
},
	"application/dialog-info+xml": {
	source: "iana",
	compressible: true
},
	"application/dicom": {
	source: "iana"
},
	"application/dicom+json": {
	source: "iana",
	compressible: true
},
	"application/dicom+xml": {
	source: "iana",
	compressible: true
},
	"application/dii": {
	source: "iana"
},
	"application/dit": {
	source: "iana"
},
	"application/dns": {
	source: "iana"
},
	"application/dns+json": {
	source: "iana",
	compressible: true
},
	"application/dns-message": {
	source: "iana"
},
	"application/docbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dbk"
	]
},
	"application/dots+cbor": {
	source: "iana"
},
	"application/dskpp+xml": {
	source: "iana",
	compressible: true
},
	"application/dssc+der": {
	source: "iana",
	extensions: [
		"dssc"
	]
},
	"application/dssc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdssc"
	]
},
	"application/dvcs": {
	source: "iana"
},
	"application/ecmascript": {
	source: "iana",
	compressible: true,
	extensions: [
		"es",
		"ecma"
	]
},
	"application/edi-consent": {
	source: "iana"
},
	"application/edi-x12": {
	source: "iana",
	compressible: false
},
	"application/edifact": {
	source: "iana",
	compressible: false
},
	"application/efi": {
	source: "iana"
},
	"application/elm+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/elm+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.cap+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/emergencycalldata.comment+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.control+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.deviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.ecall.msd": {
	source: "iana"
},
	"application/emergencycalldata.providerinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.serviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.subscriberinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.veds+xml": {
	source: "iana",
	compressible: true
},
	"application/emma+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"emma"
	]
},
	"application/emotionml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"emotionml"
	]
},
	"application/encaprtp": {
	source: "iana"
},
	"application/epp+xml": {
	source: "iana",
	compressible: true
},
	"application/epub+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"epub"
	]
},
	"application/eshop": {
	source: "iana"
},
	"application/exi": {
	source: "iana",
	extensions: [
		"exi"
	]
},
	"application/expect-ct-report+json": {
	source: "iana",
	compressible: true
},
	"application/express": {
	source: "iana",
	extensions: [
		"exp"
	]
},
	"application/fastinfoset": {
	source: "iana"
},
	"application/fastsoap": {
	source: "iana"
},
	"application/fdt+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"fdt"
	]
},
	"application/fhir+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/fhir+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/fido.trusted-apps+json": {
	compressible: true
},
	"application/fits": {
	source: "iana"
},
	"application/flexfec": {
	source: "iana"
},
	"application/font-sfnt": {
	source: "iana"
},
	"application/font-tdpfr": {
	source: "iana",
	extensions: [
		"pfr"
	]
},
	"application/font-woff": {
	source: "iana",
	compressible: false
},
	"application/framework-attributes+xml": {
	source: "iana",
	compressible: true
},
	"application/geo+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"geojson"
	]
},
	"application/geo+json-seq": {
	source: "iana"
},
	"application/geopackage+sqlite3": {
	source: "iana"
},
	"application/geoxacml+xml": {
	source: "iana",
	compressible: true
},
	"application/gltf-buffer": {
	source: "iana"
},
	"application/gml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"gml"
	]
},
	"application/gpx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"gpx"
	]
},
	"application/gxf": {
	source: "apache",
	extensions: [
		"gxf"
	]
},
	"application/gzip": {
	source: "iana",
	compressible: false,
	extensions: [
		"gz"
	]
},
	"application/h224": {
	source: "iana"
},
	"application/held+xml": {
	source: "iana",
	compressible: true
},
	"application/hjson": {
	extensions: [
		"hjson"
	]
},
	"application/http": {
	source: "iana"
},
	"application/hyperstudio": {
	source: "iana",
	extensions: [
		"stk"
	]
},
	"application/ibe-key-request+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pkg-reply+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pp-data": {
	source: "iana"
},
	"application/iges": {
	source: "iana"
},
	"application/im-iscomposing+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/index": {
	source: "iana"
},
	"application/index.cmd": {
	source: "iana"
},
	"application/index.obj": {
	source: "iana"
},
	"application/index.response": {
	source: "iana"
},
	"application/index.vnd": {
	source: "iana"
},
	"application/inkml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ink",
		"inkml"
	]
},
	"application/iotp": {
	source: "iana"
},
	"application/ipfix": {
	source: "iana",
	extensions: [
		"ipfix"
	]
},
	"application/ipp": {
	source: "iana"
},
	"application/isup": {
	source: "iana"
},
	"application/its+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"its"
	]
},
	"application/java-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"jar",
		"war",
		"ear"
	]
},
	"application/java-serialized-object": {
	source: "apache",
	compressible: false,
	extensions: [
		"ser"
	]
},
	"application/java-vm": {
	source: "apache",
	compressible: false,
	extensions: [
		"class"
	]
},
	"application/javascript": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"js",
		"mjs"
	]
},
	"application/jf2feed+json": {
	source: "iana",
	compressible: true
},
	"application/jose": {
	source: "iana"
},
	"application/jose+json": {
	source: "iana",
	compressible: true
},
	"application/jrd+json": {
	source: "iana",
	compressible: true
},
	"application/jscalendar+json": {
	source: "iana",
	compressible: true
},
	"application/json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"json",
		"map"
	]
},
	"application/json-patch+json": {
	source: "iana",
	compressible: true
},
	"application/json-seq": {
	source: "iana"
},
	"application/json5": {
	extensions: [
		"json5"
	]
},
	"application/jsonml+json": {
	source: "apache",
	compressible: true,
	extensions: [
		"jsonml"
	]
},
	"application/jwk+json": {
	source: "iana",
	compressible: true
},
	"application/jwk-set+json": {
	source: "iana",
	compressible: true
},
	"application/jwt": {
	source: "iana"
},
	"application/kpml-request+xml": {
	source: "iana",
	compressible: true
},
	"application/kpml-response+xml": {
	source: "iana",
	compressible: true
},
	"application/ld+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"jsonld"
	]
},
	"application/lgr+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lgr"
	]
},
	"application/link-format": {
	source: "iana"
},
	"application/load-control+xml": {
	source: "iana",
	compressible: true
},
	"application/lost+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lostxml"
	]
},
	"application/lostsync+xml": {
	source: "iana",
	compressible: true
},
	"application/lpf+zip": {
	source: "iana",
	compressible: false
},
	"application/lxf": {
	source: "iana"
},
	"application/mac-binhex40": {
	source: "iana",
	extensions: [
		"hqx"
	]
},
	"application/mac-compactpro": {
	source: "apache",
	extensions: [
		"cpt"
	]
},
	"application/macwriteii": {
	source: "iana"
},
	"application/mads+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mads"
	]
},
	"application/manifest+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"webmanifest"
	]
},
	"application/marc": {
	source: "iana",
	extensions: [
		"mrc"
	]
},
	"application/marcxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mrcx"
	]
},
	"application/mathematica": {
	source: "iana",
	extensions: [
		"ma",
		"nb",
		"mb"
	]
},
	"application/mathml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mathml"
	]
},
	"application/mathml-content+xml": {
	source: "iana",
	compressible: true
},
	"application/mathml-presentation+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-associated-procedure-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-deregister+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-envelope+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-protection-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-reception-report+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-schedule+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-user-service-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbox": {
	source: "iana",
	extensions: [
		"mbox"
	]
},
	"application/media-policy-dataset+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpf"
	]
},
	"application/media_control+xml": {
	source: "iana",
	compressible: true
},
	"application/mediaservercontrol+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mscml"
	]
},
	"application/merge-patch+json": {
	source: "iana",
	compressible: true
},
	"application/metalink+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"metalink"
	]
},
	"application/metalink4+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"meta4"
	]
},
	"application/mets+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mets"
	]
},
	"application/mf4": {
	source: "iana"
},
	"application/mikey": {
	source: "iana"
},
	"application/mipc": {
	source: "iana"
},
	"application/missing-blocks+cbor-seq": {
	source: "iana"
},
	"application/mmt-aei+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"maei"
	]
},
	"application/mmt-usd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"musd"
	]
},
	"application/mods+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mods"
	]
},
	"application/moss-keys": {
	source: "iana"
},
	"application/moss-signature": {
	source: "iana"
},
	"application/mosskey-data": {
	source: "iana"
},
	"application/mosskey-request": {
	source: "iana"
},
	"application/mp21": {
	source: "iana",
	extensions: [
		"m21",
		"mp21"
	]
},
	"application/mp4": {
	source: "iana",
	extensions: [
		"mp4s",
		"m4p"
	]
},
	"application/mpeg4-generic": {
	source: "iana"
},
	"application/mpeg4-iod": {
	source: "iana"
},
	"application/mpeg4-iod-xmt": {
	source: "iana"
},
	"application/mrb-consumer+xml": {
	source: "iana",
	compressible: true
},
	"application/mrb-publish+xml": {
	source: "iana",
	compressible: true
},
	"application/msc-ivr+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/msc-mixer+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/msword": {
	source: "iana",
	compressible: false,
	extensions: [
		"doc",
		"dot"
	]
},
	"application/mud+json": {
	source: "iana",
	compressible: true
},
	"application/multipart-core": {
	source: "iana"
},
	"application/mxf": {
	source: "iana",
	extensions: [
		"mxf"
	]
},
	"application/n-quads": {
	source: "iana",
	extensions: [
		"nq"
	]
},
	"application/n-triples": {
	source: "iana",
	extensions: [
		"nt"
	]
},
	"application/nasdata": {
	source: "iana"
},
	"application/news-checkgroups": {
	source: "iana",
	charset: "US-ASCII"
},
	"application/news-groupinfo": {
	source: "iana",
	charset: "US-ASCII"
},
	"application/news-transmission": {
	source: "iana"
},
	"application/nlsml+xml": {
	source: "iana",
	compressible: true
},
	"application/node": {
	source: "iana",
	extensions: [
		"cjs"
	]
},
	"application/nss": {
	source: "iana"
},
	"application/oauth-authz-req+jwt": {
	source: "iana"
},
	"application/oblivious-dns-message": {
	source: "iana"
},
	"application/ocsp-request": {
	source: "iana"
},
	"application/ocsp-response": {
	source: "iana"
},
	"application/octet-stream": {
	source: "iana",
	compressible: false,
	extensions: [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	]
},
	"application/oda": {
	source: "iana",
	extensions: [
		"oda"
	]
},
	"application/odm+xml": {
	source: "iana",
	compressible: true
},
	"application/odx": {
	source: "iana"
},
	"application/oebps-package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"opf"
	]
},
	"application/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogx"
	]
},
	"application/omdoc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"omdoc"
	]
},
	"application/onenote": {
	source: "apache",
	extensions: [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg"
	]
},
	"application/opc-nodeset+xml": {
	source: "iana",
	compressible: true
},
	"application/oscore": {
	source: "iana"
},
	"application/oxps": {
	source: "iana",
	extensions: [
		"oxps"
	]
},
	"application/p21": {
	source: "iana"
},
	"application/p21+zip": {
	source: "iana",
	compressible: false
},
	"application/p2p-overlay+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"relo"
	]
},
	"application/parityfec": {
	source: "iana"
},
	"application/passport": {
	source: "iana"
},
	"application/patch-ops-error+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xer"
	]
},
	"application/pdf": {
	source: "iana",
	compressible: false,
	extensions: [
		"pdf"
	]
},
	"application/pdx": {
	source: "iana"
},
	"application/pem-certificate-chain": {
	source: "iana"
},
	"application/pgp-encrypted": {
	source: "iana",
	compressible: false,
	extensions: [
		"pgp"
	]
},
	"application/pgp-keys": {
	source: "iana",
	extensions: [
		"asc"
	]
},
	"application/pgp-signature": {
	source: "iana",
	extensions: [
		"asc",
		"sig"
	]
},
	"application/pics-rules": {
	source: "apache",
	extensions: [
		"prf"
	]
},
	"application/pidf+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/pidf-diff+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/pkcs10": {
	source: "iana",
	extensions: [
		"p10"
	]
},
	"application/pkcs12": {
	source: "iana"
},
	"application/pkcs7-mime": {
	source: "iana",
	extensions: [
		"p7m",
		"p7c"
	]
},
	"application/pkcs7-signature": {
	source: "iana",
	extensions: [
		"p7s"
	]
},
	"application/pkcs8": {
	source: "iana",
	extensions: [
		"p8"
	]
},
	"application/pkcs8-encrypted": {
	source: "iana"
},
	"application/pkix-attr-cert": {
	source: "iana",
	extensions: [
		"ac"
	]
},
	"application/pkix-cert": {
	source: "iana",
	extensions: [
		"cer"
	]
},
	"application/pkix-crl": {
	source: "iana",
	extensions: [
		"crl"
	]
},
	"application/pkix-pkipath": {
	source: "iana",
	extensions: [
		"pkipath"
	]
},
	"application/pkixcmp": {
	source: "iana",
	extensions: [
		"pki"
	]
},
	"application/pls+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pls"
	]
},
	"application/poc-settings+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/postscript": {
	source: "iana",
	compressible: true,
	extensions: [
		"ai",
		"eps",
		"ps"
	]
},
	"application/ppsp-tracker+json": {
	source: "iana",
	compressible: true
},
	"application/problem+json": {
	source: "iana",
	compressible: true
},
	"application/problem+xml": {
	source: "iana",
	compressible: true
},
	"application/provenance+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"provx"
	]
},
	"application/prs.alvestrand.titrax-sheet": {
	source: "iana"
},
	"application/prs.cww": {
	source: "iana",
	extensions: [
		"cww"
	]
},
	"application/prs.cyn": {
	source: "iana",
	charset: "7-BIT"
},
	"application/prs.hpub+zip": {
	source: "iana",
	compressible: false
},
	"application/prs.nprend": {
	source: "iana"
},
	"application/prs.plucker": {
	source: "iana"
},
	"application/prs.rdf-xml-crypt": {
	source: "iana"
},
	"application/prs.xsf+xml": {
	source: "iana",
	compressible: true
},
	"application/pskc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pskcxml"
	]
},
	"application/pvd+json": {
	source: "iana",
	compressible: true
},
	"application/qsig": {
	source: "iana"
},
	"application/raml+yaml": {
	compressible: true,
	extensions: [
		"raml"
	]
},
	"application/raptorfec": {
	source: "iana"
},
	"application/rdap+json": {
	source: "iana",
	compressible: true
},
	"application/rdf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rdf",
		"owl"
	]
},
	"application/reginfo+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rif"
	]
},
	"application/relax-ng-compact-syntax": {
	source: "iana",
	extensions: [
		"rnc"
	]
},
	"application/remote-printing": {
	source: "iana"
},
	"application/reputon+json": {
	source: "iana",
	compressible: true
},
	"application/resource-lists+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rl"
	]
},
	"application/resource-lists-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rld"
	]
},
	"application/rfc+xml": {
	source: "iana",
	compressible: true
},
	"application/riscos": {
	source: "iana"
},
	"application/rlmi+xml": {
	source: "iana",
	compressible: true
},
	"application/rls-services+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rs"
	]
},
	"application/route-apd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rapd"
	]
},
	"application/route-s-tsid+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sls"
	]
},
	"application/route-usd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rusd"
	]
},
	"application/rpki-ghostbusters": {
	source: "iana",
	extensions: [
		"gbr"
	]
},
	"application/rpki-manifest": {
	source: "iana",
	extensions: [
		"mft"
	]
},
	"application/rpki-publication": {
	source: "iana"
},
	"application/rpki-roa": {
	source: "iana",
	extensions: [
		"roa"
	]
},
	"application/rpki-updown": {
	source: "iana"
},
	"application/rsd+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rsd"
	]
},
	"application/rss+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rss"
	]
},
	"application/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"application/rtploopback": {
	source: "iana"
},
	"application/rtx": {
	source: "iana"
},
	"application/samlassertion+xml": {
	source: "iana",
	compressible: true
},
	"application/samlmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/sarif+json": {
	source: "iana",
	compressible: true
},
	"application/sarif-external-properties+json": {
	source: "iana",
	compressible: true
},
	"application/sbe": {
	source: "iana"
},
	"application/sbml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sbml"
	]
},
	"application/scaip+xml": {
	source: "iana",
	compressible: true
},
	"application/scim+json": {
	source: "iana",
	compressible: true
},
	"application/scvp-cv-request": {
	source: "iana",
	extensions: [
		"scq"
	]
},
	"application/scvp-cv-response": {
	source: "iana",
	extensions: [
		"scs"
	]
},
	"application/scvp-vp-request": {
	source: "iana",
	extensions: [
		"spq"
	]
},
	"application/scvp-vp-response": {
	source: "iana",
	extensions: [
		"spp"
	]
},
	"application/sdp": {
	source: "iana",
	extensions: [
		"sdp"
	]
},
	"application/secevent+jwt": {
	source: "iana"
},
	"application/senml+cbor": {
	source: "iana"
},
	"application/senml+json": {
	source: "iana",
	compressible: true
},
	"application/senml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"senmlx"
	]
},
	"application/senml-etch+cbor": {
	source: "iana"
},
	"application/senml-etch+json": {
	source: "iana",
	compressible: true
},
	"application/senml-exi": {
	source: "iana"
},
	"application/sensml+cbor": {
	source: "iana"
},
	"application/sensml+json": {
	source: "iana",
	compressible: true
},
	"application/sensml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sensmlx"
	]
},
	"application/sensml-exi": {
	source: "iana"
},
	"application/sep+xml": {
	source: "iana",
	compressible: true
},
	"application/sep-exi": {
	source: "iana"
},
	"application/session-info": {
	source: "iana"
},
	"application/set-payment": {
	source: "iana"
},
	"application/set-payment-initiation": {
	source: "iana",
	extensions: [
		"setpay"
	]
},
	"application/set-registration": {
	source: "iana"
},
	"application/set-registration-initiation": {
	source: "iana",
	extensions: [
		"setreg"
	]
},
	"application/sgml": {
	source: "iana"
},
	"application/sgml-open-catalog": {
	source: "iana"
},
	"application/shf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"shf"
	]
},
	"application/sieve": {
	source: "iana",
	extensions: [
		"siv",
		"sieve"
	]
},
	"application/simple-filter+xml": {
	source: "iana",
	compressible: true
},
	"application/simple-message-summary": {
	source: "iana"
},
	"application/simplesymbolcontainer": {
	source: "iana"
},
	"application/sipc": {
	source: "iana"
},
	"application/slate": {
	source: "iana"
},
	"application/smil": {
	source: "iana"
},
	"application/smil+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"smi",
		"smil"
	]
},
	"application/smpte336m": {
	source: "iana"
},
	"application/soap+fastinfoset": {
	source: "iana"
},
	"application/soap+xml": {
	source: "iana",
	compressible: true
},
	"application/sparql-query": {
	source: "iana",
	extensions: [
		"rq"
	]
},
	"application/sparql-results+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"srx"
	]
},
	"application/spdx+json": {
	source: "iana",
	compressible: true
},
	"application/spirits-event+xml": {
	source: "iana",
	compressible: true
},
	"application/sql": {
	source: "iana"
},
	"application/srgs": {
	source: "iana",
	extensions: [
		"gram"
	]
},
	"application/srgs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"grxml"
	]
},
	"application/sru+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sru"
	]
},
	"application/ssdl+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ssdl"
	]
},
	"application/ssml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ssml"
	]
},
	"application/stix+json": {
	source: "iana",
	compressible: true
},
	"application/swid+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"swidtag"
	]
},
	"application/tamp-apex-update": {
	source: "iana"
},
	"application/tamp-apex-update-confirm": {
	source: "iana"
},
	"application/tamp-community-update": {
	source: "iana"
},
	"application/tamp-community-update-confirm": {
	source: "iana"
},
	"application/tamp-error": {
	source: "iana"
},
	"application/tamp-sequence-adjust": {
	source: "iana"
},
	"application/tamp-sequence-adjust-confirm": {
	source: "iana"
},
	"application/tamp-status-query": {
	source: "iana"
},
	"application/tamp-status-response": {
	source: "iana"
},
	"application/tamp-update": {
	source: "iana"
},
	"application/tamp-update-confirm": {
	source: "iana"
},
	"application/tar": {
	compressible: true
},
	"application/taxii+json": {
	source: "iana",
	compressible: true
},
	"application/td+json": {
	source: "iana",
	compressible: true
},
	"application/tei+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tei",
		"teicorpus"
	]
},
	"application/tetra_isi": {
	source: "iana"
},
	"application/thraud+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tfi"
	]
},
	"application/timestamp-query": {
	source: "iana"
},
	"application/timestamp-reply": {
	source: "iana"
},
	"application/timestamped-data": {
	source: "iana",
	extensions: [
		"tsd"
	]
},
	"application/tlsrpt+gzip": {
	source: "iana"
},
	"application/tlsrpt+json": {
	source: "iana",
	compressible: true
},
	"application/tnauthlist": {
	source: "iana"
},
	"application/token-introspection+jwt": {
	source: "iana"
},
	"application/toml": {
	compressible: true,
	extensions: [
		"toml"
	]
},
	"application/trickle-ice-sdpfrag": {
	source: "iana"
},
	"application/trig": {
	source: "iana",
	extensions: [
		"trig"
	]
},
	"application/ttml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ttml"
	]
},
	"application/tve-trigger": {
	source: "iana"
},
	"application/tzif": {
	source: "iana"
},
	"application/tzif-leap": {
	source: "iana"
},
	"application/ubjson": {
	compressible: false,
	extensions: [
		"ubj"
	]
},
	"application/ulpfec": {
	source: "iana"
},
	"application/urc-grpsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/urc-ressheet+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rsheet"
	]
},
	"application/urc-targetdesc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"td"
	]
},
	"application/urc-uisocketdesc+xml": {
	source: "iana",
	compressible: true
},
	"application/vcard+json": {
	source: "iana",
	compressible: true
},
	"application/vcard+xml": {
	source: "iana",
	compressible: true
},
	"application/vemmi": {
	source: "iana"
},
	"application/vividence.scriptfile": {
	source: "apache"
},
	"application/vnd.1000minds.decision-model+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"1km"
	]
},
	"application/vnd.3gpp-prose+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-prose-pc3ch+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-v2x-local-service-information": {
	source: "iana"
},
	"application/vnd.3gpp.5gnas": {
	source: "iana"
},
	"application/vnd.3gpp.access-transfer-events+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.bsf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.gmop+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.gtpc": {
	source: "iana"
},
	"application/vnd.3gpp.interworking-data": {
	source: "iana"
},
	"application/vnd.3gpp.lpp": {
	source: "iana"
},
	"application/vnd.3gpp.mc-signalling-ear": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-payload": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-signalling": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-floor-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-signed+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-init-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-transmission-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mid-call+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.ngap": {
	source: "iana"
},
	"application/vnd.3gpp.pfcp": {
	source: "iana"
},
	"application/vnd.3gpp.pic-bw-large": {
	source: "iana",
	extensions: [
		"plb"
	]
},
	"application/vnd.3gpp.pic-bw-small": {
	source: "iana",
	extensions: [
		"psb"
	]
},
	"application/vnd.3gpp.pic-bw-var": {
	source: "iana",
	extensions: [
		"pvb"
	]
},
	"application/vnd.3gpp.s1ap": {
	source: "iana"
},
	"application/vnd.3gpp.sms": {
	source: "iana"
},
	"application/vnd.3gpp.sms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-ext+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.state-and-event-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.ussd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.bcmcsinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.sms": {
	source: "iana"
},
	"application/vnd.3gpp2.tcap": {
	source: "iana",
	extensions: [
		"tcap"
	]
},
	"application/vnd.3lightssoftware.imagescal": {
	source: "iana"
},
	"application/vnd.3m.post-it-notes": {
	source: "iana",
	extensions: [
		"pwn"
	]
},
	"application/vnd.accpac.simply.aso": {
	source: "iana",
	extensions: [
		"aso"
	]
},
	"application/vnd.accpac.simply.imp": {
	source: "iana",
	extensions: [
		"imp"
	]
},
	"application/vnd.acucobol": {
	source: "iana",
	extensions: [
		"acu"
	]
},
	"application/vnd.acucorp": {
	source: "iana",
	extensions: [
		"atc",
		"acutc"
	]
},
	"application/vnd.adobe.air-application-installer-package+zip": {
	source: "apache",
	compressible: false,
	extensions: [
		"air"
	]
},
	"application/vnd.adobe.flash.movie": {
	source: "iana"
},
	"application/vnd.adobe.formscentral.fcdt": {
	source: "iana",
	extensions: [
		"fcdt"
	]
},
	"application/vnd.adobe.fxp": {
	source: "iana",
	extensions: [
		"fxp",
		"fxpl"
	]
},
	"application/vnd.adobe.partial-upload": {
	source: "iana"
},
	"application/vnd.adobe.xdp+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdp"
	]
},
	"application/vnd.adobe.xfdf": {
	source: "iana",
	extensions: [
		"xfdf"
	]
},
	"application/vnd.aether.imp": {
	source: "iana"
},
	"application/vnd.afpc.afplinedata": {
	source: "iana"
},
	"application/vnd.afpc.afplinedata-pagedef": {
	source: "iana"
},
	"application/vnd.afpc.cmoca-cmresource": {
	source: "iana"
},
	"application/vnd.afpc.foca-charset": {
	source: "iana"
},
	"application/vnd.afpc.foca-codedfont": {
	source: "iana"
},
	"application/vnd.afpc.foca-codepage": {
	source: "iana"
},
	"application/vnd.afpc.modca": {
	source: "iana"
},
	"application/vnd.afpc.modca-cmtable": {
	source: "iana"
},
	"application/vnd.afpc.modca-formdef": {
	source: "iana"
},
	"application/vnd.afpc.modca-mediummap": {
	source: "iana"
},
	"application/vnd.afpc.modca-objectcontainer": {
	source: "iana"
},
	"application/vnd.afpc.modca-overlay": {
	source: "iana"
},
	"application/vnd.afpc.modca-pagesegment": {
	source: "iana"
},
	"application/vnd.age": {
	source: "iana",
	extensions: [
		"age"
	]
},
	"application/vnd.ah-barcode": {
	source: "iana"
},
	"application/vnd.ahead.space": {
	source: "iana",
	extensions: [
		"ahead"
	]
},
	"application/vnd.airzip.filesecure.azf": {
	source: "iana",
	extensions: [
		"azf"
	]
},
	"application/vnd.airzip.filesecure.azs": {
	source: "iana",
	extensions: [
		"azs"
	]
},
	"application/vnd.amadeus+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.amazon.ebook": {
	source: "apache",
	extensions: [
		"azw"
	]
},
	"application/vnd.amazon.mobi8-ebook": {
	source: "iana"
},
	"application/vnd.americandynamics.acc": {
	source: "iana",
	extensions: [
		"acc"
	]
},
	"application/vnd.amiga.ami": {
	source: "iana",
	extensions: [
		"ami"
	]
},
	"application/vnd.amundsen.maze+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.android.ota": {
	source: "iana"
},
	"application/vnd.android.package-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"apk"
	]
},
	"application/vnd.anki": {
	source: "iana"
},
	"application/vnd.anser-web-certificate-issue-initiation": {
	source: "iana",
	extensions: [
		"cii"
	]
},
	"application/vnd.anser-web-funds-transfer-initiation": {
	source: "apache",
	extensions: [
		"fti"
	]
},
	"application/vnd.antix.game-component": {
	source: "iana",
	extensions: [
		"atx"
	]
},
	"application/vnd.apache.arrow.file": {
	source: "iana"
},
	"application/vnd.apache.arrow.stream": {
	source: "iana"
},
	"application/vnd.apache.thrift.binary": {
	source: "iana"
},
	"application/vnd.apache.thrift.compact": {
	source: "iana"
},
	"application/vnd.apache.thrift.json": {
	source: "iana"
},
	"application/vnd.api+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.aplextor.warrp+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apothekende.reservation+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apple.installer+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpkg"
	]
},
	"application/vnd.apple.keynote": {
	source: "iana",
	extensions: [
		"key"
	]
},
	"application/vnd.apple.mpegurl": {
	source: "iana",
	extensions: [
		"m3u8"
	]
},
	"application/vnd.apple.numbers": {
	source: "iana",
	extensions: [
		"numbers"
	]
},
	"application/vnd.apple.pages": {
	source: "iana",
	extensions: [
		"pages"
	]
},
	"application/vnd.apple.pkpass": {
	compressible: false,
	extensions: [
		"pkpass"
	]
},
	"application/vnd.arastra.swi": {
	source: "iana"
},
	"application/vnd.aristanetworks.swi": {
	source: "iana",
	extensions: [
		"swi"
	]
},
	"application/vnd.artisan+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.artsquare": {
	source: "iana"
},
	"application/vnd.astraea-software.iota": {
	source: "iana",
	extensions: [
		"iota"
	]
},
	"application/vnd.audiograph": {
	source: "iana",
	extensions: [
		"aep"
	]
},
	"application/vnd.autopackage": {
	source: "iana"
},
	"application/vnd.avalon+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.avistar+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.balsamiq.bmml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"bmml"
	]
},
	"application/vnd.balsamiq.bmpr": {
	source: "iana"
},
	"application/vnd.banana-accounting": {
	source: "iana"
},
	"application/vnd.bbf.usp.error": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bekitzur-stech+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bint.med-content": {
	source: "iana"
},
	"application/vnd.biopax.rdf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.blink-idb-value-wrapper": {
	source: "iana"
},
	"application/vnd.blueice.multipass": {
	source: "iana",
	extensions: [
		"mpm"
	]
},
	"application/vnd.bluetooth.ep.oob": {
	source: "iana"
},
	"application/vnd.bluetooth.le.oob": {
	source: "iana"
},
	"application/vnd.bmi": {
	source: "iana",
	extensions: [
		"bmi"
	]
},
	"application/vnd.bpf": {
	source: "iana"
},
	"application/vnd.bpf3": {
	source: "iana"
},
	"application/vnd.businessobjects": {
	source: "iana",
	extensions: [
		"rep"
	]
},
	"application/vnd.byu.uapi+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cab-jscript": {
	source: "iana"
},
	"application/vnd.canon-cpdl": {
	source: "iana"
},
	"application/vnd.canon-lips": {
	source: "iana"
},
	"application/vnd.capasystems-pg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cendio.thinlinc.clientconf": {
	source: "iana"
},
	"application/vnd.century-systems.tcp_stream": {
	source: "iana"
},
	"application/vnd.chemdraw+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cdxml"
	]
},
	"application/vnd.chess-pgn": {
	source: "iana"
},
	"application/vnd.chipnuts.karaoke-mmd": {
	source: "iana",
	extensions: [
		"mmd"
	]
},
	"application/vnd.ciedi": {
	source: "iana"
},
	"application/vnd.cinderella": {
	source: "iana",
	extensions: [
		"cdy"
	]
},
	"application/vnd.cirpack.isdn-ext": {
	source: "iana"
},
	"application/vnd.citationstyles.style+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"csl"
	]
},
	"application/vnd.claymore": {
	source: "iana",
	extensions: [
		"cla"
	]
},
	"application/vnd.cloanto.rp9": {
	source: "iana",
	extensions: [
		"rp9"
	]
},
	"application/vnd.clonk.c4group": {
	source: "iana",
	extensions: [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	]
},
	"application/vnd.cluetrust.cartomobile-config": {
	source: "iana",
	extensions: [
		"c11amc"
	]
},
	"application/vnd.cluetrust.cartomobile-config-pkg": {
	source: "iana",
	extensions: [
		"c11amz"
	]
},
	"application/vnd.coffeescript": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet-template": {
	source: "iana"
},
	"application/vnd.collection+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.doc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.next+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.comicbook+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.comicbook-rar": {
	source: "iana"
},
	"application/vnd.commerce-battelle": {
	source: "iana"
},
	"application/vnd.commonspace": {
	source: "iana",
	extensions: [
		"csp"
	]
},
	"application/vnd.contact.cmsg": {
	source: "iana",
	extensions: [
		"cdbcmsg"
	]
},
	"application/vnd.coreos.ignition+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cosmocaller": {
	source: "iana",
	extensions: [
		"cmc"
	]
},
	"application/vnd.crick.clicker": {
	source: "iana",
	extensions: [
		"clkx"
	]
},
	"application/vnd.crick.clicker.keyboard": {
	source: "iana",
	extensions: [
		"clkk"
	]
},
	"application/vnd.crick.clicker.palette": {
	source: "iana",
	extensions: [
		"clkp"
	]
},
	"application/vnd.crick.clicker.template": {
	source: "iana",
	extensions: [
		"clkt"
	]
},
	"application/vnd.crick.clicker.wordbank": {
	source: "iana",
	extensions: [
		"clkw"
	]
},
	"application/vnd.criticaltools.wbs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wbs"
	]
},
	"application/vnd.cryptii.pipe+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.crypto-shade-file": {
	source: "iana"
},
	"application/vnd.cryptomator.encrypted": {
	source: "iana"
},
	"application/vnd.cryptomator.vault": {
	source: "iana"
},
	"application/vnd.ctc-posml": {
	source: "iana",
	extensions: [
		"pml"
	]
},
	"application/vnd.ctct.ws+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cups-pdf": {
	source: "iana"
},
	"application/vnd.cups-postscript": {
	source: "iana"
},
	"application/vnd.cups-ppd": {
	source: "iana",
	extensions: [
		"ppd"
	]
},
	"application/vnd.cups-raster": {
	source: "iana"
},
	"application/vnd.cups-raw": {
	source: "iana"
},
	"application/vnd.curl": {
	source: "iana"
},
	"application/vnd.curl.car": {
	source: "apache",
	extensions: [
		"car"
	]
},
	"application/vnd.curl.pcurl": {
	source: "apache",
	extensions: [
		"pcurl"
	]
},
	"application/vnd.cyan.dean.root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cybank": {
	source: "iana"
},
	"application/vnd.cyclonedx+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cyclonedx+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.d2l.coursepackage1p0+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.d3m-dataset": {
	source: "iana"
},
	"application/vnd.d3m-problem": {
	source: "iana"
},
	"application/vnd.dart": {
	source: "iana",
	compressible: true,
	extensions: [
		"dart"
	]
},
	"application/vnd.data-vision.rdz": {
	source: "iana",
	extensions: [
		"rdz"
	]
},
	"application/vnd.datapackage+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dataresource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dbf": {
	source: "iana",
	extensions: [
		"dbf"
	]
},
	"application/vnd.debian.binary-package": {
	source: "iana"
},
	"application/vnd.dece.data": {
	source: "iana",
	extensions: [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	]
},
	"application/vnd.dece.ttml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uvt",
		"uvvt"
	]
},
	"application/vnd.dece.unspecified": {
	source: "iana",
	extensions: [
		"uvx",
		"uvvx"
	]
},
	"application/vnd.dece.zip": {
	source: "iana",
	extensions: [
		"uvz",
		"uvvz"
	]
},
	"application/vnd.denovo.fcselayout-link": {
	source: "iana",
	extensions: [
		"fe_launch"
	]
},
	"application/vnd.desmume.movie": {
	source: "iana"
},
	"application/vnd.dir-bi.plate-dl-nosuffix": {
	source: "iana"
},
	"application/vnd.dm.delegation+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dna": {
	source: "iana",
	extensions: [
		"dna"
	]
},
	"application/vnd.document+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dolby.mlp": {
	source: "apache",
	extensions: [
		"mlp"
	]
},
	"application/vnd.dolby.mobile.1": {
	source: "iana"
},
	"application/vnd.dolby.mobile.2": {
	source: "iana"
},
	"application/vnd.doremir.scorecloud-binary-document": {
	source: "iana"
},
	"application/vnd.dpgraph": {
	source: "iana",
	extensions: [
		"dpg"
	]
},
	"application/vnd.dreamfactory": {
	source: "iana",
	extensions: [
		"dfac"
	]
},
	"application/vnd.drive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ds-keypoint": {
	source: "apache",
	extensions: [
		"kpxx"
	]
},
	"application/vnd.dtg.local": {
	source: "iana"
},
	"application/vnd.dtg.local.flash": {
	source: "iana"
},
	"application/vnd.dtg.local.html": {
	source: "iana"
},
	"application/vnd.dvb.ait": {
	source: "iana",
	extensions: [
		"ait"
	]
},
	"application/vnd.dvb.dvbisl+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.dvbj": {
	source: "iana"
},
	"application/vnd.dvb.esgcontainer": {
	source: "iana"
},
	"application/vnd.dvb.ipdcdftnotifaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess2": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgpdd": {
	source: "iana"
},
	"application/vnd.dvb.ipdcroaming": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-base": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-enhancement": {
	source: "iana"
},
	"application/vnd.dvb.notif-aggregate-root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-container+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-generic+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-msglist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-response+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-init+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.pfr": {
	source: "iana"
},
	"application/vnd.dvb.service": {
	source: "iana",
	extensions: [
		"svc"
	]
},
	"application/vnd.dxr": {
	source: "iana"
},
	"application/vnd.dynageo": {
	source: "iana",
	extensions: [
		"geo"
	]
},
	"application/vnd.dzr": {
	source: "iana"
},
	"application/vnd.easykaraoke.cdgdownload": {
	source: "iana"
},
	"application/vnd.ecdis-update": {
	source: "iana"
},
	"application/vnd.ecip.rlp": {
	source: "iana"
},
	"application/vnd.eclipse.ditto+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ecowin.chart": {
	source: "iana",
	extensions: [
		"mag"
	]
},
	"application/vnd.ecowin.filerequest": {
	source: "iana"
},
	"application/vnd.ecowin.fileupdate": {
	source: "iana"
},
	"application/vnd.ecowin.series": {
	source: "iana"
},
	"application/vnd.ecowin.seriesrequest": {
	source: "iana"
},
	"application/vnd.ecowin.seriesupdate": {
	source: "iana"
},
	"application/vnd.efi.img": {
	source: "iana"
},
	"application/vnd.efi.iso": {
	source: "iana"
},
	"application/vnd.emclient.accessrequest+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.enliven": {
	source: "iana",
	extensions: [
		"nml"
	]
},
	"application/vnd.enphase.envoy": {
	source: "iana"
},
	"application/vnd.eprints.data+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.epson.esf": {
	source: "iana",
	extensions: [
		"esf"
	]
},
	"application/vnd.epson.msf": {
	source: "iana",
	extensions: [
		"msf"
	]
},
	"application/vnd.epson.quickanime": {
	source: "iana",
	extensions: [
		"qam"
	]
},
	"application/vnd.epson.salt": {
	source: "iana",
	extensions: [
		"slt"
	]
},
	"application/vnd.epson.ssf": {
	source: "iana",
	extensions: [
		"ssf"
	]
},
	"application/vnd.ericsson.quickcall": {
	source: "iana"
},
	"application/vnd.espass-espass+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.eszigno3+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"es3",
		"et3"
	]
},
	"application/vnd.etsi.aoc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.asic-e+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.asic-s+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.cug+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvcommand+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-bc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-cod+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-npvr+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvservice+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsync+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mcid+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mheg5": {
	source: "iana"
},
	"application/vnd.etsi.overload-control-policy-dataset+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.pstn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.sci+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.simservs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.timestamp-token": {
	source: "iana"
},
	"application/vnd.etsi.tsl+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.tsl.der": {
	source: "iana"
},
	"application/vnd.eu.kasparian.car+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.eudora.data": {
	source: "iana"
},
	"application/vnd.evolv.ecig.profile": {
	source: "iana"
},
	"application/vnd.evolv.ecig.settings": {
	source: "iana"
},
	"application/vnd.evolv.ecig.theme": {
	source: "iana"
},
	"application/vnd.exstream-empower+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.exstream-package": {
	source: "iana"
},
	"application/vnd.ezpix-album": {
	source: "iana",
	extensions: [
		"ez2"
	]
},
	"application/vnd.ezpix-package": {
	source: "iana",
	extensions: [
		"ez3"
	]
},
	"application/vnd.f-secure.mobile": {
	source: "iana"
},
	"application/vnd.familysearch.gedcom+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.fastcopy-disk-image": {
	source: "iana"
},
	"application/vnd.fdf": {
	source: "iana",
	extensions: [
		"fdf"
	]
},
	"application/vnd.fdsn.mseed": {
	source: "iana",
	extensions: [
		"mseed"
	]
},
	"application/vnd.fdsn.seed": {
	source: "iana",
	extensions: [
		"seed",
		"dataless"
	]
},
	"application/vnd.ffsns": {
	source: "iana"
},
	"application/vnd.ficlab.flb+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.filmit.zfc": {
	source: "iana"
},
	"application/vnd.fints": {
	source: "iana"
},
	"application/vnd.firemonkeys.cloudcell": {
	source: "iana"
},
	"application/vnd.flographit": {
	source: "iana",
	extensions: [
		"gph"
	]
},
	"application/vnd.fluxtime.clip": {
	source: "iana",
	extensions: [
		"ftc"
	]
},
	"application/vnd.font-fontforge-sfd": {
	source: "iana"
},
	"application/vnd.framemaker": {
	source: "iana",
	extensions: [
		"fm",
		"frame",
		"maker",
		"book"
	]
},
	"application/vnd.frogans.fnc": {
	source: "iana",
	extensions: [
		"fnc"
	]
},
	"application/vnd.frogans.ltf": {
	source: "iana",
	extensions: [
		"ltf"
	]
},
	"application/vnd.fsc.weblaunch": {
	source: "iana",
	extensions: [
		"fsc"
	]
},
	"application/vnd.fujifilm.fb.docuworks": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.docuworks.binder": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.docuworks.container": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.jfi+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.fujitsu.oasys": {
	source: "iana",
	extensions: [
		"oas"
	]
},
	"application/vnd.fujitsu.oasys2": {
	source: "iana",
	extensions: [
		"oa2"
	]
},
	"application/vnd.fujitsu.oasys3": {
	source: "iana",
	extensions: [
		"oa3"
	]
},
	"application/vnd.fujitsu.oasysgp": {
	source: "iana",
	extensions: [
		"fg5"
	]
},
	"application/vnd.fujitsu.oasysprs": {
	source: "iana",
	extensions: [
		"bh2"
	]
},
	"application/vnd.fujixerox.art-ex": {
	source: "iana"
},
	"application/vnd.fujixerox.art4": {
	source: "iana"
},
	"application/vnd.fujixerox.ddd": {
	source: "iana",
	extensions: [
		"ddd"
	]
},
	"application/vnd.fujixerox.docuworks": {
	source: "iana",
	extensions: [
		"xdw"
	]
},
	"application/vnd.fujixerox.docuworks.binder": {
	source: "iana",
	extensions: [
		"xbd"
	]
},
	"application/vnd.fujixerox.docuworks.container": {
	source: "iana"
},
	"application/vnd.fujixerox.hbpl": {
	source: "iana"
},
	"application/vnd.fut-misnet": {
	source: "iana"
},
	"application/vnd.futoin+cbor": {
	source: "iana"
},
	"application/vnd.futoin+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.fuzzysheet": {
	source: "iana",
	extensions: [
		"fzs"
	]
},
	"application/vnd.genomatix.tuxedo": {
	source: "iana",
	extensions: [
		"txd"
	]
},
	"application/vnd.gentics.grd+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.geo+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.geocube+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.geogebra.file": {
	source: "iana",
	extensions: [
		"ggb"
	]
},
	"application/vnd.geogebra.slides": {
	source: "iana"
},
	"application/vnd.geogebra.tool": {
	source: "iana",
	extensions: [
		"ggt"
	]
},
	"application/vnd.geometry-explorer": {
	source: "iana",
	extensions: [
		"gex",
		"gre"
	]
},
	"application/vnd.geonext": {
	source: "iana",
	extensions: [
		"gxt"
	]
},
	"application/vnd.geoplan": {
	source: "iana",
	extensions: [
		"g2w"
	]
},
	"application/vnd.geospace": {
	source: "iana",
	extensions: [
		"g3w"
	]
},
	"application/vnd.gerber": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt-response": {
	source: "iana"
},
	"application/vnd.gmx": {
	source: "iana",
	extensions: [
		"gmx"
	]
},
	"application/vnd.google-apps.document": {
	compressible: false,
	extensions: [
		"gdoc"
	]
},
	"application/vnd.google-apps.presentation": {
	compressible: false,
	extensions: [
		"gslides"
	]
},
	"application/vnd.google-apps.spreadsheet": {
	compressible: false,
	extensions: [
		"gsheet"
	]
},
	"application/vnd.google-earth.kml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"kml"
	]
},
	"application/vnd.google-earth.kmz": {
	source: "iana",
	compressible: false,
	extensions: [
		"kmz"
	]
},
	"application/vnd.gov.sk.e-form+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.gov.sk.e-form+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.gov.sk.xmldatacontainer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.grafeq": {
	source: "iana",
	extensions: [
		"gqf",
		"gqs"
	]
},
	"application/vnd.gridmp": {
	source: "iana"
},
	"application/vnd.groove-account": {
	source: "iana",
	extensions: [
		"gac"
	]
},
	"application/vnd.groove-help": {
	source: "iana",
	extensions: [
		"ghf"
	]
},
	"application/vnd.groove-identity-message": {
	source: "iana",
	extensions: [
		"gim"
	]
},
	"application/vnd.groove-injector": {
	source: "iana",
	extensions: [
		"grv"
	]
},
	"application/vnd.groove-tool-message": {
	source: "iana",
	extensions: [
		"gtm"
	]
},
	"application/vnd.groove-tool-template": {
	source: "iana",
	extensions: [
		"tpl"
	]
},
	"application/vnd.groove-vcard": {
	source: "iana",
	extensions: [
		"vcg"
	]
},
	"application/vnd.hal+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hal+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"hal"
	]
},
	"application/vnd.handheld-entertainment+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zmm"
	]
},
	"application/vnd.hbci": {
	source: "iana",
	extensions: [
		"hbci"
	]
},
	"application/vnd.hc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hcl-bireports": {
	source: "iana"
},
	"application/vnd.hdt": {
	source: "iana"
},
	"application/vnd.heroku+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hhe.lesson-player": {
	source: "iana",
	extensions: [
		"les"
	]
},
	"application/vnd.hl7cda+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.hl7v2+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.hp-hpgl": {
	source: "iana",
	extensions: [
		"hpgl"
	]
},
	"application/vnd.hp-hpid": {
	source: "iana",
	extensions: [
		"hpid"
	]
},
	"application/vnd.hp-hps": {
	source: "iana",
	extensions: [
		"hps"
	]
},
	"application/vnd.hp-jlyt": {
	source: "iana",
	extensions: [
		"jlt"
	]
},
	"application/vnd.hp-pcl": {
	source: "iana",
	extensions: [
		"pcl"
	]
},
	"application/vnd.hp-pclxl": {
	source: "iana",
	extensions: [
		"pclxl"
	]
},
	"application/vnd.httphone": {
	source: "iana"
},
	"application/vnd.hydrostatix.sof-data": {
	source: "iana",
	extensions: [
		"sfd-hdstx"
	]
},
	"application/vnd.hyper+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyper-item+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyperdrive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hzn-3d-crossword": {
	source: "iana"
},
	"application/vnd.ibm.afplinedata": {
	source: "iana"
},
	"application/vnd.ibm.electronic-media": {
	source: "iana"
},
	"application/vnd.ibm.minipay": {
	source: "iana",
	extensions: [
		"mpy"
	]
},
	"application/vnd.ibm.modcap": {
	source: "iana",
	extensions: [
		"afp",
		"listafp",
		"list3820"
	]
},
	"application/vnd.ibm.rights-management": {
	source: "iana",
	extensions: [
		"irm"
	]
},
	"application/vnd.ibm.secure-container": {
	source: "iana",
	extensions: [
		"sc"
	]
},
	"application/vnd.iccprofile": {
	source: "iana",
	extensions: [
		"icc",
		"icm"
	]
},
	"application/vnd.ieee.1905": {
	source: "iana"
},
	"application/vnd.igloader": {
	source: "iana",
	extensions: [
		"igl"
	]
},
	"application/vnd.imagemeter.folder+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.imagemeter.image+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.immervision-ivp": {
	source: "iana",
	extensions: [
		"ivp"
	]
},
	"application/vnd.immervision-ivu": {
	source: "iana",
	extensions: [
		"ivu"
	]
},
	"application/vnd.ims.imsccv1p1": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p2": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p3": {
	source: "iana"
},
	"application/vnd.ims.lis.v2.result+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy.id+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.informedcontrol.rms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.informix-visionary": {
	source: "iana"
},
	"application/vnd.infotech.project": {
	source: "iana"
},
	"application/vnd.infotech.project+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.innopath.wamp.notification": {
	source: "iana"
},
	"application/vnd.insors.igm": {
	source: "iana",
	extensions: [
		"igm"
	]
},
	"application/vnd.intercon.formnet": {
	source: "iana",
	extensions: [
		"xpw",
		"xpx"
	]
},
	"application/vnd.intergeo": {
	source: "iana",
	extensions: [
		"i2g"
	]
},
	"application/vnd.intertrust.digibox": {
	source: "iana"
},
	"application/vnd.intertrust.nncp": {
	source: "iana"
},
	"application/vnd.intu.qbo": {
	source: "iana",
	extensions: [
		"qbo"
	]
},
	"application/vnd.intu.qfx": {
	source: "iana",
	extensions: [
		"qfx"
	]
},
	"application/vnd.iptc.g2.catalogitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.conceptitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.knowledgeitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.packageitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.planningitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ipunplugged.rcprofile": {
	source: "iana",
	extensions: [
		"rcprofile"
	]
},
	"application/vnd.irepository.package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"irp"
	]
},
	"application/vnd.is-xpr": {
	source: "iana",
	extensions: [
		"xpr"
	]
},
	"application/vnd.isac.fcs": {
	source: "iana",
	extensions: [
		"fcs"
	]
},
	"application/vnd.iso11783-10+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.jam": {
	source: "iana",
	extensions: [
		"jam"
	]
},
	"application/vnd.japannet-directory-service": {
	source: "iana"
},
	"application/vnd.japannet-jpnstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-payment-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-registration": {
	source: "iana"
},
	"application/vnd.japannet-registration-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-setstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-verification": {
	source: "iana"
},
	"application/vnd.japannet-verification-wakeup": {
	source: "iana"
},
	"application/vnd.jcp.javame.midlet-rms": {
	source: "iana",
	extensions: [
		"rms"
	]
},
	"application/vnd.jisp": {
	source: "iana",
	extensions: [
		"jisp"
	]
},
	"application/vnd.joost.joda-archive": {
	source: "iana",
	extensions: [
		"joda"
	]
},
	"application/vnd.jsk.isdn-ngn": {
	source: "iana"
},
	"application/vnd.kahootz": {
	source: "iana",
	extensions: [
		"ktz",
		"ktr"
	]
},
	"application/vnd.kde.karbon": {
	source: "iana",
	extensions: [
		"karbon"
	]
},
	"application/vnd.kde.kchart": {
	source: "iana",
	extensions: [
		"chrt"
	]
},
	"application/vnd.kde.kformula": {
	source: "iana",
	extensions: [
		"kfo"
	]
},
	"application/vnd.kde.kivio": {
	source: "iana",
	extensions: [
		"flw"
	]
},
	"application/vnd.kde.kontour": {
	source: "iana",
	extensions: [
		"kon"
	]
},
	"application/vnd.kde.kpresenter": {
	source: "iana",
	extensions: [
		"kpr",
		"kpt"
	]
},
	"application/vnd.kde.kspread": {
	source: "iana",
	extensions: [
		"ksp"
	]
},
	"application/vnd.kde.kword": {
	source: "iana",
	extensions: [
		"kwd",
		"kwt"
	]
},
	"application/vnd.kenameaapp": {
	source: "iana",
	extensions: [
		"htke"
	]
},
	"application/vnd.kidspiration": {
	source: "iana",
	extensions: [
		"kia"
	]
},
	"application/vnd.kinar": {
	source: "iana",
	extensions: [
		"kne",
		"knp"
	]
},
	"application/vnd.koan": {
	source: "iana",
	extensions: [
		"skp",
		"skd",
		"skt",
		"skm"
	]
},
	"application/vnd.kodak-descriptor": {
	source: "iana",
	extensions: [
		"sse"
	]
},
	"application/vnd.las": {
	source: "iana"
},
	"application/vnd.las.las+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.las.las+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lasxml"
	]
},
	"application/vnd.laszip": {
	source: "iana"
},
	"application/vnd.leap+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.liberty-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.llamagraphics.life-balance.desktop": {
	source: "iana",
	extensions: [
		"lbd"
	]
},
	"application/vnd.llamagraphics.life-balance.exchange+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lbe"
	]
},
	"application/vnd.logipipe.circuit+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.loom": {
	source: "iana"
},
	"application/vnd.lotus-1-2-3": {
	source: "iana",
	extensions: [
		"123"
	]
},
	"application/vnd.lotus-approach": {
	source: "iana",
	extensions: [
		"apr"
	]
},
	"application/vnd.lotus-freelance": {
	source: "iana",
	extensions: [
		"pre"
	]
},
	"application/vnd.lotus-notes": {
	source: "iana",
	extensions: [
		"nsf"
	]
},
	"application/vnd.lotus-organizer": {
	source: "iana",
	extensions: [
		"org"
	]
},
	"application/vnd.lotus-screencam": {
	source: "iana",
	extensions: [
		"scm"
	]
},
	"application/vnd.lotus-wordpro": {
	source: "iana",
	extensions: [
		"lwp"
	]
},
	"application/vnd.macports.portpkg": {
	source: "iana",
	extensions: [
		"portpkg"
	]
},
	"application/vnd.mapbox-vector-tile": {
	source: "iana",
	extensions: [
		"mvt"
	]
},
	"application/vnd.marlin.drm.actiontoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.conftoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.license+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.mdcf": {
	source: "iana"
},
	"application/vnd.mason+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.maxar.archive.3tz+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.maxmind.maxmind-db": {
	source: "iana"
},
	"application/vnd.mcd": {
	source: "iana",
	extensions: [
		"mcd"
	]
},
	"application/vnd.medcalcdata": {
	source: "iana",
	extensions: [
		"mc1"
	]
},
	"application/vnd.mediastation.cdkey": {
	source: "iana",
	extensions: [
		"cdkey"
	]
},
	"application/vnd.meridian-slingshot": {
	source: "iana"
},
	"application/vnd.mfer": {
	source: "iana",
	extensions: [
		"mwf"
	]
},
	"application/vnd.mfmp": {
	source: "iana",
	extensions: [
		"mfm"
	]
},
	"application/vnd.micro+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.micrografx.flo": {
	source: "iana",
	extensions: [
		"flo"
	]
},
	"application/vnd.micrografx.igx": {
	source: "iana",
	extensions: [
		"igx"
	]
},
	"application/vnd.microsoft.portable-executable": {
	source: "iana"
},
	"application/vnd.microsoft.windows.thumbnail-cache": {
	source: "iana"
},
	"application/vnd.miele+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.mif": {
	source: "iana",
	extensions: [
		"mif"
	]
},
	"application/vnd.minisoft-hp3000-save": {
	source: "iana"
},
	"application/vnd.mitsubishi.misty-guard.trustweb": {
	source: "iana"
},
	"application/vnd.mobius.daf": {
	source: "iana",
	extensions: [
		"daf"
	]
},
	"application/vnd.mobius.dis": {
	source: "iana",
	extensions: [
		"dis"
	]
},
	"application/vnd.mobius.mbk": {
	source: "iana",
	extensions: [
		"mbk"
	]
},
	"application/vnd.mobius.mqy": {
	source: "iana",
	extensions: [
		"mqy"
	]
},
	"application/vnd.mobius.msl": {
	source: "iana",
	extensions: [
		"msl"
	]
},
	"application/vnd.mobius.plc": {
	source: "iana",
	extensions: [
		"plc"
	]
},
	"application/vnd.mobius.txf": {
	source: "iana",
	extensions: [
		"txf"
	]
},
	"application/vnd.mophun.application": {
	source: "iana",
	extensions: [
		"mpn"
	]
},
	"application/vnd.mophun.certificate": {
	source: "iana",
	extensions: [
		"mpc"
	]
},
	"application/vnd.motorola.flexsuite": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.adsi": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.fis": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.gotap": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.kmr": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.ttc": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.wem": {
	source: "iana"
},
	"application/vnd.motorola.iprm": {
	source: "iana"
},
	"application/vnd.mozilla.xul+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xul"
	]
},
	"application/vnd.ms-3mfdocument": {
	source: "iana"
},
	"application/vnd.ms-artgalry": {
	source: "iana",
	extensions: [
		"cil"
	]
},
	"application/vnd.ms-asf": {
	source: "iana"
},
	"application/vnd.ms-cab-compressed": {
	source: "iana",
	extensions: [
		"cab"
	]
},
	"application/vnd.ms-color.iccprofile": {
	source: "apache"
},
	"application/vnd.ms-excel": {
	source: "iana",
	compressible: false,
	extensions: [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	]
},
	"application/vnd.ms-excel.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlam"
	]
},
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsb"
	]
},
	"application/vnd.ms-excel.sheet.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsm"
	]
},
	"application/vnd.ms-excel.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"xltm"
	]
},
	"application/vnd.ms-fontobject": {
	source: "iana",
	compressible: true,
	extensions: [
		"eot"
	]
},
	"application/vnd.ms-htmlhelp": {
	source: "iana",
	extensions: [
		"chm"
	]
},
	"application/vnd.ms-ims": {
	source: "iana",
	extensions: [
		"ims"
	]
},
	"application/vnd.ms-lrm": {
	source: "iana",
	extensions: [
		"lrm"
	]
},
	"application/vnd.ms-office.activex+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-officetheme": {
	source: "iana",
	extensions: [
		"thmx"
	]
},
	"application/vnd.ms-opentype": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-outlook": {
	compressible: false,
	extensions: [
		"msg"
	]
},
	"application/vnd.ms-package.obfuscated-opentype": {
	source: "apache"
},
	"application/vnd.ms-pki.seccat": {
	source: "apache",
	extensions: [
		"cat"
	]
},
	"application/vnd.ms-pki.stl": {
	source: "apache",
	extensions: [
		"stl"
	]
},
	"application/vnd.ms-playready.initiator+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-powerpoint": {
	source: "iana",
	compressible: false,
	extensions: [
		"ppt",
		"pps",
		"pot"
	]
},
	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppam"
	]
},
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
	source: "iana",
	extensions: [
		"pptm"
	]
},
	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
	source: "iana",
	extensions: [
		"sldm"
	]
},
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppsm"
	]
},
	"application/vnd.ms-powerpoint.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"potm"
	]
},
	"application/vnd.ms-printdevicecapabilities+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-printing.printticket+xml": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-printschematicket+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-project": {
	source: "iana",
	extensions: [
		"mpp",
		"mpt"
	]
},
	"application/vnd.ms-tnef": {
	source: "iana"
},
	"application/vnd.ms-windows.devicepairing": {
	source: "iana"
},
	"application/vnd.ms-windows.nwprinting.oob": {
	source: "iana"
},
	"application/vnd.ms-windows.printerpairing": {
	source: "iana"
},
	"application/vnd.ms-windows.wsd.oob": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-resp": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-resp": {
	source: "iana"
},
	"application/vnd.ms-word.document.macroenabled.12": {
	source: "iana",
	extensions: [
		"docm"
	]
},
	"application/vnd.ms-word.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"dotm"
	]
},
	"application/vnd.ms-works": {
	source: "iana",
	extensions: [
		"wps",
		"wks",
		"wcm",
		"wdb"
	]
},
	"application/vnd.ms-wpl": {
	source: "iana",
	extensions: [
		"wpl"
	]
},
	"application/vnd.ms-xpsdocument": {
	source: "iana",
	compressible: false,
	extensions: [
		"xps"
	]
},
	"application/vnd.msa-disk-image": {
	source: "iana"
},
	"application/vnd.mseq": {
	source: "iana",
	extensions: [
		"mseq"
	]
},
	"application/vnd.msign": {
	source: "iana"
},
	"application/vnd.multiad.creator": {
	source: "iana"
},
	"application/vnd.multiad.creator.cif": {
	source: "iana"
},
	"application/vnd.music-niff": {
	source: "iana"
},
	"application/vnd.musician": {
	source: "iana",
	extensions: [
		"mus"
	]
},
	"application/vnd.muvee.style": {
	source: "iana",
	extensions: [
		"msty"
	]
},
	"application/vnd.mynfc": {
	source: "iana",
	extensions: [
		"taglet"
	]
},
	"application/vnd.nacamar.ybrid+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ncd.control": {
	source: "iana"
},
	"application/vnd.ncd.reference": {
	source: "iana"
},
	"application/vnd.nearst.inv+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.nebumind.line": {
	source: "iana"
},
	"application/vnd.nervana": {
	source: "iana"
},
	"application/vnd.netfpx": {
	source: "iana"
},
	"application/vnd.neurolanguage.nlu": {
	source: "iana",
	extensions: [
		"nlu"
	]
},
	"application/vnd.nimn": {
	source: "iana"
},
	"application/vnd.nintendo.nitro.rom": {
	source: "iana"
},
	"application/vnd.nintendo.snes.rom": {
	source: "iana"
},
	"application/vnd.nitf": {
	source: "iana",
	extensions: [
		"ntf",
		"nitf"
	]
},
	"application/vnd.noblenet-directory": {
	source: "iana",
	extensions: [
		"nnd"
	]
},
	"application/vnd.noblenet-sealer": {
	source: "iana",
	extensions: [
		"nns"
	]
},
	"application/vnd.noblenet-web": {
	source: "iana",
	extensions: [
		"nnw"
	]
},
	"application/vnd.nokia.catalogs": {
	source: "iana"
},
	"application/vnd.nokia.conml+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.conml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.iptv.config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.isds-radio-presets": {
	source: "iana"
},
	"application/vnd.nokia.landmark+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.landmark+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.landmarkcollection+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.n-gage.ac+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ac"
	]
},
	"application/vnd.nokia.n-gage.data": {
	source: "iana",
	extensions: [
		"ngdat"
	]
},
	"application/vnd.nokia.n-gage.symbian.install": {
	source: "iana",
	extensions: [
		"n-gage"
	]
},
	"application/vnd.nokia.ncd": {
	source: "iana"
},
	"application/vnd.nokia.pcd+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.pcd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.radio-preset": {
	source: "iana",
	extensions: [
		"rpst"
	]
},
	"application/vnd.nokia.radio-presets": {
	source: "iana",
	extensions: [
		"rpss"
	]
},
	"application/vnd.novadigm.edm": {
	source: "iana",
	extensions: [
		"edm"
	]
},
	"application/vnd.novadigm.edx": {
	source: "iana",
	extensions: [
		"edx"
	]
},
	"application/vnd.novadigm.ext": {
	source: "iana",
	extensions: [
		"ext"
	]
},
	"application/vnd.ntt-local.content-share": {
	source: "iana"
},
	"application/vnd.ntt-local.file-transfer": {
	source: "iana"
},
	"application/vnd.ntt-local.ogw_remote-access": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_remote": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_tcp_stream": {
	source: "iana"
},
	"application/vnd.oasis.opendocument.chart": {
	source: "iana",
	extensions: [
		"odc"
	]
},
	"application/vnd.oasis.opendocument.chart-template": {
	source: "iana",
	extensions: [
		"otc"
	]
},
	"application/vnd.oasis.opendocument.database": {
	source: "iana",
	extensions: [
		"odb"
	]
},
	"application/vnd.oasis.opendocument.formula": {
	source: "iana",
	extensions: [
		"odf"
	]
},
	"application/vnd.oasis.opendocument.formula-template": {
	source: "iana",
	extensions: [
		"odft"
	]
},
	"application/vnd.oasis.opendocument.graphics": {
	source: "iana",
	compressible: false,
	extensions: [
		"odg"
	]
},
	"application/vnd.oasis.opendocument.graphics-template": {
	source: "iana",
	extensions: [
		"otg"
	]
},
	"application/vnd.oasis.opendocument.image": {
	source: "iana",
	extensions: [
		"odi"
	]
},
	"application/vnd.oasis.opendocument.image-template": {
	source: "iana",
	extensions: [
		"oti"
	]
},
	"application/vnd.oasis.opendocument.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"odp"
	]
},
	"application/vnd.oasis.opendocument.presentation-template": {
	source: "iana",
	extensions: [
		"otp"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"ods"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet-template": {
	source: "iana",
	extensions: [
		"ots"
	]
},
	"application/vnd.oasis.opendocument.text": {
	source: "iana",
	compressible: false,
	extensions: [
		"odt"
	]
},
	"application/vnd.oasis.opendocument.text-master": {
	source: "iana",
	extensions: [
		"odm"
	]
},
	"application/vnd.oasis.opendocument.text-template": {
	source: "iana",
	extensions: [
		"ott"
	]
},
	"application/vnd.oasis.opendocument.text-web": {
	source: "iana",
	extensions: [
		"oth"
	]
},
	"application/vnd.obn": {
	source: "iana"
},
	"application/vnd.ocf+cbor": {
	source: "iana"
},
	"application/vnd.oci.image.manifest.v1+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oftn.l10n+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessdownload+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessstreaming+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.cspg-hexbinary": {
	source: "iana"
},
	"application/vnd.oipf.dae.svg+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.dae.xhtml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.mippvcontrolmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.pae.gem": {
	source: "iana"
},
	"application/vnd.oipf.spdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.spdlist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.ueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.userprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.olpc-sugar": {
	source: "iana",
	extensions: [
		"xo"
	]
},
	"application/vnd.oma-scws-config": {
	source: "iana"
},
	"application/vnd.oma-scws-http-request": {
	source: "iana"
},
	"application/vnd.oma-scws-http-response": {
	source: "iana"
},
	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.drm-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.imd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.ltkm": {
	source: "iana"
},
	"application/vnd.oma.bcast.notification+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.provisioningtrigger": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgboot": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgdd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sgdu": {
	source: "iana"
},
	"application/vnd.oma.bcast.simple-symbol-container": {
	source: "iana"
},
	"application/vnd.oma.bcast.smartcard-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sprov+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.stkm": {
	source: "iana"
},
	"application/vnd.oma.cab-address-book+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-feature-handler+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-pcc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-subs-invite+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-user-prefs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.dcd": {
	source: "iana"
},
	"application/vnd.oma.dcdc": {
	source: "iana"
},
	"application/vnd.oma.dd2+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dd2"
	]
},
	"application/vnd.oma.drm.risd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.group-usage-list+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+cbor": {
	source: "iana"
},
	"application/vnd.oma.lwm2m+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+tlv": {
	source: "iana"
},
	"application/vnd.oma.pal+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.detailed-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.final-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.groups+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.invocation-descriptor+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.optimized-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.push": {
	source: "iana"
},
	"application/vnd.oma.scidm.messages+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.xcap-directory+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omads-email+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omads-file+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omads-folder+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omaloc-supl-init": {
	source: "iana"
},
	"application/vnd.onepager": {
	source: "iana"
},
	"application/vnd.onepagertamp": {
	source: "iana"
},
	"application/vnd.onepagertamx": {
	source: "iana"
},
	"application/vnd.onepagertat": {
	source: "iana"
},
	"application/vnd.onepagertatp": {
	source: "iana"
},
	"application/vnd.onepagertatx": {
	source: "iana"
},
	"application/vnd.openblox.game+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"obgx"
	]
},
	"application/vnd.openblox.game-binary": {
	source: "iana"
},
	"application/vnd.openeye.oeb": {
	source: "iana"
},
	"application/vnd.openofficeorg.extension": {
	source: "apache",
	extensions: [
		"oxt"
	]
},
	"application/vnd.openstreetmap.data+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"osm"
	]
},
	"application/vnd.opentimestamps.ots": {
	source: "iana"
},
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawing+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"pptx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
	source: "iana",
	extensions: [
		"sldx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
	source: "iana",
	extensions: [
		"ppsx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.template": {
	source: "iana",
	extensions: [
		"potx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"xlsx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
	source: "iana",
	extensions: [
		"xltx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.theme+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.vmldrawing": {
	source: "iana"
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
	source: "iana",
	compressible: false,
	extensions: [
		"docx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
	source: "iana",
	extensions: [
		"dotx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.core-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.relationships+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oracle.resource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.orange.indata": {
	source: "iana"
},
	"application/vnd.osa.netdeploy": {
	source: "iana"
},
	"application/vnd.osgeo.mapguide.package": {
	source: "iana",
	extensions: [
		"mgp"
	]
},
	"application/vnd.osgi.bundle": {
	source: "iana"
},
	"application/vnd.osgi.dp": {
	source: "iana",
	extensions: [
		"dp"
	]
},
	"application/vnd.osgi.subsystem": {
	source: "iana",
	extensions: [
		"esa"
	]
},
	"application/vnd.otps.ct-kip+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oxli.countgraph": {
	source: "iana"
},
	"application/vnd.pagerduty+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.palm": {
	source: "iana",
	extensions: [
		"pdb",
		"pqa",
		"oprc"
	]
},
	"application/vnd.panoply": {
	source: "iana"
},
	"application/vnd.paos.xml": {
	source: "iana"
},
	"application/vnd.patentdive": {
	source: "iana"
},
	"application/vnd.patientecommsdoc": {
	source: "iana"
},
	"application/vnd.pawaafile": {
	source: "iana",
	extensions: [
		"paw"
	]
},
	"application/vnd.pcos": {
	source: "iana"
},
	"application/vnd.pg.format": {
	source: "iana",
	extensions: [
		"str"
	]
},
	"application/vnd.pg.osasli": {
	source: "iana",
	extensions: [
		"ei6"
	]
},
	"application/vnd.piaccess.application-licence": {
	source: "iana"
},
	"application/vnd.picsel": {
	source: "iana",
	extensions: [
		"efif"
	]
},
	"application/vnd.pmi.widget": {
	source: "iana",
	extensions: [
		"wg"
	]
},
	"application/vnd.poc.group-advertisement+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.pocketlearn": {
	source: "iana",
	extensions: [
		"plf"
	]
},
	"application/vnd.powerbuilder6": {
	source: "iana",
	extensions: [
		"pbd"
	]
},
	"application/vnd.powerbuilder6-s": {
	source: "iana"
},
	"application/vnd.powerbuilder7": {
	source: "iana"
},
	"application/vnd.powerbuilder7-s": {
	source: "iana"
},
	"application/vnd.powerbuilder75": {
	source: "iana"
},
	"application/vnd.powerbuilder75-s": {
	source: "iana"
},
	"application/vnd.preminet": {
	source: "iana"
},
	"application/vnd.previewsystems.box": {
	source: "iana",
	extensions: [
		"box"
	]
},
	"application/vnd.proteus.magazine": {
	source: "iana",
	extensions: [
		"mgz"
	]
},
	"application/vnd.psfs": {
	source: "iana"
},
	"application/vnd.publishare-delta-tree": {
	source: "iana",
	extensions: [
		"qps"
	]
},
	"application/vnd.pvi.ptid1": {
	source: "iana",
	extensions: [
		"ptid"
	]
},
	"application/vnd.pwg-multiplexed": {
	source: "iana"
},
	"application/vnd.pwg-xhtml-print+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.qualcomm.brew-app-res": {
	source: "iana"
},
	"application/vnd.quarantainenet": {
	source: "iana"
},
	"application/vnd.quark.quarkxpress": {
	source: "iana",
	extensions: [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	]
},
	"application/vnd.quobject-quoxdocument": {
	source: "iana"
},
	"application/vnd.radisys.moml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-stream+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-base+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-group+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-speech+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-transform+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.rainstor.data": {
	source: "iana"
},
	"application/vnd.rapid": {
	source: "iana"
},
	"application/vnd.rar": {
	source: "iana",
	extensions: [
		"rar"
	]
},
	"application/vnd.realvnc.bed": {
	source: "iana",
	extensions: [
		"bed"
	]
},
	"application/vnd.recordare.musicxml": {
	source: "iana",
	extensions: [
		"mxl"
	]
},
	"application/vnd.recordare.musicxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"musicxml"
	]
},
	"application/vnd.renlearn.rlprint": {
	source: "iana"
},
	"application/vnd.resilient.logic": {
	source: "iana"
},
	"application/vnd.restful+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.rig.cryptonote": {
	source: "iana",
	extensions: [
		"cryptonote"
	]
},
	"application/vnd.rim.cod": {
	source: "apache",
	extensions: [
		"cod"
	]
},
	"application/vnd.rn-realmedia": {
	source: "apache",
	extensions: [
		"rm"
	]
},
	"application/vnd.rn-realmedia-vbr": {
	source: "apache",
	extensions: [
		"rmvb"
	]
},
	"application/vnd.route66.link66+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"link66"
	]
},
	"application/vnd.rs-274x": {
	source: "iana"
},
	"application/vnd.ruckus.download": {
	source: "iana"
},
	"application/vnd.s3sms": {
	source: "iana"
},
	"application/vnd.sailingtracker.track": {
	source: "iana",
	extensions: [
		"st"
	]
},
	"application/vnd.sar": {
	source: "iana"
},
	"application/vnd.sbm.cid": {
	source: "iana"
},
	"application/vnd.sbm.mid2": {
	source: "iana"
},
	"application/vnd.scribus": {
	source: "iana"
},
	"application/vnd.sealed.3df": {
	source: "iana"
},
	"application/vnd.sealed.csf": {
	source: "iana"
},
	"application/vnd.sealed.doc": {
	source: "iana"
},
	"application/vnd.sealed.eml": {
	source: "iana"
},
	"application/vnd.sealed.mht": {
	source: "iana"
},
	"application/vnd.sealed.net": {
	source: "iana"
},
	"application/vnd.sealed.ppt": {
	source: "iana"
},
	"application/vnd.sealed.tiff": {
	source: "iana"
},
	"application/vnd.sealed.xls": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.html": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.pdf": {
	source: "iana"
},
	"application/vnd.seemail": {
	source: "iana",
	extensions: [
		"see"
	]
},
	"application/vnd.seis+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.sema": {
	source: "iana",
	extensions: [
		"sema"
	]
},
	"application/vnd.semd": {
	source: "iana",
	extensions: [
		"semd"
	]
},
	"application/vnd.semf": {
	source: "iana",
	extensions: [
		"semf"
	]
},
	"application/vnd.shade-save-file": {
	source: "iana"
},
	"application/vnd.shana.informed.formdata": {
	source: "iana",
	extensions: [
		"ifm"
	]
},
	"application/vnd.shana.informed.formtemplate": {
	source: "iana",
	extensions: [
		"itp"
	]
},
	"application/vnd.shana.informed.interchange": {
	source: "iana",
	extensions: [
		"iif"
	]
},
	"application/vnd.shana.informed.package": {
	source: "iana",
	extensions: [
		"ipk"
	]
},
	"application/vnd.shootproof+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.shopkick+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.shp": {
	source: "iana"
},
	"application/vnd.shx": {
	source: "iana"
},
	"application/vnd.sigrok.session": {
	source: "iana"
},
	"application/vnd.simtech-mindmapper": {
	source: "iana",
	extensions: [
		"twd",
		"twds"
	]
},
	"application/vnd.siren+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.smaf": {
	source: "iana",
	extensions: [
		"mmf"
	]
},
	"application/vnd.smart.notebook": {
	source: "iana"
},
	"application/vnd.smart.teacher": {
	source: "iana",
	extensions: [
		"teacher"
	]
},
	"application/vnd.snesdev-page-table": {
	source: "iana"
},
	"application/vnd.software602.filler.form+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"fo"
	]
},
	"application/vnd.software602.filler.form-xml-zip": {
	source: "iana"
},
	"application/vnd.solent.sdkm+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sdkm",
		"sdkd"
	]
},
	"application/vnd.spotfire.dxp": {
	source: "iana",
	extensions: [
		"dxp"
	]
},
	"application/vnd.spotfire.sfs": {
	source: "iana",
	extensions: [
		"sfs"
	]
},
	"application/vnd.sqlite3": {
	source: "iana"
},
	"application/vnd.sss-cod": {
	source: "iana"
},
	"application/vnd.sss-dtf": {
	source: "iana"
},
	"application/vnd.sss-ntf": {
	source: "iana"
},
	"application/vnd.stardivision.calc": {
	source: "apache",
	extensions: [
		"sdc"
	]
},
	"application/vnd.stardivision.draw": {
	source: "apache",
	extensions: [
		"sda"
	]
},
	"application/vnd.stardivision.impress": {
	source: "apache",
	extensions: [
		"sdd"
	]
},
	"application/vnd.stardivision.math": {
	source: "apache",
	extensions: [
		"smf"
	]
},
	"application/vnd.stardivision.writer": {
	source: "apache",
	extensions: [
		"sdw",
		"vor"
	]
},
	"application/vnd.stardivision.writer-global": {
	source: "apache",
	extensions: [
		"sgl"
	]
},
	"application/vnd.stepmania.package": {
	source: "iana",
	extensions: [
		"smzip"
	]
},
	"application/vnd.stepmania.stepchart": {
	source: "iana",
	extensions: [
		"sm"
	]
},
	"application/vnd.street-stream": {
	source: "iana"
},
	"application/vnd.sun.wadl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wadl"
	]
},
	"application/vnd.sun.xml.calc": {
	source: "apache",
	extensions: [
		"sxc"
	]
},
	"application/vnd.sun.xml.calc.template": {
	source: "apache",
	extensions: [
		"stc"
	]
},
	"application/vnd.sun.xml.draw": {
	source: "apache",
	extensions: [
		"sxd"
	]
},
	"application/vnd.sun.xml.draw.template": {
	source: "apache",
	extensions: [
		"std"
	]
},
	"application/vnd.sun.xml.impress": {
	source: "apache",
	extensions: [
		"sxi"
	]
},
	"application/vnd.sun.xml.impress.template": {
	source: "apache",
	extensions: [
		"sti"
	]
},
	"application/vnd.sun.xml.math": {
	source: "apache",
	extensions: [
		"sxm"
	]
},
	"application/vnd.sun.xml.writer": {
	source: "apache",
	extensions: [
		"sxw"
	]
},
	"application/vnd.sun.xml.writer.global": {
	source: "apache",
	extensions: [
		"sxg"
	]
},
	"application/vnd.sun.xml.writer.template": {
	source: "apache",
	extensions: [
		"stw"
	]
},
	"application/vnd.sus-calendar": {
	source: "iana",
	extensions: [
		"sus",
		"susp"
	]
},
	"application/vnd.svd": {
	source: "iana",
	extensions: [
		"svd"
	]
},
	"application/vnd.swiftview-ics": {
	source: "iana"
},
	"application/vnd.sycle+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.syft+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.symbian.install": {
	source: "apache",
	extensions: [
		"sis",
		"sisx"
	]
},
	"application/vnd.syncml+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"xsm"
	]
},
	"application/vnd.syncml.dm+wbxml": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"bdm"
	]
},
	"application/vnd.syncml.dm+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"xdm"
	]
},
	"application/vnd.syncml.dm.notification": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"ddf"
	]
},
	"application/vnd.syncml.dmtnds+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmtnds+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.syncml.ds.notification": {
	source: "iana"
},
	"application/vnd.tableschema+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tao.intent-module-archive": {
	source: "iana",
	extensions: [
		"tao"
	]
},
	"application/vnd.tcpdump.pcap": {
	source: "iana",
	extensions: [
		"pcap",
		"cap",
		"dmp"
	]
},
	"application/vnd.think-cell.ppttc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tmd.mediaflex.api+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.tml": {
	source: "iana"
},
	"application/vnd.tmobile-livetv": {
	source: "iana",
	extensions: [
		"tmo"
	]
},
	"application/vnd.tri.onesource": {
	source: "iana"
},
	"application/vnd.trid.tpt": {
	source: "iana",
	extensions: [
		"tpt"
	]
},
	"application/vnd.triscape.mxs": {
	source: "iana",
	extensions: [
		"mxs"
	]
},
	"application/vnd.trueapp": {
	source: "iana",
	extensions: [
		"tra"
	]
},
	"application/vnd.truedoc": {
	source: "iana"
},
	"application/vnd.ubisoft.webplayer": {
	source: "iana"
},
	"application/vnd.ufdl": {
	source: "iana",
	extensions: [
		"ufd",
		"ufdl"
	]
},
	"application/vnd.uiq.theme": {
	source: "iana",
	extensions: [
		"utz"
	]
},
	"application/vnd.umajin": {
	source: "iana",
	extensions: [
		"umj"
	]
},
	"application/vnd.unity": {
	source: "iana",
	extensions: [
		"unityweb"
	]
},
	"application/vnd.uoml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uoml"
	]
},
	"application/vnd.uplanet.alert": {
	source: "iana"
},
	"application/vnd.uplanet.alert-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.channel": {
	source: "iana"
},
	"application/vnd.uplanet.channel-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.list": {
	source: "iana"
},
	"application/vnd.uplanet.list-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.signal": {
	source: "iana"
},
	"application/vnd.uri-map": {
	source: "iana"
},
	"application/vnd.valve.source.material": {
	source: "iana"
},
	"application/vnd.vcx": {
	source: "iana",
	extensions: [
		"vcx"
	]
},
	"application/vnd.vd-study": {
	source: "iana"
},
	"application/vnd.vectorworks": {
	source: "iana"
},
	"application/vnd.vel+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.verimatrix.vcas": {
	source: "iana"
},
	"application/vnd.veritone.aion+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.veryant.thin": {
	source: "iana"
},
	"application/vnd.ves.encrypted": {
	source: "iana"
},
	"application/vnd.vidsoft.vidconference": {
	source: "iana"
},
	"application/vnd.visio": {
	source: "iana",
	extensions: [
		"vsd",
		"vst",
		"vss",
		"vsw"
	]
},
	"application/vnd.visionary": {
	source: "iana",
	extensions: [
		"vis"
	]
},
	"application/vnd.vividence.scriptfile": {
	source: "iana"
},
	"application/vnd.vsf": {
	source: "iana",
	extensions: [
		"vsf"
	]
},
	"application/vnd.wap.sic": {
	source: "iana"
},
	"application/vnd.wap.slc": {
	source: "iana"
},
	"application/vnd.wap.wbxml": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"wbxml"
	]
},
	"application/vnd.wap.wmlc": {
	source: "iana",
	extensions: [
		"wmlc"
	]
},
	"application/vnd.wap.wmlscriptc": {
	source: "iana",
	extensions: [
		"wmlsc"
	]
},
	"application/vnd.webturbo": {
	source: "iana",
	extensions: [
		"wtb"
	]
},
	"application/vnd.wfa.dpp": {
	source: "iana"
},
	"application/vnd.wfa.p2p": {
	source: "iana"
},
	"application/vnd.wfa.wsc": {
	source: "iana"
},
	"application/vnd.windows.devicepairing": {
	source: "iana"
},
	"application/vnd.wmc": {
	source: "iana"
},
	"application/vnd.wmf.bootstrap": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica.package": {
	source: "iana"
},
	"application/vnd.wolfram.player": {
	source: "iana",
	extensions: [
		"nbp"
	]
},
	"application/vnd.wordperfect": {
	source: "iana",
	extensions: [
		"wpd"
	]
},
	"application/vnd.wqd": {
	source: "iana",
	extensions: [
		"wqd"
	]
},
	"application/vnd.wrq-hp3000-labelled": {
	source: "iana"
},
	"application/vnd.wt.stf": {
	source: "iana",
	extensions: [
		"stf"
	]
},
	"application/vnd.wv.csp+wbxml": {
	source: "iana"
},
	"application/vnd.wv.csp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.wv.ssp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xacml+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.xara": {
	source: "iana",
	extensions: [
		"xar"
	]
},
	"application/vnd.xfdl": {
	source: "iana",
	extensions: [
		"xfdl"
	]
},
	"application/vnd.xfdl.webform": {
	source: "iana"
},
	"application/vnd.xmi+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xmpie.cpkg": {
	source: "iana"
},
	"application/vnd.xmpie.dpkg": {
	source: "iana"
},
	"application/vnd.xmpie.plan": {
	source: "iana"
},
	"application/vnd.xmpie.ppkg": {
	source: "iana"
},
	"application/vnd.xmpie.xlim": {
	source: "iana"
},
	"application/vnd.yamaha.hv-dic": {
	source: "iana",
	extensions: [
		"hvd"
	]
},
	"application/vnd.yamaha.hv-script": {
	source: "iana",
	extensions: [
		"hvs"
	]
},
	"application/vnd.yamaha.hv-voice": {
	source: "iana",
	extensions: [
		"hvp"
	]
},
	"application/vnd.yamaha.openscoreformat": {
	source: "iana",
	extensions: [
		"osf"
	]
},
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"osfpvg"
	]
},
	"application/vnd.yamaha.remote-setup": {
	source: "iana"
},
	"application/vnd.yamaha.smaf-audio": {
	source: "iana",
	extensions: [
		"saf"
	]
},
	"application/vnd.yamaha.smaf-phrase": {
	source: "iana",
	extensions: [
		"spf"
	]
},
	"application/vnd.yamaha.through-ngn": {
	source: "iana"
},
	"application/vnd.yamaha.tunnel-udpencap": {
	source: "iana"
},
	"application/vnd.yaoweme": {
	source: "iana"
},
	"application/vnd.yellowriver-custom-menu": {
	source: "iana",
	extensions: [
		"cmp"
	]
},
	"application/vnd.youtube.yt": {
	source: "iana"
},
	"application/vnd.zul": {
	source: "iana",
	extensions: [
		"zir",
		"zirz"
	]
},
	"application/vnd.zzazz.deck+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zaz"
	]
},
	"application/voicexml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"vxml"
	]
},
	"application/voucher-cms+json": {
	source: "iana",
	compressible: true
},
	"application/vq-rtcpxr": {
	source: "iana"
},
	"application/wasm": {
	source: "iana",
	compressible: true,
	extensions: [
		"wasm"
	]
},
	"application/watcherinfo+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wif"
	]
},
	"application/webpush-options+json": {
	source: "iana",
	compressible: true
},
	"application/whoispp-query": {
	source: "iana"
},
	"application/whoispp-response": {
	source: "iana"
},
	"application/widget": {
	source: "iana",
	extensions: [
		"wgt"
	]
},
	"application/winhlp": {
	source: "apache",
	extensions: [
		"hlp"
	]
},
	"application/wita": {
	source: "iana"
},
	"application/wordperfect5.1": {
	source: "iana"
},
	"application/wsdl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wsdl"
	]
},
	"application/wspolicy+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wspolicy"
	]
},
	"application/x-7z-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"7z"
	]
},
	"application/x-abiword": {
	source: "apache",
	extensions: [
		"abw"
	]
},
	"application/x-ace-compressed": {
	source: "apache",
	extensions: [
		"ace"
	]
},
	"application/x-amf": {
	source: "apache"
},
	"application/x-apple-diskimage": {
	source: "apache",
	extensions: [
		"dmg"
	]
},
	"application/x-arj": {
	compressible: false,
	extensions: [
		"arj"
	]
},
	"application/x-authorware-bin": {
	source: "apache",
	extensions: [
		"aab",
		"x32",
		"u32",
		"vox"
	]
},
	"application/x-authorware-map": {
	source: "apache",
	extensions: [
		"aam"
	]
},
	"application/x-authorware-seg": {
	source: "apache",
	extensions: [
		"aas"
	]
},
	"application/x-bcpio": {
	source: "apache",
	extensions: [
		"bcpio"
	]
},
	"application/x-bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/x-bittorrent": {
	source: "apache",
	extensions: [
		"torrent"
	]
},
	"application/x-blorb": {
	source: "apache",
	extensions: [
		"blb",
		"blorb"
	]
},
	"application/x-bzip": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz"
	]
},
	"application/x-bzip2": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz2",
		"boz"
	]
},
	"application/x-cbr": {
	source: "apache",
	extensions: [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	]
},
	"application/x-cdlink": {
	source: "apache",
	extensions: [
		"vcd"
	]
},
	"application/x-cfs-compressed": {
	source: "apache",
	extensions: [
		"cfs"
	]
},
	"application/x-chat": {
	source: "apache",
	extensions: [
		"chat"
	]
},
	"application/x-chess-pgn": {
	source: "apache",
	extensions: [
		"pgn"
	]
},
	"application/x-chrome-extension": {
	extensions: [
		"crx"
	]
},
	"application/x-cocoa": {
	source: "nginx",
	extensions: [
		"cco"
	]
},
	"application/x-compress": {
	source: "apache"
},
	"application/x-conference": {
	source: "apache",
	extensions: [
		"nsc"
	]
},
	"application/x-cpio": {
	source: "apache",
	extensions: [
		"cpio"
	]
},
	"application/x-csh": {
	source: "apache",
	extensions: [
		"csh"
	]
},
	"application/x-deb": {
	compressible: false
},
	"application/x-debian-package": {
	source: "apache",
	extensions: [
		"deb",
		"udeb"
	]
},
	"application/x-dgc-compressed": {
	source: "apache",
	extensions: [
		"dgc"
	]
},
	"application/x-director": {
	source: "apache",
	extensions: [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	]
},
	"application/x-doom": {
	source: "apache",
	extensions: [
		"wad"
	]
},
	"application/x-dtbncx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ncx"
	]
},
	"application/x-dtbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dtb"
	]
},
	"application/x-dtbresource+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"res"
	]
},
	"application/x-dvi": {
	source: "apache",
	compressible: false,
	extensions: [
		"dvi"
	]
},
	"application/x-envoy": {
	source: "apache",
	extensions: [
		"evy"
	]
},
	"application/x-eva": {
	source: "apache",
	extensions: [
		"eva"
	]
},
	"application/x-font-bdf": {
	source: "apache",
	extensions: [
		"bdf"
	]
},
	"application/x-font-dos": {
	source: "apache"
},
	"application/x-font-framemaker": {
	source: "apache"
},
	"application/x-font-ghostscript": {
	source: "apache",
	extensions: [
		"gsf"
	]
},
	"application/x-font-libgrx": {
	source: "apache"
},
	"application/x-font-linux-psf": {
	source: "apache",
	extensions: [
		"psf"
	]
},
	"application/x-font-pcf": {
	source: "apache",
	extensions: [
		"pcf"
	]
},
	"application/x-font-snf": {
	source: "apache",
	extensions: [
		"snf"
	]
},
	"application/x-font-speedo": {
	source: "apache"
},
	"application/x-font-sunos-news": {
	source: "apache"
},
	"application/x-font-type1": {
	source: "apache",
	extensions: [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	]
},
	"application/x-font-vfont": {
	source: "apache"
},
	"application/x-freearc": {
	source: "apache",
	extensions: [
		"arc"
	]
},
	"application/x-futuresplash": {
	source: "apache",
	extensions: [
		"spl"
	]
},
	"application/x-gca-compressed": {
	source: "apache",
	extensions: [
		"gca"
	]
},
	"application/x-glulx": {
	source: "apache",
	extensions: [
		"ulx"
	]
},
	"application/x-gnumeric": {
	source: "apache",
	extensions: [
		"gnumeric"
	]
},
	"application/x-gramps-xml": {
	source: "apache",
	extensions: [
		"gramps"
	]
},
	"application/x-gtar": {
	source: "apache",
	extensions: [
		"gtar"
	]
},
	"application/x-gzip": {
	source: "apache"
},
	"application/x-hdf": {
	source: "apache",
	extensions: [
		"hdf"
	]
},
	"application/x-httpd-php": {
	compressible: true,
	extensions: [
		"php"
	]
},
	"application/x-install-instructions": {
	source: "apache",
	extensions: [
		"install"
	]
},
	"application/x-iso9660-image": {
	source: "apache",
	extensions: [
		"iso"
	]
},
	"application/x-iwork-keynote-sffkey": {
	extensions: [
		"key"
	]
},
	"application/x-iwork-numbers-sffnumbers": {
	extensions: [
		"numbers"
	]
},
	"application/x-iwork-pages-sffpages": {
	extensions: [
		"pages"
	]
},
	"application/x-java-archive-diff": {
	source: "nginx",
	extensions: [
		"jardiff"
	]
},
	"application/x-java-jnlp-file": {
	source: "apache",
	compressible: false,
	extensions: [
		"jnlp"
	]
},
	"application/x-javascript": {
	compressible: true
},
	"application/x-keepass2": {
	extensions: [
		"kdbx"
	]
},
	"application/x-latex": {
	source: "apache",
	compressible: false,
	extensions: [
		"latex"
	]
},
	"application/x-lua-bytecode": {
	extensions: [
		"luac"
	]
},
	"application/x-lzh-compressed": {
	source: "apache",
	extensions: [
		"lzh",
		"lha"
	]
},
	"application/x-makeself": {
	source: "nginx",
	extensions: [
		"run"
	]
},
	"application/x-mie": {
	source: "apache",
	extensions: [
		"mie"
	]
},
	"application/x-mobipocket-ebook": {
	source: "apache",
	extensions: [
		"prc",
		"mobi"
	]
},
	"application/x-mpegurl": {
	compressible: false
},
	"application/x-ms-application": {
	source: "apache",
	extensions: [
		"application"
	]
},
	"application/x-ms-shortcut": {
	source: "apache",
	extensions: [
		"lnk"
	]
},
	"application/x-ms-wmd": {
	source: "apache",
	extensions: [
		"wmd"
	]
},
	"application/x-ms-wmz": {
	source: "apache",
	extensions: [
		"wmz"
	]
},
	"application/x-ms-xbap": {
	source: "apache",
	extensions: [
		"xbap"
	]
},
	"application/x-msaccess": {
	source: "apache",
	extensions: [
		"mdb"
	]
},
	"application/x-msbinder": {
	source: "apache",
	extensions: [
		"obd"
	]
},
	"application/x-mscardfile": {
	source: "apache",
	extensions: [
		"crd"
	]
},
	"application/x-msclip": {
	source: "apache",
	extensions: [
		"clp"
	]
},
	"application/x-msdos-program": {
	extensions: [
		"exe"
	]
},
	"application/x-msdownload": {
	source: "apache",
	extensions: [
		"exe",
		"dll",
		"com",
		"bat",
		"msi"
	]
},
	"application/x-msmediaview": {
	source: "apache",
	extensions: [
		"mvb",
		"m13",
		"m14"
	]
},
	"application/x-msmetafile": {
	source: "apache",
	extensions: [
		"wmf",
		"wmz",
		"emf",
		"emz"
	]
},
	"application/x-msmoney": {
	source: "apache",
	extensions: [
		"mny"
	]
},
	"application/x-mspublisher": {
	source: "apache",
	extensions: [
		"pub"
	]
},
	"application/x-msschedule": {
	source: "apache",
	extensions: [
		"scd"
	]
},
	"application/x-msterminal": {
	source: "apache",
	extensions: [
		"trm"
	]
},
	"application/x-mswrite": {
	source: "apache",
	extensions: [
		"wri"
	]
},
	"application/x-netcdf": {
	source: "apache",
	extensions: [
		"nc",
		"cdf"
	]
},
	"application/x-ns-proxy-autoconfig": {
	compressible: true,
	extensions: [
		"pac"
	]
},
	"application/x-nzb": {
	source: "apache",
	extensions: [
		"nzb"
	]
},
	"application/x-perl": {
	source: "nginx",
	extensions: [
		"pl",
		"pm"
	]
},
	"application/x-pilot": {
	source: "nginx",
	extensions: [
		"prc",
		"pdb"
	]
},
	"application/x-pkcs12": {
	source: "apache",
	compressible: false,
	extensions: [
		"p12",
		"pfx"
	]
},
	"application/x-pkcs7-certificates": {
	source: "apache",
	extensions: [
		"p7b",
		"spc"
	]
},
	"application/x-pkcs7-certreqresp": {
	source: "apache",
	extensions: [
		"p7r"
	]
},
	"application/x-pki-message": {
	source: "iana"
},
	"application/x-rar-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"rar"
	]
},
	"application/x-redhat-package-manager": {
	source: "nginx",
	extensions: [
		"rpm"
	]
},
	"application/x-research-info-systems": {
	source: "apache",
	extensions: [
		"ris"
	]
},
	"application/x-sea": {
	source: "nginx",
	extensions: [
		"sea"
	]
},
	"application/x-sh": {
	source: "apache",
	compressible: true,
	extensions: [
		"sh"
	]
},
	"application/x-shar": {
	source: "apache",
	extensions: [
		"shar"
	]
},
	"application/x-shockwave-flash": {
	source: "apache",
	compressible: false,
	extensions: [
		"swf"
	]
},
	"application/x-silverlight-app": {
	source: "apache",
	extensions: [
		"xap"
	]
},
	"application/x-sql": {
	source: "apache",
	extensions: [
		"sql"
	]
},
	"application/x-stuffit": {
	source: "apache",
	compressible: false,
	extensions: [
		"sit"
	]
},
	"application/x-stuffitx": {
	source: "apache",
	extensions: [
		"sitx"
	]
},
	"application/x-subrip": {
	source: "apache",
	extensions: [
		"srt"
	]
},
	"application/x-sv4cpio": {
	source: "apache",
	extensions: [
		"sv4cpio"
	]
},
	"application/x-sv4crc": {
	source: "apache",
	extensions: [
		"sv4crc"
	]
},
	"application/x-t3vm-image": {
	source: "apache",
	extensions: [
		"t3"
	]
},
	"application/x-tads": {
	source: "apache",
	extensions: [
		"gam"
	]
},
	"application/x-tar": {
	source: "apache",
	compressible: true,
	extensions: [
		"tar"
	]
},
	"application/x-tcl": {
	source: "apache",
	extensions: [
		"tcl",
		"tk"
	]
},
	"application/x-tex": {
	source: "apache",
	extensions: [
		"tex"
	]
},
	"application/x-tex-tfm": {
	source: "apache",
	extensions: [
		"tfm"
	]
},
	"application/x-texinfo": {
	source: "apache",
	extensions: [
		"texinfo",
		"texi"
	]
},
	"application/x-tgif": {
	source: "apache",
	extensions: [
		"obj"
	]
},
	"application/x-ustar": {
	source: "apache",
	extensions: [
		"ustar"
	]
},
	"application/x-virtualbox-hdd": {
	compressible: true,
	extensions: [
		"hdd"
	]
},
	"application/x-virtualbox-ova": {
	compressible: true,
	extensions: [
		"ova"
	]
},
	"application/x-virtualbox-ovf": {
	compressible: true,
	extensions: [
		"ovf"
	]
},
	"application/x-virtualbox-vbox": {
	compressible: true,
	extensions: [
		"vbox"
	]
},
	"application/x-virtualbox-vbox-extpack": {
	compressible: false,
	extensions: [
		"vbox-extpack"
	]
},
	"application/x-virtualbox-vdi": {
	compressible: true,
	extensions: [
		"vdi"
	]
},
	"application/x-virtualbox-vhd": {
	compressible: true,
	extensions: [
		"vhd"
	]
},
	"application/x-virtualbox-vmdk": {
	compressible: true,
	extensions: [
		"vmdk"
	]
},
	"application/x-wais-source": {
	source: "apache",
	extensions: [
		"src"
	]
},
	"application/x-web-app-manifest+json": {
	compressible: true,
	extensions: [
		"webapp"
	]
},
	"application/x-www-form-urlencoded": {
	source: "iana",
	compressible: true
},
	"application/x-x509-ca-cert": {
	source: "iana",
	extensions: [
		"der",
		"crt",
		"pem"
	]
},
	"application/x-x509-ca-ra-cert": {
	source: "iana"
},
	"application/x-x509-next-ca-cert": {
	source: "iana"
},
	"application/x-xfig": {
	source: "apache",
	extensions: [
		"fig"
	]
},
	"application/x-xliff+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xlf"
	]
},
	"application/x-xpinstall": {
	source: "apache",
	compressible: false,
	extensions: [
		"xpi"
	]
},
	"application/x-xz": {
	source: "apache",
	extensions: [
		"xz"
	]
},
	"application/x-zmachine": {
	source: "apache",
	extensions: [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	]
},
	"application/x400-bp": {
	source: "iana"
},
	"application/xacml+xml": {
	source: "iana",
	compressible: true
},
	"application/xaml+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xaml"
	]
},
	"application/xcap-att+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xav"
	]
},
	"application/xcap-caps+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xca"
	]
},
	"application/xcap-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdf"
	]
},
	"application/xcap-el+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xel"
	]
},
	"application/xcap-error+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-ns+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xns"
	]
},
	"application/xcon-conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/xcon-conference-info-diff+xml": {
	source: "iana",
	compressible: true
},
	"application/xenc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xenc"
	]
},
	"application/xhtml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xhtml",
		"xht"
	]
},
	"application/xhtml-voice+xml": {
	source: "apache",
	compressible: true
},
	"application/xliff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xlf"
	]
},
	"application/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml",
		"xsl",
		"xsd",
		"rng"
	]
},
	"application/xml-dtd": {
	source: "iana",
	compressible: true,
	extensions: [
		"dtd"
	]
},
	"application/xml-external-parsed-entity": {
	source: "iana"
},
	"application/xml-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/xmpp+xml": {
	source: "iana",
	compressible: true
},
	"application/xop+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xop"
	]
},
	"application/xproc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xpl"
	]
},
	"application/xslt+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xsl",
		"xslt"
	]
},
	"application/xspf+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xspf"
	]
},
	"application/xv+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	]
},
	"application/yang": {
	source: "iana",
	extensions: [
		"yang"
	]
},
	"application/yang-data+json": {
	source: "iana",
	compressible: true
},
	"application/yang-data+xml": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+json": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/yin+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"yin"
	]
},
	"application/zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"zip"
	]
},
	"application/zlib": {
	source: "iana"
},
	"application/zstd": {
	source: "iana"
},
	"audio/1d-interleaved-parityfec": {
	source: "iana"
},
	"audio/32kadpcm": {
	source: "iana"
},
	"audio/3gpp": {
	source: "iana",
	compressible: false,
	extensions: [
		"3gpp"
	]
},
	"audio/3gpp2": {
	source: "iana"
},
	"audio/aac": {
	source: "iana"
},
	"audio/ac3": {
	source: "iana"
},
	"audio/adpcm": {
	source: "apache",
	extensions: [
		"adp"
	]
},
	"audio/amr": {
	source: "iana",
	extensions: [
		"amr"
	]
},
	"audio/amr-wb": {
	source: "iana"
},
	"audio/amr-wb+": {
	source: "iana"
},
	"audio/aptx": {
	source: "iana"
},
	"audio/asc": {
	source: "iana"
},
	"audio/atrac-advanced-lossless": {
	source: "iana"
},
	"audio/atrac-x": {
	source: "iana"
},
	"audio/atrac3": {
	source: "iana"
},
	"audio/basic": {
	source: "iana",
	compressible: false,
	extensions: [
		"au",
		"snd"
	]
},
	"audio/bv16": {
	source: "iana"
},
	"audio/bv32": {
	source: "iana"
},
	"audio/clearmode": {
	source: "iana"
},
	"audio/cn": {
	source: "iana"
},
	"audio/dat12": {
	source: "iana"
},
	"audio/dls": {
	source: "iana"
},
	"audio/dsr-es201108": {
	source: "iana"
},
	"audio/dsr-es202050": {
	source: "iana"
},
	"audio/dsr-es202211": {
	source: "iana"
},
	"audio/dsr-es202212": {
	source: "iana"
},
	"audio/dv": {
	source: "iana"
},
	"audio/dvi4": {
	source: "iana"
},
	"audio/eac3": {
	source: "iana"
},
	"audio/encaprtp": {
	source: "iana"
},
	"audio/evrc": {
	source: "iana"
},
	"audio/evrc-qcp": {
	source: "iana"
},
	"audio/evrc0": {
	source: "iana"
},
	"audio/evrc1": {
	source: "iana"
},
	"audio/evrcb": {
	source: "iana"
},
	"audio/evrcb0": {
	source: "iana"
},
	"audio/evrcb1": {
	source: "iana"
},
	"audio/evrcnw": {
	source: "iana"
},
	"audio/evrcnw0": {
	source: "iana"
},
	"audio/evrcnw1": {
	source: "iana"
},
	"audio/evrcwb": {
	source: "iana"
},
	"audio/evrcwb0": {
	source: "iana"
},
	"audio/evrcwb1": {
	source: "iana"
},
	"audio/evs": {
	source: "iana"
},
	"audio/flexfec": {
	source: "iana"
},
	"audio/fwdred": {
	source: "iana"
},
	"audio/g711-0": {
	source: "iana"
},
	"audio/g719": {
	source: "iana"
},
	"audio/g722": {
	source: "iana"
},
	"audio/g7221": {
	source: "iana"
},
	"audio/g723": {
	source: "iana"
},
	"audio/g726-16": {
	source: "iana"
},
	"audio/g726-24": {
	source: "iana"
},
	"audio/g726-32": {
	source: "iana"
},
	"audio/g726-40": {
	source: "iana"
},
	"audio/g728": {
	source: "iana"
},
	"audio/g729": {
	source: "iana"
},
	"audio/g7291": {
	source: "iana"
},
	"audio/g729d": {
	source: "iana"
},
	"audio/g729e": {
	source: "iana"
},
	"audio/gsm": {
	source: "iana"
},
	"audio/gsm-efr": {
	source: "iana"
},
	"audio/gsm-hr-08": {
	source: "iana"
},
	"audio/ilbc": {
	source: "iana"
},
	"audio/ip-mr_v2.5": {
	source: "iana"
},
	"audio/isac": {
	source: "apache"
},
	"audio/l16": {
	source: "iana"
},
	"audio/l20": {
	source: "iana"
},
	"audio/l24": {
	source: "iana",
	compressible: false
},
	"audio/l8": {
	source: "iana"
},
	"audio/lpc": {
	source: "iana"
},
	"audio/melp": {
	source: "iana"
},
	"audio/melp1200": {
	source: "iana"
},
	"audio/melp2400": {
	source: "iana"
},
	"audio/melp600": {
	source: "iana"
},
	"audio/mhas": {
	source: "iana"
},
	"audio/midi": {
	source: "apache",
	extensions: [
		"mid",
		"midi",
		"kar",
		"rmi"
	]
},
	"audio/mobile-xmf": {
	source: "iana",
	extensions: [
		"mxmf"
	]
},
	"audio/mp3": {
	compressible: false,
	extensions: [
		"mp3"
	]
},
	"audio/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"m4a",
		"mp4a"
	]
},
	"audio/mp4a-latm": {
	source: "iana"
},
	"audio/mpa": {
	source: "iana"
},
	"audio/mpa-robust": {
	source: "iana"
},
	"audio/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	]
},
	"audio/mpeg4-generic": {
	source: "iana"
},
	"audio/musepack": {
	source: "apache"
},
	"audio/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"oga",
		"ogg",
		"spx",
		"opus"
	]
},
	"audio/opus": {
	source: "iana"
},
	"audio/parityfec": {
	source: "iana"
},
	"audio/pcma": {
	source: "iana"
},
	"audio/pcma-wb": {
	source: "iana"
},
	"audio/pcmu": {
	source: "iana"
},
	"audio/pcmu-wb": {
	source: "iana"
},
	"audio/prs.sid": {
	source: "iana"
},
	"audio/qcelp": {
	source: "iana"
},
	"audio/raptorfec": {
	source: "iana"
},
	"audio/red": {
	source: "iana"
},
	"audio/rtp-enc-aescm128": {
	source: "iana"
},
	"audio/rtp-midi": {
	source: "iana"
},
	"audio/rtploopback": {
	source: "iana"
},
	"audio/rtx": {
	source: "iana"
},
	"audio/s3m": {
	source: "apache",
	extensions: [
		"s3m"
	]
},
	"audio/scip": {
	source: "iana"
},
	"audio/silk": {
	source: "apache",
	extensions: [
		"sil"
	]
},
	"audio/smv": {
	source: "iana"
},
	"audio/smv-qcp": {
	source: "iana"
},
	"audio/smv0": {
	source: "iana"
},
	"audio/sofa": {
	source: "iana"
},
	"audio/sp-midi": {
	source: "iana"
},
	"audio/speex": {
	source: "iana"
},
	"audio/t140c": {
	source: "iana"
},
	"audio/t38": {
	source: "iana"
},
	"audio/telephone-event": {
	source: "iana"
},
	"audio/tetra_acelp": {
	source: "iana"
},
	"audio/tetra_acelp_bb": {
	source: "iana"
},
	"audio/tone": {
	source: "iana"
},
	"audio/tsvcis": {
	source: "iana"
},
	"audio/uemclip": {
	source: "iana"
},
	"audio/ulpfec": {
	source: "iana"
},
	"audio/usac": {
	source: "iana"
},
	"audio/vdvi": {
	source: "iana"
},
	"audio/vmr-wb": {
	source: "iana"
},
	"audio/vnd.3gpp.iufp": {
	source: "iana"
},
	"audio/vnd.4sb": {
	source: "iana"
},
	"audio/vnd.audiokoz": {
	source: "iana"
},
	"audio/vnd.celp": {
	source: "iana"
},
	"audio/vnd.cisco.nse": {
	source: "iana"
},
	"audio/vnd.cmles.radio-events": {
	source: "iana"
},
	"audio/vnd.cns.anp1": {
	source: "iana"
},
	"audio/vnd.cns.inf1": {
	source: "iana"
},
	"audio/vnd.dece.audio": {
	source: "iana",
	extensions: [
		"uva",
		"uvva"
	]
},
	"audio/vnd.digital-winds": {
	source: "iana",
	extensions: [
		"eol"
	]
},
	"audio/vnd.dlna.adts": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.1": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.2": {
	source: "iana"
},
	"audio/vnd.dolby.mlp": {
	source: "iana"
},
	"audio/vnd.dolby.mps": {
	source: "iana"
},
	"audio/vnd.dolby.pl2": {
	source: "iana"
},
	"audio/vnd.dolby.pl2x": {
	source: "iana"
},
	"audio/vnd.dolby.pl2z": {
	source: "iana"
},
	"audio/vnd.dolby.pulse.1": {
	source: "iana"
},
	"audio/vnd.dra": {
	source: "iana",
	extensions: [
		"dra"
	]
},
	"audio/vnd.dts": {
	source: "iana",
	extensions: [
		"dts"
	]
},
	"audio/vnd.dts.hd": {
	source: "iana",
	extensions: [
		"dtshd"
	]
},
	"audio/vnd.dts.uhd": {
	source: "iana"
},
	"audio/vnd.dvb.file": {
	source: "iana"
},
	"audio/vnd.everad.plj": {
	source: "iana"
},
	"audio/vnd.hns.audio": {
	source: "iana"
},
	"audio/vnd.lucent.voice": {
	source: "iana",
	extensions: [
		"lvp"
	]
},
	"audio/vnd.ms-playready.media.pya": {
	source: "iana",
	extensions: [
		"pya"
	]
},
	"audio/vnd.nokia.mobile-xmf": {
	source: "iana"
},
	"audio/vnd.nortel.vbk": {
	source: "iana"
},
	"audio/vnd.nuera.ecelp4800": {
	source: "iana",
	extensions: [
		"ecelp4800"
	]
},
	"audio/vnd.nuera.ecelp7470": {
	source: "iana",
	extensions: [
		"ecelp7470"
	]
},
	"audio/vnd.nuera.ecelp9600": {
	source: "iana",
	extensions: [
		"ecelp9600"
	]
},
	"audio/vnd.octel.sbc": {
	source: "iana"
},
	"audio/vnd.presonus.multitrack": {
	source: "iana"
},
	"audio/vnd.qcelp": {
	source: "iana"
},
	"audio/vnd.rhetorex.32kadpcm": {
	source: "iana"
},
	"audio/vnd.rip": {
	source: "iana",
	extensions: [
		"rip"
	]
},
	"audio/vnd.rn-realaudio": {
	compressible: false
},
	"audio/vnd.sealedmedia.softseal.mpeg": {
	source: "iana"
},
	"audio/vnd.vmx.cvsd": {
	source: "iana"
},
	"audio/vnd.wave": {
	compressible: false
},
	"audio/vorbis": {
	source: "iana",
	compressible: false
},
	"audio/vorbis-config": {
	source: "iana"
},
	"audio/wav": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/wave": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"weba"
	]
},
	"audio/x-aac": {
	source: "apache",
	compressible: false,
	extensions: [
		"aac"
	]
},
	"audio/x-aiff": {
	source: "apache",
	extensions: [
		"aif",
		"aiff",
		"aifc"
	]
},
	"audio/x-caf": {
	source: "apache",
	compressible: false,
	extensions: [
		"caf"
	]
},
	"audio/x-flac": {
	source: "apache",
	extensions: [
		"flac"
	]
},
	"audio/x-m4a": {
	source: "nginx",
	extensions: [
		"m4a"
	]
},
	"audio/x-matroska": {
	source: "apache",
	extensions: [
		"mka"
	]
},
	"audio/x-mpegurl": {
	source: "apache",
	extensions: [
		"m3u"
	]
},
	"audio/x-ms-wax": {
	source: "apache",
	extensions: [
		"wax"
	]
},
	"audio/x-ms-wma": {
	source: "apache",
	extensions: [
		"wma"
	]
},
	"audio/x-pn-realaudio": {
	source: "apache",
	extensions: [
		"ram",
		"ra"
	]
},
	"audio/x-pn-realaudio-plugin": {
	source: "apache",
	extensions: [
		"rmp"
	]
},
	"audio/x-realaudio": {
	source: "nginx",
	extensions: [
		"ra"
	]
},
	"audio/x-tta": {
	source: "apache"
},
	"audio/x-wav": {
	source: "apache",
	extensions: [
		"wav"
	]
},
	"audio/xm": {
	source: "apache",
	extensions: [
		"xm"
	]
},
	"chemical/x-cdx": {
	source: "apache",
	extensions: [
		"cdx"
	]
},
	"chemical/x-cif": {
	source: "apache",
	extensions: [
		"cif"
	]
},
	"chemical/x-cmdf": {
	source: "apache",
	extensions: [
		"cmdf"
	]
},
	"chemical/x-cml": {
	source: "apache",
	extensions: [
		"cml"
	]
},
	"chemical/x-csml": {
	source: "apache",
	extensions: [
		"csml"
	]
},
	"chemical/x-pdb": {
	source: "apache"
},
	"chemical/x-xyz": {
	source: "apache",
	extensions: [
		"xyz"
	]
},
	"font/collection": {
	source: "iana",
	extensions: [
		"ttc"
	]
},
	"font/otf": {
	source: "iana",
	compressible: true,
	extensions: [
		"otf"
	]
},
	"font/sfnt": {
	source: "iana"
},
	"font/ttf": {
	source: "iana",
	compressible: true,
	extensions: [
		"ttf"
	]
},
	"font/woff": {
	source: "iana",
	extensions: [
		"woff"
	]
},
	"font/woff2": {
	source: "iana",
	extensions: [
		"woff2"
	]
},
	"image/aces": {
	source: "iana",
	extensions: [
		"exr"
	]
},
	"image/apng": {
	compressible: false,
	extensions: [
		"apng"
	]
},
	"image/avci": {
	source: "iana",
	extensions: [
		"avci"
	]
},
	"image/avcs": {
	source: "iana",
	extensions: [
		"avcs"
	]
},
	"image/avif": {
	source: "iana",
	compressible: false,
	extensions: [
		"avif"
	]
},
	"image/bmp": {
	source: "iana",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/cgm": {
	source: "iana",
	extensions: [
		"cgm"
	]
},
	"image/dicom-rle": {
	source: "iana",
	extensions: [
		"drle"
	]
},
	"image/emf": {
	source: "iana",
	extensions: [
		"emf"
	]
},
	"image/fits": {
	source: "iana",
	extensions: [
		"fits"
	]
},
	"image/g3fax": {
	source: "iana",
	extensions: [
		"g3"
	]
},
	"image/gif": {
	source: "iana",
	compressible: false,
	extensions: [
		"gif"
	]
},
	"image/heic": {
	source: "iana",
	extensions: [
		"heic"
	]
},
	"image/heic-sequence": {
	source: "iana",
	extensions: [
		"heics"
	]
},
	"image/heif": {
	source: "iana",
	extensions: [
		"heif"
	]
},
	"image/heif-sequence": {
	source: "iana",
	extensions: [
		"heifs"
	]
},
	"image/hej2k": {
	source: "iana",
	extensions: [
		"hej2"
	]
},
	"image/hsj2": {
	source: "iana",
	extensions: [
		"hsj2"
	]
},
	"image/ief": {
	source: "iana",
	extensions: [
		"ief"
	]
},
	"image/jls": {
	source: "iana",
	extensions: [
		"jls"
	]
},
	"image/jp2": {
	source: "iana",
	compressible: false,
	extensions: [
		"jp2",
		"jpg2"
	]
},
	"image/jpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpeg",
		"jpg",
		"jpe"
	]
},
	"image/jph": {
	source: "iana",
	extensions: [
		"jph"
	]
},
	"image/jphc": {
	source: "iana",
	extensions: [
		"jhc"
	]
},
	"image/jpm": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpm"
	]
},
	"image/jpx": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpx",
		"jpf"
	]
},
	"image/jxr": {
	source: "iana",
	extensions: [
		"jxr"
	]
},
	"image/jxra": {
	source: "iana",
	extensions: [
		"jxra"
	]
},
	"image/jxrs": {
	source: "iana",
	extensions: [
		"jxrs"
	]
},
	"image/jxs": {
	source: "iana",
	extensions: [
		"jxs"
	]
},
	"image/jxsc": {
	source: "iana",
	extensions: [
		"jxsc"
	]
},
	"image/jxsi": {
	source: "iana",
	extensions: [
		"jxsi"
	]
},
	"image/jxss": {
	source: "iana",
	extensions: [
		"jxss"
	]
},
	"image/ktx": {
	source: "iana",
	extensions: [
		"ktx"
	]
},
	"image/ktx2": {
	source: "iana",
	extensions: [
		"ktx2"
	]
},
	"image/naplps": {
	source: "iana"
},
	"image/pjpeg": {
	compressible: false
},
	"image/png": {
	source: "iana",
	compressible: false,
	extensions: [
		"png"
	]
},
	"image/prs.btif": {
	source: "iana",
	extensions: [
		"btif"
	]
},
	"image/prs.pti": {
	source: "iana",
	extensions: [
		"pti"
	]
},
	"image/pwg-raster": {
	source: "iana"
},
	"image/sgi": {
	source: "apache",
	extensions: [
		"sgi"
	]
},
	"image/svg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"svg",
		"svgz"
	]
},
	"image/t38": {
	source: "iana",
	extensions: [
		"t38"
	]
},
	"image/tiff": {
	source: "iana",
	compressible: false,
	extensions: [
		"tif",
		"tiff"
	]
},
	"image/tiff-fx": {
	source: "iana",
	extensions: [
		"tfx"
	]
},
	"image/vnd.adobe.photoshop": {
	source: "iana",
	compressible: true,
	extensions: [
		"psd"
	]
},
	"image/vnd.airzip.accelerator.azv": {
	source: "iana",
	extensions: [
		"azv"
	]
},
	"image/vnd.cns.inf2": {
	source: "iana"
},
	"image/vnd.dece.graphic": {
	source: "iana",
	extensions: [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	]
},
	"image/vnd.djvu": {
	source: "iana",
	extensions: [
		"djvu",
		"djv"
	]
},
	"image/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"image/vnd.dwg": {
	source: "iana",
	extensions: [
		"dwg"
	]
},
	"image/vnd.dxf": {
	source: "iana",
	extensions: [
		"dxf"
	]
},
	"image/vnd.fastbidsheet": {
	source: "iana",
	extensions: [
		"fbs"
	]
},
	"image/vnd.fpx": {
	source: "iana",
	extensions: [
		"fpx"
	]
},
	"image/vnd.fst": {
	source: "iana",
	extensions: [
		"fst"
	]
},
	"image/vnd.fujixerox.edmics-mmr": {
	source: "iana",
	extensions: [
		"mmr"
	]
},
	"image/vnd.fujixerox.edmics-rlc": {
	source: "iana",
	extensions: [
		"rlc"
	]
},
	"image/vnd.globalgraphics.pgb": {
	source: "iana"
},
	"image/vnd.microsoft.icon": {
	source: "iana",
	compressible: true,
	extensions: [
		"ico"
	]
},
	"image/vnd.mix": {
	source: "iana"
},
	"image/vnd.mozilla.apng": {
	source: "iana"
},
	"image/vnd.ms-dds": {
	compressible: true,
	extensions: [
		"dds"
	]
},
	"image/vnd.ms-modi": {
	source: "iana",
	extensions: [
		"mdi"
	]
},
	"image/vnd.ms-photo": {
	source: "apache",
	extensions: [
		"wdp"
	]
},
	"image/vnd.net-fpx": {
	source: "iana",
	extensions: [
		"npx"
	]
},
	"image/vnd.pco.b16": {
	source: "iana",
	extensions: [
		"b16"
	]
},
	"image/vnd.radiance": {
	source: "iana"
},
	"image/vnd.sealed.png": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.gif": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.jpg": {
	source: "iana"
},
	"image/vnd.svf": {
	source: "iana"
},
	"image/vnd.tencent.tap": {
	source: "iana",
	extensions: [
		"tap"
	]
},
	"image/vnd.valve.source.texture": {
	source: "iana",
	extensions: [
		"vtf"
	]
},
	"image/vnd.wap.wbmp": {
	source: "iana",
	extensions: [
		"wbmp"
	]
},
	"image/vnd.xiff": {
	source: "iana",
	extensions: [
		"xif"
	]
},
	"image/vnd.zbrush.pcx": {
	source: "iana",
	extensions: [
		"pcx"
	]
},
	"image/webp": {
	source: "apache",
	extensions: [
		"webp"
	]
},
	"image/wmf": {
	source: "iana",
	extensions: [
		"wmf"
	]
},
	"image/x-3ds": {
	source: "apache",
	extensions: [
		"3ds"
	]
},
	"image/x-cmu-raster": {
	source: "apache",
	extensions: [
		"ras"
	]
},
	"image/x-cmx": {
	source: "apache",
	extensions: [
		"cmx"
	]
},
	"image/x-freehand": {
	source: "apache",
	extensions: [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	]
},
	"image/x-icon": {
	source: "apache",
	compressible: true,
	extensions: [
		"ico"
	]
},
	"image/x-jng": {
	source: "nginx",
	extensions: [
		"jng"
	]
},
	"image/x-mrsid-image": {
	source: "apache",
	extensions: [
		"sid"
	]
},
	"image/x-ms-bmp": {
	source: "nginx",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/x-pcx": {
	source: "apache",
	extensions: [
		"pcx"
	]
},
	"image/x-pict": {
	source: "apache",
	extensions: [
		"pic",
		"pct"
	]
},
	"image/x-portable-anymap": {
	source: "apache",
	extensions: [
		"pnm"
	]
},
	"image/x-portable-bitmap": {
	source: "apache",
	extensions: [
		"pbm"
	]
},
	"image/x-portable-graymap": {
	source: "apache",
	extensions: [
		"pgm"
	]
},
	"image/x-portable-pixmap": {
	source: "apache",
	extensions: [
		"ppm"
	]
},
	"image/x-rgb": {
	source: "apache",
	extensions: [
		"rgb"
	]
},
	"image/x-tga": {
	source: "apache",
	extensions: [
		"tga"
	]
},
	"image/x-xbitmap": {
	source: "apache",
	extensions: [
		"xbm"
	]
},
	"image/x-xcf": {
	compressible: false
},
	"image/x-xpixmap": {
	source: "apache",
	extensions: [
		"xpm"
	]
},
	"image/x-xwindowdump": {
	source: "apache",
	extensions: [
		"xwd"
	]
},
	"message/cpim": {
	source: "iana"
},
	"message/delivery-status": {
	source: "iana"
},
	"message/disposition-notification": {
	source: "iana",
	extensions: [
		"disposition-notification"
	]
},
	"message/external-body": {
	source: "iana"
},
	"message/feedback-report": {
	source: "iana"
},
	"message/global": {
	source: "iana",
	extensions: [
		"u8msg"
	]
},
	"message/global-delivery-status": {
	source: "iana",
	extensions: [
		"u8dsn"
	]
},
	"message/global-disposition-notification": {
	source: "iana",
	extensions: [
		"u8mdn"
	]
},
	"message/global-headers": {
	source: "iana",
	extensions: [
		"u8hdr"
	]
},
	"message/http": {
	source: "iana",
	compressible: false
},
	"message/imdn+xml": {
	source: "iana",
	compressible: true
},
	"message/news": {
	source: "iana"
},
	"message/partial": {
	source: "iana",
	compressible: false
},
	"message/rfc822": {
	source: "iana",
	compressible: true,
	extensions: [
		"eml",
		"mime"
	]
},
	"message/s-http": {
	source: "iana"
},
	"message/sip": {
	source: "iana"
},
	"message/sipfrag": {
	source: "iana"
},
	"message/tracking-status": {
	source: "iana"
},
	"message/vnd.si.simp": {
	source: "iana"
},
	"message/vnd.wfa.wsc": {
	source: "iana",
	extensions: [
		"wsc"
	]
},
	"model/3mf": {
	source: "iana",
	extensions: [
		"3mf"
	]
},
	"model/e57": {
	source: "iana"
},
	"model/gltf+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"gltf"
	]
},
	"model/gltf-binary": {
	source: "iana",
	compressible: true,
	extensions: [
		"glb"
	]
},
	"model/iges": {
	source: "iana",
	compressible: false,
	extensions: [
		"igs",
		"iges"
	]
},
	"model/mesh": {
	source: "iana",
	compressible: false,
	extensions: [
		"msh",
		"mesh",
		"silo"
	]
},
	"model/mtl": {
	source: "iana",
	extensions: [
		"mtl"
	]
},
	"model/obj": {
	source: "iana",
	extensions: [
		"obj"
	]
},
	"model/step": {
	source: "iana"
},
	"model/step+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"stpx"
	]
},
	"model/step+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"stpz"
	]
},
	"model/step-xml+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"stpxz"
	]
},
	"model/stl": {
	source: "iana",
	extensions: [
		"stl"
	]
},
	"model/vnd.collada+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dae"
	]
},
	"model/vnd.dwf": {
	source: "iana",
	extensions: [
		"dwf"
	]
},
	"model/vnd.flatland.3dml": {
	source: "iana"
},
	"model/vnd.gdl": {
	source: "iana",
	extensions: [
		"gdl"
	]
},
	"model/vnd.gs-gdl": {
	source: "apache"
},
	"model/vnd.gs.gdl": {
	source: "iana"
},
	"model/vnd.gtw": {
	source: "iana",
	extensions: [
		"gtw"
	]
},
	"model/vnd.moml+xml": {
	source: "iana",
	compressible: true
},
	"model/vnd.mts": {
	source: "iana",
	extensions: [
		"mts"
	]
},
	"model/vnd.opengex": {
	source: "iana",
	extensions: [
		"ogex"
	]
},
	"model/vnd.parasolid.transmit.binary": {
	source: "iana",
	extensions: [
		"x_b"
	]
},
	"model/vnd.parasolid.transmit.text": {
	source: "iana",
	extensions: [
		"x_t"
	]
},
	"model/vnd.pytha.pyox": {
	source: "iana"
},
	"model/vnd.rosette.annotated-data-model": {
	source: "iana"
},
	"model/vnd.sap.vds": {
	source: "iana",
	extensions: [
		"vds"
	]
},
	"model/vnd.usdz+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"usdz"
	]
},
	"model/vnd.valve.source.compiled-map": {
	source: "iana",
	extensions: [
		"bsp"
	]
},
	"model/vnd.vtu": {
	source: "iana",
	extensions: [
		"vtu"
	]
},
	"model/vrml": {
	source: "iana",
	compressible: false,
	extensions: [
		"wrl",
		"vrml"
	]
},
	"model/x3d+binary": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3db",
		"x3dbz"
	]
},
	"model/x3d+fastinfoset": {
	source: "iana",
	extensions: [
		"x3db"
	]
},
	"model/x3d+vrml": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3dv",
		"x3dvz"
	]
},
	"model/x3d+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"x3d",
		"x3dz"
	]
},
	"model/x3d-vrml": {
	source: "iana",
	extensions: [
		"x3dv"
	]
},
	"multipart/alternative": {
	source: "iana",
	compressible: false
},
	"multipart/appledouble": {
	source: "iana"
},
	"multipart/byteranges": {
	source: "iana"
},
	"multipart/digest": {
	source: "iana"
},
	"multipart/encrypted": {
	source: "iana",
	compressible: false
},
	"multipart/form-data": {
	source: "iana",
	compressible: false
},
	"multipart/header-set": {
	source: "iana"
},
	"multipart/mixed": {
	source: "iana"
},
	"multipart/multilingual": {
	source: "iana"
},
	"multipart/parallel": {
	source: "iana"
},
	"multipart/related": {
	source: "iana",
	compressible: false
},
	"multipart/report": {
	source: "iana"
},
	"multipart/signed": {
	source: "iana",
	compressible: false
},
	"multipart/vnd.bint.med-plus": {
	source: "iana"
},
	"multipart/voice-message": {
	source: "iana"
},
	"multipart/x-mixed-replace": {
	source: "iana"
},
	"text/1d-interleaved-parityfec": {
	source: "iana"
},
	"text/cache-manifest": {
	source: "iana",
	compressible: true,
	extensions: [
		"appcache",
		"manifest"
	]
},
	"text/calendar": {
	source: "iana",
	extensions: [
		"ics",
		"ifb"
	]
},
	"text/calender": {
	compressible: true
},
	"text/cmd": {
	compressible: true
},
	"text/coffeescript": {
	extensions: [
		"coffee",
		"litcoffee"
	]
},
	"text/cql": {
	source: "iana"
},
	"text/cql-expression": {
	source: "iana"
},
	"text/cql-identifier": {
	source: "iana"
},
	"text/css": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"css"
	]
},
	"text/csv": {
	source: "iana",
	compressible: true,
	extensions: [
		"csv"
	]
},
	"text/csv-schema": {
	source: "iana"
},
	"text/directory": {
	source: "iana"
},
	"text/dns": {
	source: "iana"
},
	"text/ecmascript": {
	source: "iana"
},
	"text/encaprtp": {
	source: "iana"
},
	"text/enriched": {
	source: "iana"
},
	"text/fhirpath": {
	source: "iana"
},
	"text/flexfec": {
	source: "iana"
},
	"text/fwdred": {
	source: "iana"
},
	"text/gff3": {
	source: "iana"
},
	"text/grammar-ref-list": {
	source: "iana"
},
	"text/html": {
	source: "iana",
	compressible: true,
	extensions: [
		"html",
		"htm",
		"shtml"
	]
},
	"text/jade": {
	extensions: [
		"jade"
	]
},
	"text/javascript": {
	source: "iana",
	compressible: true
},
	"text/jcr-cnd": {
	source: "iana"
},
	"text/jsx": {
	compressible: true,
	extensions: [
		"jsx"
	]
},
	"text/less": {
	compressible: true,
	extensions: [
		"less"
	]
},
	"text/markdown": {
	source: "iana",
	compressible: true,
	extensions: [
		"markdown",
		"md"
	]
},
	"text/mathml": {
	source: "nginx",
	extensions: [
		"mml"
	]
},
	"text/mdx": {
	compressible: true,
	extensions: [
		"mdx"
	]
},
	"text/mizar": {
	source: "iana"
},
	"text/n3": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"n3"
	]
},
	"text/parameters": {
	source: "iana",
	charset: "UTF-8"
},
	"text/parityfec": {
	source: "iana"
},
	"text/plain": {
	source: "iana",
	compressible: true,
	extensions: [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	]
},
	"text/provenance-notation": {
	source: "iana",
	charset: "UTF-8"
},
	"text/prs.fallenstein.rst": {
	source: "iana"
},
	"text/prs.lines.tag": {
	source: "iana",
	extensions: [
		"dsc"
	]
},
	"text/prs.prop.logic": {
	source: "iana"
},
	"text/raptorfec": {
	source: "iana"
},
	"text/red": {
	source: "iana"
},
	"text/rfc822-headers": {
	source: "iana"
},
	"text/richtext": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtx"
	]
},
	"text/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"text/rtp-enc-aescm128": {
	source: "iana"
},
	"text/rtploopback": {
	source: "iana"
},
	"text/rtx": {
	source: "iana"
},
	"text/sgml": {
	source: "iana",
	extensions: [
		"sgml",
		"sgm"
	]
},
	"text/shaclc": {
	source: "iana"
},
	"text/shex": {
	source: "iana",
	extensions: [
		"shex"
	]
},
	"text/slim": {
	extensions: [
		"slim",
		"slm"
	]
},
	"text/spdx": {
	source: "iana",
	extensions: [
		"spdx"
	]
},
	"text/strings": {
	source: "iana"
},
	"text/stylus": {
	extensions: [
		"stylus",
		"styl"
	]
},
	"text/t140": {
	source: "iana"
},
	"text/tab-separated-values": {
	source: "iana",
	compressible: true,
	extensions: [
		"tsv"
	]
},
	"text/troff": {
	source: "iana",
	extensions: [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	]
},
	"text/turtle": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"ttl"
	]
},
	"text/ulpfec": {
	source: "iana"
},
	"text/uri-list": {
	source: "iana",
	compressible: true,
	extensions: [
		"uri",
		"uris",
		"urls"
	]
},
	"text/vcard": {
	source: "iana",
	compressible: true,
	extensions: [
		"vcard"
	]
},
	"text/vnd.a": {
	source: "iana"
},
	"text/vnd.abc": {
	source: "iana"
},
	"text/vnd.ascii-art": {
	source: "iana"
},
	"text/vnd.curl": {
	source: "iana",
	extensions: [
		"curl"
	]
},
	"text/vnd.curl.dcurl": {
	source: "apache",
	extensions: [
		"dcurl"
	]
},
	"text/vnd.curl.mcurl": {
	source: "apache",
	extensions: [
		"mcurl"
	]
},
	"text/vnd.curl.scurl": {
	source: "apache",
	extensions: [
		"scurl"
	]
},
	"text/vnd.debian.copyright": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.dmclientscript": {
	source: "iana"
},
	"text/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"text/vnd.esmertec.theme-descriptor": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.familysearch.gedcom": {
	source: "iana",
	extensions: [
		"ged"
	]
},
	"text/vnd.ficlab.flt": {
	source: "iana"
},
	"text/vnd.fly": {
	source: "iana",
	extensions: [
		"fly"
	]
},
	"text/vnd.fmi.flexstor": {
	source: "iana",
	extensions: [
		"flx"
	]
},
	"text/vnd.gml": {
	source: "iana"
},
	"text/vnd.graphviz": {
	source: "iana",
	extensions: [
		"gv"
	]
},
	"text/vnd.hans": {
	source: "iana"
},
	"text/vnd.hgl": {
	source: "iana"
},
	"text/vnd.in3d.3dml": {
	source: "iana",
	extensions: [
		"3dml"
	]
},
	"text/vnd.in3d.spot": {
	source: "iana",
	extensions: [
		"spot"
	]
},
	"text/vnd.iptc.newsml": {
	source: "iana"
},
	"text/vnd.iptc.nitf": {
	source: "iana"
},
	"text/vnd.latex-z": {
	source: "iana"
},
	"text/vnd.motorola.reflex": {
	source: "iana"
},
	"text/vnd.ms-mediapackage": {
	source: "iana"
},
	"text/vnd.net2phone.commcenter.command": {
	source: "iana"
},
	"text/vnd.radisys.msml-basic-layout": {
	source: "iana"
},
	"text/vnd.senx.warpscript": {
	source: "iana"
},
	"text/vnd.si.uricatalogue": {
	source: "iana"
},
	"text/vnd.sosi": {
	source: "iana"
},
	"text/vnd.sun.j2me.app-descriptor": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"jad"
	]
},
	"text/vnd.trolltech.linguist": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.wap.si": {
	source: "iana"
},
	"text/vnd.wap.sl": {
	source: "iana"
},
	"text/vnd.wap.wml": {
	source: "iana",
	extensions: [
		"wml"
	]
},
	"text/vnd.wap.wmlscript": {
	source: "iana",
	extensions: [
		"wmls"
	]
},
	"text/vtt": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"vtt"
	]
},
	"text/x-asm": {
	source: "apache",
	extensions: [
		"s",
		"asm"
	]
},
	"text/x-c": {
	source: "apache",
	extensions: [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	]
},
	"text/x-component": {
	source: "nginx",
	extensions: [
		"htc"
	]
},
	"text/x-fortran": {
	source: "apache",
	extensions: [
		"f",
		"for",
		"f77",
		"f90"
	]
},
	"text/x-gwt-rpc": {
	compressible: true
},
	"text/x-handlebars-template": {
	extensions: [
		"hbs"
	]
},
	"text/x-java-source": {
	source: "apache",
	extensions: [
		"java"
	]
},
	"text/x-jquery-tmpl": {
	compressible: true
},
	"text/x-lua": {
	extensions: [
		"lua"
	]
},
	"text/x-markdown": {
	compressible: true,
	extensions: [
		"mkd"
	]
},
	"text/x-nfo": {
	source: "apache",
	extensions: [
		"nfo"
	]
},
	"text/x-opml": {
	source: "apache",
	extensions: [
		"opml"
	]
},
	"text/x-org": {
	compressible: true,
	extensions: [
		"org"
	]
},
	"text/x-pascal": {
	source: "apache",
	extensions: [
		"p",
		"pas"
	]
},
	"text/x-processing": {
	compressible: true,
	extensions: [
		"pde"
	]
},
	"text/x-sass": {
	extensions: [
		"sass"
	]
},
	"text/x-scss": {
	extensions: [
		"scss"
	]
},
	"text/x-setext": {
	source: "apache",
	extensions: [
		"etx"
	]
},
	"text/x-sfv": {
	source: "apache",
	extensions: [
		"sfv"
	]
},
	"text/x-suse-ymp": {
	compressible: true,
	extensions: [
		"ymp"
	]
},
	"text/x-uuencode": {
	source: "apache",
	extensions: [
		"uu"
	]
},
	"text/x-vcalendar": {
	source: "apache",
	extensions: [
		"vcs"
	]
},
	"text/x-vcard": {
	source: "apache",
	extensions: [
		"vcf"
	]
},
	"text/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml"
	]
},
	"text/xml-external-parsed-entity": {
	source: "iana"
},
	"text/yaml": {
	compressible: true,
	extensions: [
		"yaml",
		"yml"
	]
},
	"video/1d-interleaved-parityfec": {
	source: "iana"
},
	"video/3gpp": {
	source: "iana",
	extensions: [
		"3gp",
		"3gpp"
	]
},
	"video/3gpp-tt": {
	source: "iana"
},
	"video/3gpp2": {
	source: "iana",
	extensions: [
		"3g2"
	]
},
	"video/av1": {
	source: "iana"
},
	"video/bmpeg": {
	source: "iana"
},
	"video/bt656": {
	source: "iana"
},
	"video/celb": {
	source: "iana"
},
	"video/dv": {
	source: "iana"
},
	"video/encaprtp": {
	source: "iana"
},
	"video/ffv1": {
	source: "iana"
},
	"video/flexfec": {
	source: "iana"
},
	"video/h261": {
	source: "iana",
	extensions: [
		"h261"
	]
},
	"video/h263": {
	source: "iana",
	extensions: [
		"h263"
	]
},
	"video/h263-1998": {
	source: "iana"
},
	"video/h263-2000": {
	source: "iana"
},
	"video/h264": {
	source: "iana",
	extensions: [
		"h264"
	]
},
	"video/h264-rcdo": {
	source: "iana"
},
	"video/h264-svc": {
	source: "iana"
},
	"video/h265": {
	source: "iana"
},
	"video/iso.segment": {
	source: "iana",
	extensions: [
		"m4s"
	]
},
	"video/jpeg": {
	source: "iana",
	extensions: [
		"jpgv"
	]
},
	"video/jpeg2000": {
	source: "iana"
},
	"video/jpm": {
	source: "apache",
	extensions: [
		"jpm",
		"jpgm"
	]
},
	"video/jxsv": {
	source: "iana"
},
	"video/mj2": {
	source: "iana",
	extensions: [
		"mj2",
		"mjp2"
	]
},
	"video/mp1s": {
	source: "iana"
},
	"video/mp2p": {
	source: "iana"
},
	"video/mp2t": {
	source: "iana",
	extensions: [
		"ts"
	]
},
	"video/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"mp4",
		"mp4v",
		"mpg4"
	]
},
	"video/mp4v-es": {
	source: "iana"
},
	"video/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	]
},
	"video/mpeg4-generic": {
	source: "iana"
},
	"video/mpv": {
	source: "iana"
},
	"video/nv": {
	source: "iana"
},
	"video/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogv"
	]
},
	"video/parityfec": {
	source: "iana"
},
	"video/pointer": {
	source: "iana"
},
	"video/quicktime": {
	source: "iana",
	compressible: false,
	extensions: [
		"qt",
		"mov"
	]
},
	"video/raptorfec": {
	source: "iana"
},
	"video/raw": {
	source: "iana"
},
	"video/rtp-enc-aescm128": {
	source: "iana"
},
	"video/rtploopback": {
	source: "iana"
},
	"video/rtx": {
	source: "iana"
},
	"video/scip": {
	source: "iana"
},
	"video/smpte291": {
	source: "iana"
},
	"video/smpte292m": {
	source: "iana"
},
	"video/ulpfec": {
	source: "iana"
},
	"video/vc1": {
	source: "iana"
},
	"video/vc2": {
	source: "iana"
},
	"video/vnd.cctv": {
	source: "iana"
},
	"video/vnd.dece.hd": {
	source: "iana",
	extensions: [
		"uvh",
		"uvvh"
	]
},
	"video/vnd.dece.mobile": {
	source: "iana",
	extensions: [
		"uvm",
		"uvvm"
	]
},
	"video/vnd.dece.mp4": {
	source: "iana"
},
	"video/vnd.dece.pd": {
	source: "iana",
	extensions: [
		"uvp",
		"uvvp"
	]
},
	"video/vnd.dece.sd": {
	source: "iana",
	extensions: [
		"uvs",
		"uvvs"
	]
},
	"video/vnd.dece.video": {
	source: "iana",
	extensions: [
		"uvv",
		"uvvv"
	]
},
	"video/vnd.directv.mpeg": {
	source: "iana"
},
	"video/vnd.directv.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dlna.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dvb.file": {
	source: "iana",
	extensions: [
		"dvb"
	]
},
	"video/vnd.fvt": {
	source: "iana",
	extensions: [
		"fvt"
	]
},
	"video/vnd.hns.video": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsavc": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsmpeg2": {
	source: "iana"
},
	"video/vnd.motorola.video": {
	source: "iana"
},
	"video/vnd.motorola.videop": {
	source: "iana"
},
	"video/vnd.mpegurl": {
	source: "iana",
	extensions: [
		"mxu",
		"m4u"
	]
},
	"video/vnd.ms-playready.media.pyv": {
	source: "iana",
	extensions: [
		"pyv"
	]
},
	"video/vnd.nokia.interleaved-multimedia": {
	source: "iana"
},
	"video/vnd.nokia.mp4vr": {
	source: "iana"
},
	"video/vnd.nokia.videovoip": {
	source: "iana"
},
	"video/vnd.objectvideo": {
	source: "iana"
},
	"video/vnd.radgamettools.bink": {
	source: "iana"
},
	"video/vnd.radgamettools.smacker": {
	source: "iana"
},
	"video/vnd.sealed.mpeg1": {
	source: "iana"
},
	"video/vnd.sealed.mpeg4": {
	source: "iana"
},
	"video/vnd.sealed.swf": {
	source: "iana"
},
	"video/vnd.sealedmedia.softseal.mov": {
	source: "iana"
},
	"video/vnd.uvvu.mp4": {
	source: "iana",
	extensions: [
		"uvu",
		"uvvu"
	]
},
	"video/vnd.vivo": {
	source: "iana",
	extensions: [
		"viv"
	]
},
	"video/vnd.youtube.yt": {
	source: "iana"
},
	"video/vp8": {
	source: "iana"
},
	"video/vp9": {
	source: "iana"
},
	"video/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"webm"
	]
},
	"video/x-f4v": {
	source: "apache",
	extensions: [
		"f4v"
	]
},
	"video/x-fli": {
	source: "apache",
	extensions: [
		"fli"
	]
},
	"video/x-flv": {
	source: "apache",
	compressible: false,
	extensions: [
		"flv"
	]
},
	"video/x-m4v": {
	source: "apache",
	extensions: [
		"m4v"
	]
},
	"video/x-matroska": {
	source: "apache",
	compressible: false,
	extensions: [
		"mkv",
		"mk3d",
		"mks"
	]
},
	"video/x-mng": {
	source: "apache",
	extensions: [
		"mng"
	]
},
	"video/x-ms-asf": {
	source: "apache",
	extensions: [
		"asf",
		"asx"
	]
},
	"video/x-ms-vob": {
	source: "apache",
	extensions: [
		"vob"
	]
},
	"video/x-ms-wm": {
	source: "apache",
	extensions: [
		"wm"
	]
},
	"video/x-ms-wmv": {
	source: "apache",
	compressible: false,
	extensions: [
		"wmv"
	]
},
	"video/x-ms-wmx": {
	source: "apache",
	extensions: [
		"wmx"
	]
},
	"video/x-ms-wvx": {
	source: "apache",
	extensions: [
		"wvx"
	]
},
	"video/x-msvideo": {
	source: "apache",
	extensions: [
		"avi"
	]
},
	"video/x-sgi-movie": {
	source: "apache",
	extensions: [
		"movie"
	]
},
	"video/x-smv": {
	source: "apache",
	extensions: [
		"smv"
	]
},
	"x-conference/x-cooltalk": {
	source: "apache",
	extensions: [
		"ice"
	]
},
	"x-shader/x-fragment": {
	compressible: true
},
	"x-shader/x-vertex": {
	compressible: true
}
};

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredMimeDb;

function requireMimeDb () {
	if (hasRequiredMimeDb) return mimeDbExports;
	hasRequiredMimeDb = 1;
	(function (module) {
		/**
		 * Module exports.
		 */

		module.exports = require$$0;
} (mimeDb));
	return mimeDbExports;
}

/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredMimeTypes;

function requireMimeTypes () {
	if (hasRequiredMimeTypes) return mimeTypes;
	hasRequiredMimeTypes = 1;
	(function (exports) {

		/**
		 * Module dependencies.
		 * @private
		 */

		var db = requireMimeDb();
		var extname = require$$1.extname;

		/**
		 * Module variables.
		 * @private
		 */

		var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
		var TEXT_TYPE_REGEXP = /^text\//i;

		/**
		 * Module exports.
		 * @public
		 */

		exports.charset = charset;
		exports.charsets = { lookup: charset };
		exports.contentType = contentType;
		exports.extension = extension;
		exports.extensions = Object.create(null);
		exports.lookup = lookup;
		exports.types = Object.create(null);

		// Populate the extensions/types maps
		populateMaps(exports.extensions, exports.types);

		/**
		 * Get the default charset for a MIME type.
		 *
		 * @param {string} type
		 * @return {boolean|string}
		 */

		function charset (type) {
		  if (!type || typeof type !== 'string') {
		    return false
		  }

		  // TODO: use media-typer
		  var match = EXTRACT_TYPE_REGEXP.exec(type);
		  var mime = match && db[match[1].toLowerCase()];

		  if (mime && mime.charset) {
		    return mime.charset
		  }

		  // default text/* to utf-8
		  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
		    return 'UTF-8'
		  }

		  return false
		}

		/**
		 * Create a full Content-Type header given a MIME type or extension.
		 *
		 * @param {string} str
		 * @return {boolean|string}
		 */

		function contentType (str) {
		  // TODO: should this even be in this module?
		  if (!str || typeof str !== 'string') {
		    return false
		  }

		  var mime = str.indexOf('/') === -1
		    ? exports.lookup(str)
		    : str;

		  if (!mime) {
		    return false
		  }

		  // TODO: use content-type or other module
		  if (mime.indexOf('charset') === -1) {
		    var charset = exports.charset(mime);
		    if (charset) mime += '; charset=' + charset.toLowerCase();
		  }

		  return mime
		}

		/**
		 * Get the default extension for a MIME type.
		 *
		 * @param {string} type
		 * @return {boolean|string}
		 */

		function extension (type) {
		  if (!type || typeof type !== 'string') {
		    return false
		  }

		  // TODO: use media-typer
		  var match = EXTRACT_TYPE_REGEXP.exec(type);

		  // get extensions
		  var exts = match && exports.extensions[match[1].toLowerCase()];

		  if (!exts || !exts.length) {
		    return false
		  }

		  return exts[0]
		}

		/**
		 * Lookup the MIME type for a file path/extension.
		 *
		 * @param {string} path
		 * @return {boolean|string}
		 */

		function lookup (path) {
		  if (!path || typeof path !== 'string') {
		    return false
		  }

		  // get the extension ("ext" or ".ext" or full path)
		  var extension = extname('x.' + path)
		    .toLowerCase()
		    .substr(1);

		  if (!extension) {
		    return false
		  }

		  return exports.types[extension] || false
		}

		/**
		 * Populate the extensions and types maps.
		 * @private
		 */

		function populateMaps (extensions, types) {
		  // source preference (least -> most)
		  var preference = ['nginx', 'apache', undefined, 'iana'];

		  Object.keys(db).forEach(function forEachMimeType (type) {
		    var mime = db[type];
		    var exts = mime.extensions;

		    if (!exts || !exts.length) {
		      return
		    }

		    // mime -> extensions
		    extensions[type] = exts;

		    // extension -> mime
		    for (var i = 0; i < exts.length; i++) {
		      var extension = exts[i];

		      if (types[extension]) {
		        var from = preference.indexOf(db[types[extension]].source);
		        var to = preference.indexOf(mime.source);

		        if (types[extension] !== 'application/octet-stream' &&
		          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
		          // skip the remapping
		          continue
		        }
		      }

		      // set the extension -> mime
		      types[extension] = type;
		    }
		  });
		}
} (mimeTypes));
	return mimeTypes;
}

/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var accepts;
var hasRequiredAccepts;

function requireAccepts () {
	if (hasRequiredAccepts) return accepts;
	hasRequiredAccepts = 1;

	/**
	 * Module dependencies.
	 * @private
	 */

	var Negotiator = requireNegotiator();
	var mime = requireMimeTypes();

	/**
	 * Module exports.
	 * @public
	 */

	accepts = Accepts;

	/**
	 * Create a new Accepts object for the given req.
	 *
	 * @param {object} req
	 * @public
	 */

	function Accepts (req) {
	  if (!(this instanceof Accepts)) {
	    return new Accepts(req)
	  }

	  this.headers = req.headers;
	  this.negotiator = new Negotiator(req);
	}

	/**
	 * Check if the given `type(s)` is acceptable, returning
	 * the best match when true, otherwise `undefined`, in which
	 * case you should respond with 406 "Not Acceptable".
	 *
	 * The `type` value may be a single mime type string
	 * such as "application/json", the extension name
	 * such as "json" or an array `["json", "html", "text/plain"]`. When a list
	 * or array is given the _best_ match, if any is returned.
	 *
	 * Examples:
	 *
	 *     // Accept: text/html
	 *     this.types('html');
	 *     // => "html"
	 *
	 *     // Accept: text/*, application/json
	 *     this.types('html');
	 *     // => "html"
	 *     this.types('text/html');
	 *     // => "text/html"
	 *     this.types('json', 'text');
	 *     // => "json"
	 *     this.types('application/json');
	 *     // => "application/json"
	 *
	 *     // Accept: text/*, application/json
	 *     this.types('image/png');
	 *     this.types('png');
	 *     // => undefined
	 *
	 *     // Accept: text/*;q=.5, application/json
	 *     this.types(['html', 'json']);
	 *     this.types('html', 'json');
	 *     // => "json"
	 *
	 * @param {String|Array} types...
	 * @return {String|Array|Boolean}
	 * @public
	 */

	Accepts.prototype.type =
	Accepts.prototype.types = function (types_) {
	  var types = types_;

	  // support flattened arguments
	  if (types && !Array.isArray(types)) {
	    types = new Array(arguments.length);
	    for (var i = 0; i < types.length; i++) {
	      types[i] = arguments[i];
	    }
	  }

	  // no types, return all requested types
	  if (!types || types.length === 0) {
	    return this.negotiator.mediaTypes()
	  }

	  // no accept header, return first given type
	  if (!this.headers.accept) {
	    return types[0]
	  }

	  var mimes = types.map(extToMime);
	  var accepts = this.negotiator.mediaTypes(mimes.filter(validMime));
	  var first = accepts[0];

	  return first
	    ? types[mimes.indexOf(first)]
	    : false
	};

	/**
	 * Return accepted encodings or best fit based on `encodings`.
	 *
	 * Given `Accept-Encoding: gzip, deflate`
	 * an array sorted by quality is returned:
	 *
	 *     ['gzip', 'deflate']
	 *
	 * @param {String|Array} encodings...
	 * @return {String|Array}
	 * @public
	 */

	Accepts.prototype.encoding =
	Accepts.prototype.encodings = function (encodings_) {
	  var encodings = encodings_;

	  // support flattened arguments
	  if (encodings && !Array.isArray(encodings)) {
	    encodings = new Array(arguments.length);
	    for (var i = 0; i < encodings.length; i++) {
	      encodings[i] = arguments[i];
	    }
	  }

	  // no encodings, return all requested encodings
	  if (!encodings || encodings.length === 0) {
	    return this.negotiator.encodings()
	  }

	  return this.negotiator.encodings(encodings)[0] || false
	};

	/**
	 * Return accepted charsets or best fit based on `charsets`.
	 *
	 * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
	 * an array sorted by quality is returned:
	 *
	 *     ['utf-8', 'utf-7', 'iso-8859-1']
	 *
	 * @param {String|Array} charsets...
	 * @return {String|Array}
	 * @public
	 */

	Accepts.prototype.charset =
	Accepts.prototype.charsets = function (charsets_) {
	  var charsets = charsets_;

	  // support flattened arguments
	  if (charsets && !Array.isArray(charsets)) {
	    charsets = new Array(arguments.length);
	    for (var i = 0; i < charsets.length; i++) {
	      charsets[i] = arguments[i];
	    }
	  }

	  // no charsets, return all requested charsets
	  if (!charsets || charsets.length === 0) {
	    return this.negotiator.charsets()
	  }

	  return this.negotiator.charsets(charsets)[0] || false
	};

	/**
	 * Return accepted languages or best fit based on `langs`.
	 *
	 * Given `Accept-Language: en;q=0.8, es, pt`
	 * an array sorted by quality is returned:
	 *
	 *     ['es', 'pt', 'en']
	 *
	 * @param {String|Array} langs...
	 * @return {Array|String}
	 * @public
	 */

	Accepts.prototype.lang =
	Accepts.prototype.langs =
	Accepts.prototype.language =
	Accepts.prototype.languages = function (languages_) {
	  var languages = languages_;

	  // support flattened arguments
	  if (languages && !Array.isArray(languages)) {
	    languages = new Array(arguments.length);
	    for (var i = 0; i < languages.length; i++) {
	      languages[i] = arguments[i];
	    }
	  }

	  // no languages, return all requested languages
	  if (!languages || languages.length === 0) {
	    return this.negotiator.languages()
	  }

	  return this.negotiator.languages(languages)[0] || false
	};

	/**
	 * Convert extnames to mime.
	 *
	 * @param {String} type
	 * @return {String}
	 * @private
	 */

	function extToMime (type) {
	  return type.indexOf('/') === -1
	    ? mime.lookup(type)
	    : type
	}

	/**
	 * Check if mime is valid.
	 *
	 * @param {String} type
	 * @return {String}
	 * @private
	 */

	function validMime (type) {
	  return typeof type === 'string'
	}
	return accepts;
}

var safeBufferExports = {};
var safeBuffer = {
  get exports(){ return safeBufferExports; },
  set exports(v){ safeBufferExports = v; },
};

/* eslint-disable node/no-deprecated-api */

var hasRequiredSafeBuffer;

function requireSafeBuffer () {
	if (hasRequiredSafeBuffer) return safeBufferExports;
	hasRequiredSafeBuffer = 1;
	(function (module, exports) {
		var buffer = require$$0$1;
		var Buffer = buffer.Buffer;

		// alternative to using Object.keys for old browsers
		function copyProps (src, dst) {
		  for (var key in src) {
		    dst[key] = src[key];
		  }
		}
		if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
		  module.exports = buffer;
		} else {
		  // Copy properties from require('buffer')
		  copyProps(buffer, exports);
		  exports.Buffer = SafeBuffer;
		}

		function SafeBuffer (arg, encodingOrOffset, length) {
		  return Buffer(arg, encodingOrOffset, length)
		}

		// Copy static methods from Buffer
		copyProps(Buffer, SafeBuffer);

		SafeBuffer.from = function (arg, encodingOrOffset, length) {
		  if (typeof arg === 'number') {
		    throw new TypeError('Argument must not be a number')
		  }
		  return Buffer(arg, encodingOrOffset, length)
		};

		SafeBuffer.alloc = function (size, fill, encoding) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  var buf = Buffer(size);
		  if (fill !== undefined) {
		    if (typeof encoding === 'string') {
		      buf.fill(fill, encoding);
		    } else {
		      buf.fill(fill);
		    }
		  } else {
		    buf.fill(0);
		  }
		  return buf
		};

		SafeBuffer.allocUnsafe = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return Buffer(size)
		};

		SafeBuffer.allocUnsafeSlow = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return buffer.SlowBuffer(size)
		};
} (safeBuffer, safeBufferExports));
	return safeBufferExports;
}

var bytesExports = {};
var bytes = {
  get exports(){ return bytesExports; },
  set exports(v){ bytesExports = v; },
};

/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */

var hasRequiredBytes;

function requireBytes () {
	if (hasRequiredBytes) return bytesExports;
	hasRequiredBytes = 1;

	/**
	 * Module exports.
	 * @public
	 */

	bytes.exports = bytes$1;
	bytesExports.format = format;
	bytesExports.parse = parse;

	/**
	 * Module variables.
	 * @private
	 */

	var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;

	var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

	var map = {
	  b:  1,
	  kb: 1 << 10,
	  mb: 1 << 20,
	  gb: 1 << 30,
	  tb: ((1 << 30) * 1024)
	};

	var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb)$/i;

	/**
	 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
	 *
	 * @param {string|number} value
	 * @param {{
	 *  case: [string],
	 *  decimalPlaces: [number]
	 *  fixedDecimals: [boolean]
	 *  thousandsSeparator: [string]
	 *  unitSeparator: [string]
	 *  }} [options] bytes options.
	 *
	 * @returns {string|number|null}
	 */

	function bytes$1(value, options) {
	  if (typeof value === 'string') {
	    return parse(value);
	  }

	  if (typeof value === 'number') {
	    return format(value, options);
	  }

	  return null;
	}

	/**
	 * Format the given value in bytes into a string.
	 *
	 * If the value is negative, it is kept as such. If it is a float,
	 * it is rounded.
	 *
	 * @param {number} value
	 * @param {object} [options]
	 * @param {number} [options.decimalPlaces=2]
	 * @param {number} [options.fixedDecimals=false]
	 * @param {string} [options.thousandsSeparator=]
	 * @param {string} [options.unit=]
	 * @param {string} [options.unitSeparator=]
	 *
	 * @returns {string|null}
	 * @public
	 */

	function format(value, options) {
	  if (!Number.isFinite(value)) {
	    return null;
	  }

	  var mag = Math.abs(value);
	  var thousandsSeparator = (options && options.thousandsSeparator) || '';
	  var unitSeparator = (options && options.unitSeparator) || '';
	  var decimalPlaces = (options && options.decimalPlaces !== undefined) ? options.decimalPlaces : 2;
	  var fixedDecimals = Boolean(options && options.fixedDecimals);
	  var unit = (options && options.unit) || '';

	  if (!unit || !map[unit.toLowerCase()]) {
	    if (mag >= map.tb) {
	      unit = 'TB';
	    } else if (mag >= map.gb) {
	      unit = 'GB';
	    } else if (mag >= map.mb) {
	      unit = 'MB';
	    } else if (mag >= map.kb) {
	      unit = 'KB';
	    } else {
	      unit = 'B';
	    }
	  }

	  var val = value / map[unit.toLowerCase()];
	  var str = val.toFixed(decimalPlaces);

	  if (!fixedDecimals) {
	    str = str.replace(formatDecimalsRegExp, '$1');
	  }

	  if (thousandsSeparator) {
	    str = str.replace(formatThousandsRegExp, thousandsSeparator);
	  }

	  return str + unitSeparator + unit;
	}

	/**
	 * Parse the string value into an integer in bytes.
	 *
	 * If no unit is given, it is assumed the value is in bytes.
	 *
	 * @param {number|string} val
	 *
	 * @returns {number|null}
	 * @public
	 */

	function parse(val) {
	  if (typeof val === 'number' && !isNaN(val)) {
	    return val;
	  }

	  if (typeof val !== 'string') {
	    return null;
	  }

	  // Test if the string passed is valid
	  var results = parseRegExp.exec(val);
	  var floatValue;
	  var unit = 'b';

	  if (!results) {
	    // Nothing could be extracted from the given string
	    floatValue = parseInt(val, 10);
	    unit = 'b';
	  } else {
	    // Retrieve the value and the unit
	    floatValue = parseFloat(results[1]);
	    unit = results[4].toLowerCase();
	  }

	  return Math.floor(map[unit] * floatValue);
	}
	return bytesExports;
}

/*!
 * compressible
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Jeremiah Senkpiel
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var compressible_1;
var hasRequiredCompressible;

function requireCompressible () {
	if (hasRequiredCompressible) return compressible_1;
	hasRequiredCompressible = 1;

	/**
	 * Module dependencies.
	 * @private
	 */

	var db = requireMimeDb();

	/**
	 * Module variables.
	 * @private
	 */

	var COMPRESSIBLE_TYPE_REGEXP = /^text\/|\+(?:json|text|xml)$/i;
	var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;

	/**
	 * Module exports.
	 * @public
	 */

	compressible_1 = compressible;

	/**
	 * Checks if a type is compressible.
	 *
	 * @param {string} type
	 * @return {Boolean} compressible
	 * @public
	 */

	function compressible (type) {
	  if (!type || typeof type !== 'string') {
	    return false
	  }

	  // strip parameters
	  var match = EXTRACT_TYPE_REGEXP.exec(type);
	  var mime = match && match[1].toLowerCase();
	  var data = db[mime];

	  // return database information
	  if (data && data.compressible !== undefined) {
	    return data.compressible
	  }

	  // fallback to regexp or unknown
	  return COMPRESSIBLE_TYPE_REGEXP.test(mime) || undefined
	}
	return compressible_1;
}

var srcExports = {};
var src = {
  get exports(){ return srcExports; },
  set exports(v){ srcExports = v; },
};

var browserExports = {};
var browser = {
  get exports(){ return browserExports; },
  set exports(v){ browserExports = v; },
};

var debugExports = {};
var debug = {
  get exports(){ return debugExports; },
  set exports(v){ debugExports = v; },
};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}
	return ms;
}

var hasRequiredDebug;

function requireDebug () {
	if (hasRequiredDebug) return debugExports;
	hasRequiredDebug = 1;
	(function (module, exports) {
		/**
		 * This is the common logic for both the Node.js and web browser
		 * implementations of `debug()`.
		 *
		 * Expose `debug()` as the module.
		 */

		exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
		exports.coerce = coerce;
		exports.disable = disable;
		exports.enable = enable;
		exports.enabled = enabled;
		exports.humanize = requireMs();

		/**
		 * The currently active debug mode names, and names to skip.
		 */

		exports.names = [];
		exports.skips = [];

		/**
		 * Map of special "%n" handling functions, for the debug "format" argument.
		 *
		 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		 */

		exports.formatters = {};

		/**
		 * Previous log timestamp.
		 */

		var prevTime;

		/**
		 * Select a color.
		 * @param {String} namespace
		 * @return {Number}
		 * @api private
		 */

		function selectColor(namespace) {
		  var hash = 0, i;

		  for (i in namespace) {
		    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
		    hash |= 0; // Convert to 32bit integer
		  }

		  return exports.colors[Math.abs(hash) % exports.colors.length];
		}

		/**
		 * Create a debugger with the given `namespace`.
		 *
		 * @param {String} namespace
		 * @return {Function}
		 * @api public
		 */

		function createDebug(namespace) {

		  function debug() {
		    // disabled?
		    if (!debug.enabled) return;

		    var self = debug;

		    // set `diff` timestamp
		    var curr = +new Date();
		    var ms = curr - (prevTime || curr);
		    self.diff = ms;
		    self.prev = prevTime;
		    self.curr = curr;
		    prevTime = curr;

		    // turn the `arguments` into a proper Array
		    var args = new Array(arguments.length);
		    for (var i = 0; i < args.length; i++) {
		      args[i] = arguments[i];
		    }

		    args[0] = exports.coerce(args[0]);

		    if ('string' !== typeof args[0]) {
		      // anything else let's inspect with %O
		      args.unshift('%O');
		    }

		    // apply any `formatters` transformations
		    var index = 0;
		    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
		      // if we encounter an escaped % then don't increase the array index
		      if (match === '%%') return match;
		      index++;
		      var formatter = exports.formatters[format];
		      if ('function' === typeof formatter) {
		        var val = args[index];
		        match = formatter.call(self, val);

		        // now we need to remove `args[index]` since it's inlined in the `format`
		        args.splice(index, 1);
		        index--;
		      }
		      return match;
		    });

		    // apply env-specific formatting (colors, etc.)
		    exports.formatArgs.call(self, args);

		    var logFn = debug.log || exports.log || console.log.bind(console);
		    logFn.apply(self, args);
		  }

		  debug.namespace = namespace;
		  debug.enabled = exports.enabled(namespace);
		  debug.useColors = exports.useColors();
		  debug.color = selectColor(namespace);

		  // env-specific initialization logic for debug instances
		  if ('function' === typeof exports.init) {
		    exports.init(debug);
		  }

		  return debug;
		}

		/**
		 * Enables a debug mode by namespaces. This can include modes
		 * separated by a colon and wildcards.
		 *
		 * @param {String} namespaces
		 * @api public
		 */

		function enable(namespaces) {
		  exports.save(namespaces);

		  exports.names = [];
		  exports.skips = [];

		  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		  var len = split.length;

		  for (var i = 0; i < len; i++) {
		    if (!split[i]) continue; // ignore empty strings
		    namespaces = split[i].replace(/\*/g, '.*?');
		    if (namespaces[0] === '-') {
		      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
		    } else {
		      exports.names.push(new RegExp('^' + namespaces + '$'));
		    }
		  }
		}

		/**
		 * Disable debug output.
		 *
		 * @api public
		 */

		function disable() {
		  exports.enable('');
		}

		/**
		 * Returns true if the given mode name is enabled, false otherwise.
		 *
		 * @param {String} name
		 * @return {Boolean}
		 * @api public
		 */

		function enabled(name) {
		  var i, len;
		  for (i = 0, len = exports.skips.length; i < len; i++) {
		    if (exports.skips[i].test(name)) {
		      return false;
		    }
		  }
		  for (i = 0, len = exports.names.length; i < len; i++) {
		    if (exports.names[i].test(name)) {
		      return true;
		    }
		  }
		  return false;
		}

		/**
		 * Coerce `val`.
		 *
		 * @param {Mixed} val
		 * @return {Mixed}
		 * @api private
		 */

		function coerce(val) {
		  if (val instanceof Error) return val.stack || val.message;
		  return val;
		}
} (debug, debugExports));
	return debugExports;
}

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browserExports;
	hasRequiredBrowser = 1;
	(function (module, exports) {
		exports = module.exports = requireDebug();
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.storage = 'undefined' != typeof chrome
		               && 'undefined' != typeof chrome.storage
		                  ? chrome.storage.local
		                  : localstorage();

		/**
		 * Colors.
		 */

		exports.colors = [
		  'lightseagreen',
		  'forestgreen',
		  'goldenrod',
		  'dodgerblue',
		  'darkorchid',
		  'crimson'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		function useColors() {
		  // NB: In an Electron preload script, document will be defined but not fully
		  // initialized. Since we know we're in Chrome, we'll just detect this case
		  // explicitly
		  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
		    return true;
		  }

		  // is webkit? http://stackoverflow.com/a/16459606/376773
		  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
		  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		    // is firebug? http://stackoverflow.com/a/398120/376773
		    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		    // is firefox >= v31?
		    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		    // double check webkit in userAgent just in case we are in a worker
		    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		exports.formatters.j = function(v) {
		  try {
		    return JSON.stringify(v);
		  } catch (err) {
		    return '[UnexpectedJSONParseError]: ' + err.message;
		  }
		};


		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
		  var useColors = this.useColors;

		  args[0] = (useColors ? '%c' : '')
		    + this.namespace
		    + (useColors ? ' %c' : ' ')
		    + args[0]
		    + (useColors ? '%c ' : ' ')
		    + '+' + exports.humanize(this.diff);

		  if (!useColors) return;

		  var c = 'color: ' + this.color;
		  args.splice(1, 0, c, 'color: inherit');

		  // the final "%c" is somewhat tricky, because there could be other
		  // arguments passed either before or after the %c, so we need to
		  // figure out the correct index to insert the CSS into
		  var index = 0;
		  var lastC = 0;
		  args[0].replace(/%[a-zA-Z%]/g, function(match) {
		    if ('%%' === match) return;
		    index++;
		    if ('%c' === match) {
		      // we only are interested in the *last* %c
		      // (the user may have provided their own)
		      lastC = index;
		    }
		  });

		  args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.log()` when available.
		 * No-op when `console.log` is not a "function".
		 *
		 * @api public
		 */

		function log() {
		  // this hackery is required for IE8/9, where
		  // the `console.log` function doesn't have 'apply'
		  return 'object' === typeof console
		    && console.log
		    && Function.prototype.apply.call(console.log, console, arguments);
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */

		function save(namespaces) {
		  try {
		    if (null == namespaces) {
		      exports.storage.removeItem('debug');
		    } else {
		      exports.storage.debug = namespaces;
		    }
		  } catch(e) {}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
		  var r;
		  try {
		    r = exports.storage.debug;
		  } catch(e) {}

		  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
		  if (!r && typeof process !== 'undefined' && 'env' in process) {
		    r = process.env.DEBUG;
		  }

		  return r;
		}

		/**
		 * Enable namespaces listed in `localStorage.debug` initially.
		 */

		exports.enable(load());

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
		  try {
		    return window.localStorage;
		  } catch (e) {}
		}
} (browser, browserExports));
	return browserExports;
}

var nodeExports = {};
var node = {
  get exports(){ return nodeExports; },
  set exports(v){ nodeExports = v; },
};

/**
 * Module dependencies.
 */

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return nodeExports;
	hasRequiredNode = 1;
	(function (module, exports) {
		var tty = require$$0$2;
		var util = require$$1$1;

		/**
		 * This is the Node.js implementation of `debug()`.
		 *
		 * Expose `debug()` as the module.
		 */

		exports = module.exports = requireDebug();
		exports.init = init;
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;

		/**
		 * Colors.
		 */

		exports.colors = [6, 2, 3, 4, 5, 1];

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports.inspectOpts = Object.keys(process.env).filter(function (key) {
		  return /^debug_/i.test(key);
		}).reduce(function (obj, key) {
		  // camel-case
		  var prop = key
		    .substring(6)
		    .toLowerCase()
		    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

		  // coerce string value into JS value
		  var val = process.env[key];
		  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		  else if (val === 'null') val = null;
		  else val = Number(val);

		  obj[prop] = val;
		  return obj;
		}, {});

		/**
		 * The file descriptor to write the `debug()` calls to.
		 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
		 *
		 *   $ DEBUG_FD=3 node script.js 3>debug.log
		 */

		var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

		if (1 !== fd && 2 !== fd) {
		  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')();
		}

		var stream = 1 === fd ? process.stdout :
		             2 === fd ? process.stderr :
		             createWritableStdioStream(fd);

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
		  return 'colors' in exports.inspectOpts
		    ? Boolean(exports.inspectOpts.colors)
		    : tty.isatty(fd);
		}

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		exports.formatters.o = function(v) {
		  this.inspectOpts.colors = this.useColors;
		  return util.inspect(v, this.inspectOpts)
		    .split('\n').map(function(str) {
		      return str.trim()
		    }).join(' ');
		};

		/**
		 * Map %o to `util.inspect()`, allowing multiple lines if needed.
		 */

		exports.formatters.O = function(v) {
		  this.inspectOpts.colors = this.useColors;
		  return util.inspect(v, this.inspectOpts);
		};

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
		  var name = this.namespace;
		  var useColors = this.useColors;

		  if (useColors) {
		    var c = this.color;
		    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

		    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
		  } else {
		    args[0] = new Date().toUTCString()
		      + ' ' + name + ' ' + args[0];
		  }
		}

		/**
		 * Invokes `util.format()` with the specified arguments and writes to `stream`.
		 */

		function log() {
		  return stream.write(util.format.apply(util, arguments) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */

		function save(namespaces) {
		  if (null == namespaces) {
		    // If you set a process.env field to null or undefined, it gets cast to the
		    // string 'null' or 'undefined'. Just delete instead.
		    delete process.env.DEBUG;
		  } else {
		    process.env.DEBUG = namespaces;
		  }
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
		  return process.env.DEBUG;
		}

		/**
		 * Copied from `node/src/node.js`.
		 *
		 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
		 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
		 */

		function createWritableStdioStream (fd) {
		  var stream;
		  var tty_wrap = process.binding('tty_wrap');

		  // Note stream._type is used for test-module-load-list.js

		  switch (tty_wrap.guessHandleType(fd)) {
		    case 'TTY':
		      stream = new tty.WriteStream(fd);
		      stream._type = 'tty';

		      // Hack to have stream not keep the event loop alive.
		      // See https://github.com/joyent/node/issues/1726
		      if (stream._handle && stream._handle.unref) {
		        stream._handle.unref();
		      }
		      break;

		    case 'FILE':
		      var fs = fs__default;
		      stream = new fs.SyncWriteStream(fd, { autoClose: false });
		      stream._type = 'fs';
		      break;

		    case 'PIPE':
		    case 'TCP':
		      var net = require$$4;
		      stream = new net.Socket({
		        fd: fd,
		        readable: false,
		        writable: true
		      });

		      // FIXME Should probably have an option in net.Socket to create a
		      // stream from an existing fd which is writable only. But for now
		      // we'll just add this hack and set the `readable` member to false.
		      // Test: ./node test/fixtures/echo.js < /etc/passwd
		      stream.readable = false;
		      stream.read = null;
		      stream._type = 'pipe';

		      // FIXME Hack to have stream not keep the event loop alive.
		      // See https://github.com/joyent/node/issues/1726
		      if (stream._handle && stream._handle.unref) {
		        stream._handle.unref();
		      }
		      break;

		    default:
		      // Probably an error on in uv_guess_handle()
		      throw new Error('Implement me. Unknown stream file type!');
		  }

		  // For supporting legacy API we put the FD here.
		  stream.fd = fd;

		  stream._isStdio = true;

		  return stream;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init (debug) {
		  debug.inspectOpts = {};

		  var keys = Object.keys(exports.inspectOpts);
		  for (var i = 0; i < keys.length; i++) {
		    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
		  }
		}

		/**
		 * Enable namespaces listed in `process.env.DEBUG` initially.
		 */

		exports.enable(load());
} (node, nodeExports));
	return nodeExports;
}

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return srcExports;
	hasRequiredSrc = 1;
	(function (module) {
		if (typeof process !== 'undefined' && process.type === 'renderer') {
		  module.exports = requireBrowser();
		} else {
		  module.exports = requireNode();
		}
} (src));
	return srcExports;
}

/*!
 * on-headers
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

var onHeaders_1;
var hasRequiredOnHeaders;

function requireOnHeaders () {
	if (hasRequiredOnHeaders) return onHeaders_1;
	hasRequiredOnHeaders = 1;

	/**
	 * Module exports.
	 * @public
	 */

	onHeaders_1 = onHeaders;

	/**
	 * Create a replacement writeHead method.
	 *
	 * @param {function} prevWriteHead
	 * @param {function} listener
	 * @private
	 */

	function createWriteHead (prevWriteHead, listener) {
	  var fired = false;

	  // return function with core name and argument list
	  return function writeHead (statusCode) {
	    // set headers from arguments
	    var args = setWriteHeadHeaders.apply(this, arguments);

	    // fire listener
	    if (!fired) {
	      fired = true;
	      listener.call(this);

	      // pass-along an updated status code
	      if (typeof args[0] === 'number' && this.statusCode !== args[0]) {
	        args[0] = this.statusCode;
	        args.length = 1;
	      }
	    }

	    return prevWriteHead.apply(this, args)
	  }
	}

	/**
	 * Execute a listener when a response is about to write headers.
	 *
	 * @param {object} res
	 * @return {function} listener
	 * @public
	 */

	function onHeaders (res, listener) {
	  if (!res) {
	    throw new TypeError('argument res is required')
	  }

	  if (typeof listener !== 'function') {
	    throw new TypeError('argument listener must be a function')
	  }

	  res.writeHead = createWriteHead(res.writeHead, listener);
	}

	/**
	 * Set headers contained in array on the response object.
	 *
	 * @param {object} res
	 * @param {array} headers
	 * @private
	 */

	function setHeadersFromArray (res, headers) {
	  for (var i = 0; i < headers.length; i++) {
	    res.setHeader(headers[i][0], headers[i][1]);
	  }
	}

	/**
	 * Set headers contained in object on the response object.
	 *
	 * @param {object} res
	 * @param {object} headers
	 * @private
	 */

	function setHeadersFromObject (res, headers) {
	  var keys = Object.keys(headers);
	  for (var i = 0; i < keys.length; i++) {
	    var k = keys[i];
	    if (k) res.setHeader(k, headers[k]);
	  }
	}

	/**
	 * Set headers and other properties on the response object.
	 *
	 * @param {number} statusCode
	 * @private
	 */

	function setWriteHeadHeaders (statusCode) {
	  var length = arguments.length;
	  var headerIndex = length > 1 && typeof arguments[1] === 'string'
	    ? 2
	    : 1;

	  var headers = length >= headerIndex + 1
	    ? arguments[headerIndex]
	    : undefined;

	  this.statusCode = statusCode;

	  if (Array.isArray(headers)) {
	    // handle array case
	    setHeadersFromArray(this, headers);
	  } else if (headers) {
	    // handle object case
	    setHeadersFromObject(this, headers);
	  }

	  // copy leading arguments
	  var args = new Array(Math.min(length, headerIndex));
	  for (var i = 0; i < args.length; i++) {
	    args[i] = arguments[i];
	  }

	  return args
	}
	return onHeaders_1;
}

var varyExports = {};
var vary = {
  get exports(){ return varyExports; },
  set exports(v){ varyExports = v; },
};

/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredVary;

function requireVary () {
	if (hasRequiredVary) return varyExports;
	hasRequiredVary = 1;

	/**
	 * Module exports.
	 */

	vary.exports = vary$1;
	varyExports.append = append;

	/**
	 * RegExp to match field-name in RFC 7230 sec 3.2
	 *
	 * field-name    = token
	 * token         = 1*tchar
	 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
	 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
	 *               / DIGIT / ALPHA
	 *               ; any VCHAR, except delimiters
	 */

	var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

	/**
	 * Append a field to a vary header.
	 *
	 * @param {String} header
	 * @param {String|Array} field
	 * @return {String}
	 * @public
	 */

	function append (header, field) {
	  if (typeof header !== 'string') {
	    throw new TypeError('header argument is required')
	  }

	  if (!field) {
	    throw new TypeError('field argument is required')
	  }

	  // get fields array
	  var fields = !Array.isArray(field)
	    ? parse(String(field))
	    : field;

	  // assert on invalid field names
	  for (var j = 0; j < fields.length; j++) {
	    if (!FIELD_NAME_REGEXP.test(fields[j])) {
	      throw new TypeError('field argument contains an invalid header name')
	    }
	  }

	  // existing, unspecified vary
	  if (header === '*') {
	    return header
	  }

	  // enumerate current values
	  var val = header;
	  var vals = parse(header.toLowerCase());

	  // unspecified vary
	  if (fields.indexOf('*') !== -1 || vals.indexOf('*') !== -1) {
	    return '*'
	  }

	  for (var i = 0; i < fields.length; i++) {
	    var fld = fields[i].toLowerCase();

	    // append value (case-preserving)
	    if (vals.indexOf(fld) === -1) {
	      vals.push(fld);
	      val = val
	        ? val + ', ' + fields[i]
	        : fields[i];
	    }
	  }

	  return val
	}

	/**
	 * Parse a vary header into an array.
	 *
	 * @param {String} header
	 * @return {Array}
	 * @private
	 */

	function parse (header) {
	  var end = 0;
	  var list = [];
	  var start = 0;

	  // gather tokens
	  for (var i = 0, len = header.length; i < len; i++) {
	    switch (header.charCodeAt(i)) {
	      case 0x20: /*   */
	        if (start === end) {
	          start = end = i + 1;
	        }
	        break
	      case 0x2c: /* , */
	        list.push(header.substring(start, end));
	        start = end = i + 1;
	        break
	      default:
	        end = i + 1;
	        break
	    }
	  }

	  // final token
	  list.push(header.substring(start, end));

	  return list
	}

	/**
	 * Mark that a request is varied on a header field.
	 *
	 * @param {Object} res
	 * @param {String|Array} field
	 * @public
	 */

	function vary$1 (res, field) {
	  if (!res || !res.getHeader || !res.setHeader) {
	    // quack quack
	    throw new TypeError('res argument is required')
	  }

	  // get existing header
	  var val = res.getHeader('Vary') || '';
	  var header = Array.isArray(val)
	    ? val.join(', ')
	    : String(val);

	  // set new header
	  if ((val = append(header, field))) {
	    res.setHeader('Vary', val);
	  }
	}
	return varyExports;
}

/*!
 * compression
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredCompression;

function requireCompression () {
	if (hasRequiredCompression) return compressionExports$1;
	hasRequiredCompression = 1;

	/**
	 * Module dependencies.
	 * @private
	 */

	var accepts = requireAccepts();
	var Buffer = requireSafeBuffer().Buffer;
	var bytes = requireBytes();
	var compressible = requireCompressible();
	var debug = requireSrc()('compression');
	var onHeaders = requireOnHeaders();
	var vary = requireVary();
	var zlib = require$$7;

	/**
	 * Module exports.
	 */

	compression$1.exports = compression;
	compressionExports$1.filter = shouldCompress;

	/**
	 * Module variables.
	 * @private
	 */

	var cacheControlNoTransformRegExp = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;

	/**
	 * Compress response data with gzip / deflate.
	 *
	 * @param {Object} [options]
	 * @return {Function} middleware
	 * @public
	 */

	function compression (options) {
	  var opts = options || {};

	  // options
	  var filter = opts.filter || shouldCompress;
	  var threshold = bytes.parse(opts.threshold);

	  if (threshold == null) {
	    threshold = 1024;
	  }

	  return function compression (req, res, next) {
	    var ended = false;
	    var length;
	    var listeners = [];
	    var stream;

	    var _end = res.end;
	    var _on = res.on;
	    var _write = res.write;

	    // flush
	    res.flush = function flush () {
	      if (stream) {
	        stream.flush();
	      }
	    };

	    // proxy

	    res.write = function write (chunk, encoding) {
	      if (ended) {
	        return false
	      }

	      if (!this._header) {
	        this._implicitHeader();
	      }

	      return stream
	        ? stream.write(toBuffer(chunk, encoding))
	        : _write.call(this, chunk, encoding)
	    };

	    res.end = function end (chunk, encoding) {
	      if (ended) {
	        return false
	      }

	      if (!this._header) {
	        // estimate the length
	        if (!this.getHeader('Content-Length')) {
	          length = chunkLength(chunk, encoding);
	        }

	        this._implicitHeader();
	      }

	      if (!stream) {
	        return _end.call(this, chunk, encoding)
	      }

	      // mark ended
	      ended = true;

	      // write Buffer for Node.js 0.8
	      return chunk
	        ? stream.end(toBuffer(chunk, encoding))
	        : stream.end()
	    };

	    res.on = function on (type, listener) {
	      if (!listeners || type !== 'drain') {
	        return _on.call(this, type, listener)
	      }

	      if (stream) {
	        return stream.on(type, listener)
	      }

	      // buffer listeners for future stream
	      listeners.push([type, listener]);

	      return this
	    };

	    function nocompress (msg) {
	      debug('no compression: %s', msg);
	      addListeners(res, _on, listeners);
	      listeners = null;
	    }

	    onHeaders(res, function onResponseHeaders () {
	      // determine if request is filtered
	      if (!filter(req, res)) {
	        nocompress('filtered');
	        return
	      }

	      // determine if the entity should be transformed
	      if (!shouldTransform(req, res)) {
	        nocompress('no transform');
	        return
	      }

	      // vary
	      vary(res, 'Accept-Encoding');

	      // content-length below threshold
	      if (Number(res.getHeader('Content-Length')) < threshold || length < threshold) {
	        nocompress('size below threshold');
	        return
	      }

	      var encoding = res.getHeader('Content-Encoding') || 'identity';

	      // already encoded
	      if (encoding !== 'identity') {
	        nocompress('already encoded');
	        return
	      }

	      // head
	      if (req.method === 'HEAD') {
	        nocompress('HEAD request');
	        return
	      }

	      // compression method
	      var accept = accepts(req);
	      var method = accept.encoding(['gzip', 'deflate', 'identity']);

	      // we really don't prefer deflate
	      if (method === 'deflate' && accept.encoding(['gzip'])) {
	        method = accept.encoding(['gzip', 'identity']);
	      }

	      // negotiation failed
	      if (!method || method === 'identity') {
	        nocompress('not acceptable');
	        return
	      }

	      // compression stream
	      debug('%s compression', method);
	      stream = method === 'gzip'
	        ? zlib.createGzip(opts)
	        : zlib.createDeflate(opts);

	      // add buffered listeners to stream
	      addListeners(stream, stream.on, listeners);

	      // header fields
	      res.setHeader('Content-Encoding', method);
	      res.removeHeader('Content-Length');

	      // compression
	      stream.on('data', function onStreamData (chunk) {
	        if (_write.call(res, chunk) === false) {
	          stream.pause();
	        }
	      });

	      stream.on('end', function onStreamEnd () {
	        _end.call(res);
	      });

	      _on.call(res, 'drain', function onResponseDrain () {
	        stream.resume();
	      });
	    });

	    next();
	  }
	}

	/**
	 * Add bufferred listeners to stream
	 * @private
	 */

	function addListeners (stream, on, listeners) {
	  for (var i = 0; i < listeners.length; i++) {
	    on.apply(stream, listeners[i]);
	  }
	}

	/**
	 * Get the length of a given chunk
	 */

	function chunkLength (chunk, encoding) {
	  if (!chunk) {
	    return 0
	  }

	  return !Buffer.isBuffer(chunk)
	    ? Buffer.byteLength(chunk, encoding)
	    : chunk.length
	}

	/**
	 * Default filter function.
	 * @private
	 */

	function shouldCompress (req, res) {
	  var type = res.getHeader('Content-Type');

	  if (type === undefined || !compressible(type)) {
	    debug('%s not compressible', type);
	    return false
	  }

	  return true
	}

	/**
	 * Determine if the entity should be transformed.
	 * @private
	 */

	function shouldTransform (req, res) {
	  var cacheControl = res.getHeader('Cache-Control');

	  // Don't compress for Cache-Control: no-transform
	  // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
	  return !cacheControl ||
	    !cacheControlNoTransformRegExp.test(cacheControl)
	}

	/**
	 * Coerce arguments to Buffer
	 * @private
	 */

	function toBuffer (chunk, encoding) {
	  return !Buffer.isBuffer(chunk)
	    ? Buffer.from(chunk, encoding)
	    : chunk
	}
	return compressionExports$1;
}

var compressionExports = requireCompression();
var compression = /*@__PURE__*/getDefaultExportFromCjs(compressionExports);

function parse$1 (str, loose) {
	if (str instanceof RegExp) return { keys:false, pattern:str };
	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
	arr[0] || arr.shift();

	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		} else if (c === ':') {
			o = tmp.indexOf('?', 1);
			ext = tmp.indexOf('.', 1);
			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
		} else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys: keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
	};
}

const MAP = {
	"": 0,
	GET: 1,
	HEAD: 2,
	PATCH: 3,
	OPTIONS: 4,
	CONNECT: 5,
	DELETE: 6,
	TRACE: 7,
	POST: 8,
	PUT: 9,
};

class Trouter {
	constructor() {
		this.routes = [];

		this.all = this.add.bind(this, '');
		this.get = this.add.bind(this, 'GET');
		this.head = this.add.bind(this, 'HEAD');
		this.patch = this.add.bind(this, 'PATCH');
		this.options = this.add.bind(this, 'OPTIONS');
		this.connect = this.add.bind(this, 'CONNECT');
		this.delete = this.add.bind(this, 'DELETE');
		this.trace = this.add.bind(this, 'TRACE');
		this.post = this.add.bind(this, 'POST');
		this.put = this.add.bind(this, 'PUT');
	}

	use(route, ...fns) {
		let handlers = [].concat.apply([], fns);
		let { keys, pattern } = parse$1(route, true);
		this.routes.push({ keys, pattern, method: '', handlers, midx: MAP[''] });
		return this;
	}

	add(method, route, ...fns) {
		let { keys, pattern } = parse$1(route);
		let handlers = [].concat.apply([], fns);
		this.routes.push({ keys, pattern, method, handlers, midx: MAP[method] });
		return this;
	}

	find(method, url) {
		let midx = MAP[method];
		let isHEAD = (midx === 2);
		let i=0, j=0, k, tmp, arr=this.routes;
		let matches=[], params={}, handlers=[];
		for (; i < arr.length; i++) {
			tmp = arr[i];
			if (tmp.midx === midx  || tmp.midx === 0 || (isHEAD && tmp.midx===1) ) {
				if (tmp.keys === false) {
					matches = tmp.pattern.exec(url);
					if (matches === null) continue;
					if (matches.groups !== void 0) for (k in matches.groups) params[k]=matches.groups[k];
					tmp.handlers.length > 1 ? (handlers=handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
				} else if (tmp.keys.length > 0) {
					matches = tmp.pattern.exec(url);
					if (matches === null) continue;
					for (j=0; j < tmp.keys.length;) params[tmp.keys[j]]=matches[++j];
					tmp.handlers.length > 1 ? (handlers=handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
				} else if (tmp.pattern.test(url)) {
					tmp.handlers.length > 1 ? (handlers=handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
				}
			} // else not a match
		}

		return { params, handlers };
	}
}

/**
 * @typedef ParsedURL
 * @type {import('.').ParsedURL}
 */

/**
 * @typedef Request
 * @property {string} url
 * @property {ParsedURL} _parsedUrl
 */

/**
 * @param {Request} req
 * @returns {ParsedURL|void}
 */
function parse(req) {
	let raw = req.url;
	if (raw == null) return;

	let prev = req._parsedUrl;
	if (prev && prev.raw === raw) return prev;

	let pathname=raw, search='', query;

	if (raw.length > 1) {
		let idx = raw.indexOf('?', 1);

		if (idx !== -1) {
			search = raw.substring(idx);
			pathname = raw.substring(0, idx);
			if (search.length > 1) {
				query = qs.parse(search.substring(1));
			}
		}
	}

	return req._parsedUrl = { pathname, search, query, raw };
}

function onError$1(err, req, res) {
	let code = typeof err.status === 'number' && err.status;
	code = res.statusCode = (code && code >= 100 ? code : 500);
	if (typeof err === 'string' || Buffer.isBuffer(err)) res.end(err);
	else res.end(err.message || http.STATUS_CODES[code]);
}

const mount = fn => fn instanceof Polka ? fn.attach : fn;

class Polka extends Trouter {
	constructor(opts={}) {
		super();
		this.parse = parse;
		this.server = opts.server;
		this.handler = this.handler.bind(this);
		this.onError = opts.onError || onError$1; // catch-all handler
		this.onNoMatch = opts.onNoMatch || this.onError.bind(null, { status: 404 });
		this.attach = (req, res) => setImmediate(this.handler, req, res);
	}

	use(base, ...fns) {
		if (base === '/') {
			super.use(base, fns.map(mount));
		} else if (typeof base === 'function' || base instanceof Polka) {
			super.use('/', [base, ...fns].map(mount));
		} else {
			super.use(base,
				(req, _, next) => {
					if (typeof base === 'string') {
						let len = base.length;
						base.startsWith('/') || len++;
						req.url = req.url.substring(len) || '/';
						req.path = req.path.substring(len) || '/';
					} else {
						req.url = req.url.replace(base, '') || '/';
						req.path = req.path.replace(base, '') || '/';
					}
					if (req.url.charAt(0) !== '/') {
						req.url = '/' + req.url;
					}
					next();
				},
				fns.map(mount),
				(req, _, next) => {
					req.path = req._parsedUrl.pathname;
					req.url = req.path + req._parsedUrl.search;
					next();
				}
			);
		}
		return this; // chainable
	}

	listen() {
		(this.server = this.server || http.createServer()).on('request', this.attach);
		this.server.listen.apply(this.server, arguments);
		return this;
	}

	handler(req, res, next) {
		let info = this.parse(req), path = info.pathname;
		let obj = this.find(req.method, req.path=path);

		req.url = path + info.search;
		req.originalUrl = req.originalUrl || req.url;
		req.query = info.query || {};
		req.search = info.search;
		req.params = obj.params;

		if (path.length > 1 && path.indexOf('%', 1) !== -1) {
			for (let k in req.params) {
				try { req.params[k] = decodeURIComponent(req.params[k]); }
				catch (e) { /* malform uri segment */ }
			}
		}

		let i=0, arr=obj.handlers.concat(this.onNoMatch), len=arr.length;
		let loop = async () => res.finished || (i < len) && arr[i++](req, res, next);
		(next = next || (err => err ? this.onError(err, req, res, next) : loop().catch(next)))(); // init
	}
}

function polka (opts) {
	return new Polka(opts);
}

function totalist(dir, callback, pre='') {
	dir = resolve('.', dir);
	let arr = readdirSync(dir);
	let i=0, abs, stats;
	for (; i < arr.length; i++) {
		abs = join(dir, arr[i]);
		stats = statSync(abs);
		stats.isDirectory()
			? totalist(abs, callback, join(pre, arr[i]))
			: callback(join(pre, arr[i]), abs, stats);
	}
}

const mimes = {
  "ez": "application/andrew-inset",
  "aw": "application/applixware",
  "atom": "application/atom+xml",
  "atomcat": "application/atomcat+xml",
  "atomdeleted": "application/atomdeleted+xml",
  "atomsvc": "application/atomsvc+xml",
  "dwd": "application/atsc-dwd+xml",
  "held": "application/atsc-held+xml",
  "rsat": "application/atsc-rsat+xml",
  "bdoc": "application/bdoc",
  "xcs": "application/calendar+xml",
  "ccxml": "application/ccxml+xml",
  "cdfx": "application/cdfx+xml",
  "cdmia": "application/cdmi-capability",
  "cdmic": "application/cdmi-container",
  "cdmid": "application/cdmi-domain",
  "cdmio": "application/cdmi-object",
  "cdmiq": "application/cdmi-queue",
  "cu": "application/cu-seeme",
  "mpd": "application/dash+xml",
  "davmount": "application/davmount+xml",
  "dbk": "application/docbook+xml",
  "dssc": "application/dssc+der",
  "xdssc": "application/dssc+xml",
  "es": "application/ecmascript",
  "ecma": "application/ecmascript",
  "emma": "application/emma+xml",
  "emotionml": "application/emotionml+xml",
  "epub": "application/epub+zip",
  "exi": "application/exi",
  "fdt": "application/fdt+xml",
  "pfr": "application/font-tdpfr",
  "geojson": "application/geo+json",
  "gml": "application/gml+xml",
  "gpx": "application/gpx+xml",
  "gxf": "application/gxf",
  "gz": "application/gzip",
  "hjson": "application/hjson",
  "stk": "application/hyperstudio",
  "ink": "application/inkml+xml",
  "inkml": "application/inkml+xml",
  "ipfix": "application/ipfix",
  "its": "application/its+xml",
  "jar": "application/java-archive",
  "war": "application/java-archive",
  "ear": "application/java-archive",
  "ser": "application/java-serialized-object",
  "class": "application/java-vm",
  "js": "application/javascript",
  "mjs": "application/javascript",
  "json": "application/json",
  "map": "application/json",
  "json5": "application/json5",
  "jsonml": "application/jsonml+json",
  "jsonld": "application/ld+json",
  "lgr": "application/lgr+xml",
  "lostxml": "application/lost+xml",
  "hqx": "application/mac-binhex40",
  "cpt": "application/mac-compactpro",
  "mads": "application/mads+xml",
  "webmanifest": "application/manifest+json",
  "mrc": "application/marc",
  "mrcx": "application/marcxml+xml",
  "ma": "application/mathematica",
  "nb": "application/mathematica",
  "mb": "application/mathematica",
  "mathml": "application/mathml+xml",
  "mbox": "application/mbox",
  "mscml": "application/mediaservercontrol+xml",
  "metalink": "application/metalink+xml",
  "meta4": "application/metalink4+xml",
  "mets": "application/mets+xml",
  "maei": "application/mmt-aei+xml",
  "musd": "application/mmt-usd+xml",
  "mods": "application/mods+xml",
  "m21": "application/mp21",
  "mp21": "application/mp21",
  "mp4s": "application/mp4",
  "m4p": "application/mp4",
  "doc": "application/msword",
  "dot": "application/msword",
  "mxf": "application/mxf",
  "nq": "application/n-quads",
  "nt": "application/n-triples",
  "cjs": "application/node",
  "bin": "application/octet-stream",
  "dms": "application/octet-stream",
  "lrf": "application/octet-stream",
  "mar": "application/octet-stream",
  "so": "application/octet-stream",
  "dist": "application/octet-stream",
  "distz": "application/octet-stream",
  "pkg": "application/octet-stream",
  "bpk": "application/octet-stream",
  "dump": "application/octet-stream",
  "elc": "application/octet-stream",
  "deploy": "application/octet-stream",
  "exe": "application/octet-stream",
  "dll": "application/octet-stream",
  "deb": "application/octet-stream",
  "dmg": "application/octet-stream",
  "iso": "application/octet-stream",
  "img": "application/octet-stream",
  "msi": "application/octet-stream",
  "msp": "application/octet-stream",
  "msm": "application/octet-stream",
  "buffer": "application/octet-stream",
  "oda": "application/oda",
  "opf": "application/oebps-package+xml",
  "ogx": "application/ogg",
  "omdoc": "application/omdoc+xml",
  "onetoc": "application/onenote",
  "onetoc2": "application/onenote",
  "onetmp": "application/onenote",
  "onepkg": "application/onenote",
  "oxps": "application/oxps",
  "relo": "application/p2p-overlay+xml",
  "xer": "application/patch-ops-error+xml",
  "pdf": "application/pdf",
  "pgp": "application/pgp-encrypted",
  "asc": "application/pgp-signature",
  "sig": "application/pgp-signature",
  "prf": "application/pics-rules",
  "p10": "application/pkcs10",
  "p7m": "application/pkcs7-mime",
  "p7c": "application/pkcs7-mime",
  "p7s": "application/pkcs7-signature",
  "p8": "application/pkcs8",
  "ac": "application/pkix-attr-cert",
  "cer": "application/pkix-cert",
  "crl": "application/pkix-crl",
  "pkipath": "application/pkix-pkipath",
  "pki": "application/pkixcmp",
  "pls": "application/pls+xml",
  "ai": "application/postscript",
  "eps": "application/postscript",
  "ps": "application/postscript",
  "provx": "application/provenance+xml",
  "cww": "application/prs.cww",
  "pskcxml": "application/pskc+xml",
  "raml": "application/raml+yaml",
  "rdf": "application/rdf+xml",
  "owl": "application/rdf+xml",
  "rif": "application/reginfo+xml",
  "rnc": "application/relax-ng-compact-syntax",
  "rl": "application/resource-lists+xml",
  "rld": "application/resource-lists-diff+xml",
  "rs": "application/rls-services+xml",
  "rapd": "application/route-apd+xml",
  "sls": "application/route-s-tsid+xml",
  "rusd": "application/route-usd+xml",
  "gbr": "application/rpki-ghostbusters",
  "mft": "application/rpki-manifest",
  "roa": "application/rpki-roa",
  "rsd": "application/rsd+xml",
  "rss": "application/rss+xml",
  "rtf": "application/rtf",
  "sbml": "application/sbml+xml",
  "scq": "application/scvp-cv-request",
  "scs": "application/scvp-cv-response",
  "spq": "application/scvp-vp-request",
  "spp": "application/scvp-vp-response",
  "sdp": "application/sdp",
  "senmlx": "application/senml+xml",
  "sensmlx": "application/sensml+xml",
  "setpay": "application/set-payment-initiation",
  "setreg": "application/set-registration-initiation",
  "shf": "application/shf+xml",
  "siv": "application/sieve",
  "sieve": "application/sieve",
  "smi": "application/smil+xml",
  "smil": "application/smil+xml",
  "rq": "application/sparql-query",
  "srx": "application/sparql-results+xml",
  "gram": "application/srgs",
  "grxml": "application/srgs+xml",
  "sru": "application/sru+xml",
  "ssdl": "application/ssdl+xml",
  "ssml": "application/ssml+xml",
  "swidtag": "application/swid+xml",
  "tei": "application/tei+xml",
  "teicorpus": "application/tei+xml",
  "tfi": "application/thraud+xml",
  "tsd": "application/timestamped-data",
  "toml": "application/toml",
  "trig": "application/trig",
  "ttml": "application/ttml+xml",
  "ubj": "application/ubjson",
  "rsheet": "application/urc-ressheet+xml",
  "td": "application/urc-targetdesc+xml",
  "vxml": "application/voicexml+xml",
  "wasm": "application/wasm",
  "wgt": "application/widget",
  "hlp": "application/winhlp",
  "wsdl": "application/wsdl+xml",
  "wspolicy": "application/wspolicy+xml",
  "xaml": "application/xaml+xml",
  "xav": "application/xcap-att+xml",
  "xca": "application/xcap-caps+xml",
  "xdf": "application/xcap-diff+xml",
  "xel": "application/xcap-el+xml",
  "xns": "application/xcap-ns+xml",
  "xenc": "application/xenc+xml",
  "xhtml": "application/xhtml+xml",
  "xht": "application/xhtml+xml",
  "xlf": "application/xliff+xml",
  "xml": "application/xml",
  "xsl": "application/xml",
  "xsd": "application/xml",
  "rng": "application/xml",
  "dtd": "application/xml-dtd",
  "xop": "application/xop+xml",
  "xpl": "application/xproc+xml",
  "xslt": "application/xml",
  "xspf": "application/xspf+xml",
  "mxml": "application/xv+xml",
  "xhvml": "application/xv+xml",
  "xvml": "application/xv+xml",
  "xvm": "application/xv+xml",
  "yang": "application/yang",
  "yin": "application/yin+xml",
  "zip": "application/zip",
  "3gpp": "video/3gpp",
  "adp": "audio/adpcm",
  "amr": "audio/amr",
  "au": "audio/basic",
  "snd": "audio/basic",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "kar": "audio/midi",
  "rmi": "audio/midi",
  "mxmf": "audio/mobile-xmf",
  "mp3": "audio/mpeg",
  "m4a": "audio/mp4",
  "mp4a": "audio/mp4",
  "mpga": "audio/mpeg",
  "mp2": "audio/mpeg",
  "mp2a": "audio/mpeg",
  "m2a": "audio/mpeg",
  "m3a": "audio/mpeg",
  "oga": "audio/ogg",
  "ogg": "audio/ogg",
  "spx": "audio/ogg",
  "opus": "audio/ogg",
  "s3m": "audio/s3m",
  "sil": "audio/silk",
  "wav": "audio/wav",
  "weba": "audio/webm",
  "xm": "audio/xm",
  "ttc": "font/collection",
  "otf": "font/otf",
  "ttf": "font/ttf",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "exr": "image/aces",
  "apng": "image/apng",
  "avif": "image/avif",
  "bmp": "image/bmp",
  "cgm": "image/cgm",
  "drle": "image/dicom-rle",
  "emf": "image/emf",
  "fits": "image/fits",
  "g3": "image/g3fax",
  "gif": "image/gif",
  "heic": "image/heic",
  "heics": "image/heic-sequence",
  "heif": "image/heif",
  "heifs": "image/heif-sequence",
  "hej2": "image/hej2k",
  "hsj2": "image/hsj2",
  "ief": "image/ief",
  "jls": "image/jls",
  "jp2": "image/jp2",
  "jpg2": "image/jp2",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "jpe": "image/jpeg",
  "jph": "image/jph",
  "jhc": "image/jphc",
  "jpm": "image/jpm",
  "jpx": "image/jpx",
  "jpf": "image/jpx",
  "jxr": "image/jxr",
  "jxra": "image/jxra",
  "jxrs": "image/jxrs",
  "jxs": "image/jxs",
  "jxsc": "image/jxsc",
  "jxsi": "image/jxsi",
  "jxss": "image/jxss",
  "ktx": "image/ktx",
  "ktx2": "image/ktx2",
  "png": "image/png",
  "btif": "image/prs.btif",
  "pti": "image/prs.pti",
  "sgi": "image/sgi",
  "svg": "image/svg+xml",
  "svgz": "image/svg+xml",
  "t38": "image/t38",
  "tif": "image/tiff",
  "tiff": "image/tiff",
  "tfx": "image/tiff-fx",
  "webp": "image/webp",
  "wmf": "image/wmf",
  "disposition-notification": "message/disposition-notification",
  "u8msg": "message/global",
  "u8dsn": "message/global-delivery-status",
  "u8mdn": "message/global-disposition-notification",
  "u8hdr": "message/global-headers",
  "eml": "message/rfc822",
  "mime": "message/rfc822",
  "3mf": "model/3mf",
  "gltf": "model/gltf+json",
  "glb": "model/gltf-binary",
  "igs": "model/iges",
  "iges": "model/iges",
  "msh": "model/mesh",
  "mesh": "model/mesh",
  "silo": "model/mesh",
  "mtl": "model/mtl",
  "obj": "model/obj",
  "stpz": "model/step+zip",
  "stpxz": "model/step-xml+zip",
  "stl": "model/stl",
  "wrl": "model/vrml",
  "vrml": "model/vrml",
  "x3db": "model/x3d+fastinfoset",
  "x3dbz": "model/x3d+binary",
  "x3dv": "model/x3d-vrml",
  "x3dvz": "model/x3d+vrml",
  "x3d": "model/x3d+xml",
  "x3dz": "model/x3d+xml",
  "appcache": "text/cache-manifest",
  "manifest": "text/cache-manifest",
  "ics": "text/calendar",
  "ifb": "text/calendar",
  "coffee": "text/coffeescript",
  "litcoffee": "text/coffeescript",
  "css": "text/css",
  "csv": "text/csv",
  "html": "text/html",
  "htm": "text/html",
  "shtml": "text/html",
  "jade": "text/jade",
  "jsx": "text/jsx",
  "less": "text/less",
  "markdown": "text/markdown",
  "md": "text/markdown",
  "mml": "text/mathml",
  "mdx": "text/mdx",
  "n3": "text/n3",
  "txt": "text/plain",
  "text": "text/plain",
  "conf": "text/plain",
  "def": "text/plain",
  "list": "text/plain",
  "log": "text/plain",
  "in": "text/plain",
  "ini": "text/plain",
  "dsc": "text/prs.lines.tag",
  "rtx": "text/richtext",
  "sgml": "text/sgml",
  "sgm": "text/sgml",
  "shex": "text/shex",
  "slim": "text/slim",
  "slm": "text/slim",
  "spdx": "text/spdx",
  "stylus": "text/stylus",
  "styl": "text/stylus",
  "tsv": "text/tab-separated-values",
  "t": "text/troff",
  "tr": "text/troff",
  "roff": "text/troff",
  "man": "text/troff",
  "me": "text/troff",
  "ms": "text/troff",
  "ttl": "text/turtle",
  "uri": "text/uri-list",
  "uris": "text/uri-list",
  "urls": "text/uri-list",
  "vcard": "text/vcard",
  "vtt": "text/vtt",
  "yaml": "text/yaml",
  "yml": "text/yaml",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  "h261": "video/h261",
  "h263": "video/h263",
  "h264": "video/h264",
  "m4s": "video/iso.segment",
  "jpgv": "video/jpeg",
  "jpgm": "image/jpm",
  "mj2": "video/mj2",
  "mjp2": "video/mj2",
  "ts": "video/mp2t",
  "mp4": "video/mp4",
  "mp4v": "video/mp4",
  "mpg4": "video/mp4",
  "mpeg": "video/mpeg",
  "mpg": "video/mpeg",
  "mpe": "video/mpeg",
  "m1v": "video/mpeg",
  "m2v": "video/mpeg",
  "ogv": "video/ogg",
  "qt": "video/quicktime",
  "mov": "video/quicktime",
  "webm": "video/webm"
};

function lookup$1(extn) {
	let tmp = ('' + extn).trim().toLowerCase();
	let idx = tmp.lastIndexOf('.');
	return mimes[!~idx ? tmp : tmp.substring(++idx)];
}

const noop = () => {};

function isMatch(uri, arr) {
	for (let i=0; i < arr.length; i++) {
		if (arr[i].test(uri)) return true;
	}
}

function toAssume(uri, extns) {
	let i=0, x, len=uri.length - 1;
	if (uri.charCodeAt(len) === 47) {
		uri = uri.substring(0, len);
	}

	let arr=[], tmp=`${uri}/index`;
	for (; i < extns.length; i++) {
		x = extns[i] ? `.${extns[i]}` : '';
		if (uri) arr.push(uri + x);
		arr.push(tmp + x);
	}

	return arr;
}

function viaCache(cache, uri, extns) {
	let i=0, data, arr=toAssume(uri, extns);
	for (; i < arr.length; i++) {
		if (data = cache[arr[i]]) return data;
	}
}

function viaLocal(dir, isEtag, uri, extns) {
	let i=0, arr=toAssume(uri, extns);
	let abs, stats, name, headers;
	for (; i < arr.length; i++) {
		abs = normalize(join(dir, name=arr[i]));
		if (abs.startsWith(dir) && fs.existsSync(abs)) {
			stats = fs.statSync(abs);
			if (stats.isDirectory()) continue;
			headers = toHeaders(name, stats, isEtag);
			headers['Cache-Control'] = isEtag ? 'no-cache' : 'no-store';
			return { abs, stats, headers };
		}
	}
}

function is404(req, res) {
	return (res.statusCode=404,res.end());
}

function send(req, res, file, stats, headers) {
	let code=200, tmp, opts={};
	headers = { ...headers };

	for (let key in headers) {
		tmp = res.getHeader(key);
		if (tmp) headers[key] = tmp;
	}

	if (tmp = res.getHeader('content-type')) {
		headers['Content-Type'] = tmp;
	}

	if (req.headers.range) {
		code = 206;
		let [x, y] = req.headers.range.replace('bytes=', '').split('-');
		let end = opts.end = parseInt(y, 10) || stats.size - 1;
		let start = opts.start = parseInt(x, 10) || 0;

		if (start >= stats.size || end >= stats.size) {
			res.setHeader('Content-Range', `bytes */${stats.size}`);
			res.statusCode = 416;
			return res.end();
		}

		headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
		headers['Content-Length'] = (end - start + 1);
		headers['Accept-Ranges'] = 'bytes';
	}

	res.writeHead(code, headers);
	fs.createReadStream(file, opts).pipe(res);
}

const ENCODING = {
	'.br': 'br',
	'.gz': 'gzip',
};

function toHeaders(name, stats, isEtag) {
	let enc = ENCODING[name.slice(-3)];

	let ctype = lookup$1(name.slice(0, enc && -3)) || '';
	if (ctype === 'text/html') ctype += ';charset=utf-8';

	let headers = {
		'Content-Length': stats.size,
		'Content-Type': ctype,
		'Last-Modified': stats.mtime.toUTCString(),
	};

	if (enc) headers['Content-Encoding'] = enc;
	if (isEtag) headers['ETag'] = `W/"${stats.size}-${stats.mtime.getTime()}"`;

	return headers;
}

function sirv (dir, opts={}) {
	dir = resolve(dir || '.');

	let isNotFound = opts.onNoMatch || is404;
	let setHeaders = opts.setHeaders || noop;

	let extensions = opts.extensions || ['html', 'htm'];
	let gzips = opts.gzip && extensions.map(x => `${x}.gz`).concat('gz');
	let brots = opts.brotli && extensions.map(x => `${x}.br`).concat('br');

	const FILES = {};

	let fallback = '/';
	let isEtag = !!opts.etag;
	let isSPA = !!opts.single;
	if (typeof opts.single === 'string') {
		let idx = opts.single.lastIndexOf('.');
		fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
	}

	let ignores = [];
	if (opts.ignores !== false) {
		ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/); // any extn
		if (opts.dotfiles) ignores.push(/\/\.\w/);
		else ignores.push(/\/\.well-known/);
		[].concat(opts.ignores || []).forEach(x => {
			ignores.push(new RegExp(x, 'i'));
		});
	}

	let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
	if (cc && opts.immutable) cc += ',immutable';
	else if (cc && opts.maxAge === 0) cc += ',must-revalidate';

	if (!opts.dev) {
		totalist(dir, (name, abs, stats) => {
			if (/\.well-known[\\+\/]/.test(name)) ; // keep
			else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name)) return;

			let headers = toHeaders(name, stats, isEtag);
			if (cc) headers['Cache-Control'] = cc;

			FILES['/' + name.normalize().replace(/\\+/g, '/')] = { abs, stats, headers };
		});
	}

	let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);

	return function (req, res, next) {
		let extns = [''];
		let pathname = parse(req).pathname;
		let val = req.headers['accept-encoding'] || '';
		if (gzips && val.includes('gzip')) extns.unshift(...gzips);
		if (brots && /(br|brotli)/i.test(val)) extns.unshift(...brots);
		extns.push(...extensions); // [...br, ...gz, orig, ...exts]

		if (pathname.indexOf('%') !== -1) {
			try { pathname = decodeURIComponent(pathname); }
			catch (err) { /* malform uri */ }
		}

		let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
		if (!data) return next ? next() : isNotFound(req, res);

		if (isEtag && req.headers['if-none-match'] === data.headers['ETag']) {
			res.writeHead(304);
			return res.end();
		}

		if (gzips || brots) {
			res.setHeader('Vary', 'Accept-Encoding');
		}

		setHeaders(res, pathname, data.stats);
		send(req, res, data.abs, data.stats, data.headers);
	};
}

var multipart$1 = {};

var hasRequiredMultipart;

function requireMultipart () {
	if (hasRequiredMultipart) return multipart$1;
	hasRequiredMultipart = 1;
	/**
	 * Multipart Parser (Finite State Machine)
	 * usage:
	 * const multipart = require('./multipart.js');
	 * const body = multipart.DemoData(); 							   // raw body
	 * const body = Buffer.from(event['body-json'].toString(),'base64'); // AWS case
	 * const boundary = multipart.getBoundary(event.params.header['content-type']);
	 * const parts = multipart.Parse(body,boundary);
	 * each part is:
	 * { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
	 *  or { name: 'key', data: <Buffer 41 41 41 41 42 42 42 42> }
	 */
	Object.defineProperty(multipart$1, "__esModule", { value: true });
	multipart$1.DemoData = multipart$1.getBoundary = multipart$1.parse = void 0;
	var ParsingState;
	(function (ParsingState) {
	    ParsingState[ParsingState["INIT"] = 0] = "INIT";
	    ParsingState[ParsingState["READING_HEADERS"] = 1] = "READING_HEADERS";
	    ParsingState[ParsingState["READING_DATA"] = 2] = "READING_DATA";
	    ParsingState[ParsingState["READING_PART_SEPARATOR"] = 3] = "READING_PART_SEPARATOR";
	})(ParsingState || (ParsingState = {}));
	function parse(multipartBodyBuffer, boundary) {
	    var lastline = '';
	    var contentDispositionHeader = '';
	    var contentTypeHeader = '';
	    var state = ParsingState.INIT;
	    var buffer = [];
	    var allParts = [];
	    var currentPartHeaders = [];
	    for (var i = 0; i < multipartBodyBuffer.length; i++) {
	        var oneByte = multipartBodyBuffer[i];
	        var prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
	        // 0x0a => \n
	        // 0x0d => \r
	        var newLineDetected = oneByte === 0x0a && prevByte === 0x0d;
	        var newLineChar = oneByte === 0x0a || oneByte === 0x0d;
	        if (!newLineChar)
	            lastline += String.fromCharCode(oneByte);
	        if (ParsingState.INIT === state && newLineDetected) {
	            // searching for boundary
	            if ('--' + boundary === lastline) {
	                state = ParsingState.READING_HEADERS; // found boundary. start reading headers
	            }
	            lastline = '';
	        }
	        else if (ParsingState.READING_HEADERS === state && newLineDetected) {
	            // parsing headers. Headers are separated by an empty line from the content. Stop reading headers when the line is empty
	            if (lastline.length) {
	                currentPartHeaders.push(lastline);
	            }
	            else {
	                // found empty line. search for the headers we want and set the values
	                for (var _i = 0, currentPartHeaders_1 = currentPartHeaders; _i < currentPartHeaders_1.length; _i++) {
	                    var h = currentPartHeaders_1[_i];
	                    if (h.toLowerCase().startsWith('content-disposition:')) {
	                        contentDispositionHeader = h;
	                    }
	                    else if (h.toLowerCase().startsWith('content-type:')) {
	                        contentTypeHeader = h;
	                    }
	                }
	                state = ParsingState.READING_DATA;
	                buffer = [];
	            }
	            lastline = '';
	        }
	        else if (ParsingState.READING_DATA === state) {
	            // parsing data
	            if (lastline.length > boundary.length + 4) {
	                lastline = ''; // mem save
	            }
	            if ('--' + boundary === lastline) {
	                var j = buffer.length - lastline.length;
	                var part = buffer.slice(0, j - 1);
	                allParts.push(process({ contentDispositionHeader: contentDispositionHeader, contentTypeHeader: contentTypeHeader, part: part }));
	                buffer = [];
	                currentPartHeaders = [];
	                lastline = '';
	                state = ParsingState.READING_PART_SEPARATOR;
	                contentDispositionHeader = '';
	                contentTypeHeader = '';
	            }
	            else {
	                buffer.push(oneByte);
	            }
	            if (newLineDetected) {
	                lastline = '';
	            }
	        }
	        else if (ParsingState.READING_PART_SEPARATOR === state) {
	            if (newLineDetected) {
	                state = ParsingState.READING_HEADERS;
	            }
	        }
	    }
	    return allParts;
	}
	multipart$1.parse = parse;
	//  read the boundary from the content-type header sent by the http client
	//  this value may be similar to:
	//  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
	function getBoundary(header) {
	    var items = header.split(';');
	    if (items) {
	        for (var i = 0; i < items.length; i++) {
	            var item = new String(items[i]).trim();
	            if (item.indexOf('boundary') >= 0) {
	                var k = item.split('=');
	                return new String(k[1]).trim().replace(/^["']|["']$/g, '');
	            }
	        }
	    }
	    return '';
	}
	multipart$1.getBoundary = getBoundary;
	function DemoData() {
	    var body = 'trash1\r\n';
	    body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
	    body += 'Content-Type: text/plain\r\n';
	    body +=
	        'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"\r\n';
	    body += '\r\n';
	    body += '@11X';
	    body += '111Y\r\n';
	    body += '111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n';
	    body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
	    body += 'Content-Type: text/plain\r\n';
	    body +=
	        'Content-Disposition: form-data; name="uploads[]"; filename="B.txt"\r\n';
	    body += '\r\n';
	    body += '@22X';
	    body += '222Y\r\n';
	    body += '222Z\r222W\n2220\r\n666@\r\n';
	    body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
	    body += 'Content-Disposition: form-data; name="input1"\r\n';
	    body += '\r\n';
	    body += 'value1\r\n';
	    body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp--\r\n';
	    return {
	        body: Buffer.from(body),
	        boundary: '----WebKitFormBoundaryvef1fLxmoUdYZWXp'
	    };
	}
	multipart$1.DemoData = DemoData;
	function process(part) {
	    // will transform this object:
	    // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
	    // info: 'Content-Type: text/plain',
	    // part: 'AAAABBBB' }
	    // into this one:
	    // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
	    var obj = function (str) {
	        var k = str.split('=');
	        var a = k[0].trim();
	        var b = JSON.parse(k[1].trim());
	        var o = {};
	        Object.defineProperty(o, a, {
	            value: b,
	            writable: true,
	            enumerable: true,
	            configurable: true
	        });
	        return o;
	    };
	    var header = part.contentDispositionHeader.split(';');
	    var filenameData = header[2];
	    var input = {};
	    if (filenameData) {
	        input = obj(filenameData);
	        var contentType = part.contentTypeHeader.split(':')[1].trim();
	        Object.defineProperty(input, 'type', {
	            value: contentType,
	            writable: true,
	            enumerable: true,
	            configurable: true
	        });
	    }
	    // always process the name field
	    Object.defineProperty(input, 'name', {
	        value: header[1].split('=')[1].replace(/"/g, ''),
	        writable: true,
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(input, 'data', {
	        value: Buffer.from(part.part),
	        writable: true,
	        enumerable: true,
	        configurable: true
	    });
	    return input;
	}
	
	return multipart$1;
}

var multipartExports = requireMultipart();
var multipart = /*@__PURE__*/getDefaultExportFromCjs(multipartExports);

var setCookieExports$1 = {};
var setCookie = {
  get exports(){ return setCookieExports$1; },
  set exports(v){ setCookieExports$1 = v; },
};

var hasRequiredSetCookie;

function requireSetCookie () {
	if (hasRequiredSetCookie) return setCookieExports$1;
	hasRequiredSetCookie = 1;

	var defaultParseOptions = {
	  decodeValues: true,
	  map: false,
	  silent: false,
	};

	function isNonEmptyString(str) {
	  return typeof str === "string" && !!str.trim();
	}

	function parseString(setCookieValue, options) {
	  var parts = setCookieValue.split(";").filter(isNonEmptyString);

	  var nameValuePairStr = parts.shift();
	  var parsed = parseNameValuePair(nameValuePairStr);
	  var name = parsed.name;
	  var value = parsed.value;

	  options = options
	    ? Object.assign({}, defaultParseOptions, options)
	    : defaultParseOptions;

	  try {
	    value = options.decodeValues ? decodeURIComponent(value) : value; // decode cookie value
	  } catch (e) {
	    console.error(
	      "set-cookie-parser encountered an error while decoding a cookie with value '" +
	        value +
	        "'. Set options.decodeValues to false to disable this feature.",
	      e
	    );
	  }

	  var cookie = {
	    name: name,
	    value: value,
	  };

	  parts.forEach(function (part) {
	    var sides = part.split("=");
	    var key = sides.shift().trimLeft().toLowerCase();
	    var value = sides.join("=");
	    if (key === "expires") {
	      cookie.expires = new Date(value);
	    } else if (key === "max-age") {
	      cookie.maxAge = parseInt(value, 10);
	    } else if (key === "secure") {
	      cookie.secure = true;
	    } else if (key === "httponly") {
	      cookie.httpOnly = true;
	    } else if (key === "samesite") {
	      cookie.sameSite = value;
	    } else {
	      cookie[key] = value;
	    }
	  });

	  return cookie;
	}

	function parseNameValuePair(nameValuePairStr) {
	  // Parses name-value-pair according to rfc6265bis draft

	  var name = "";
	  var value = "";
	  var nameValueArr = nameValuePairStr.split("=");
	  if (nameValueArr.length > 1) {
	    name = nameValueArr.shift();
	    value = nameValueArr.join("="); // everything after the first =, joined by a "=" if there was more than one part
	  } else {
	    value = nameValuePairStr;
	  }

	  return { name: name, value: value };
	}

	function parse(input, options) {
	  options = options
	    ? Object.assign({}, defaultParseOptions, options)
	    : defaultParseOptions;

	  if (!input) {
	    if (!options.map) {
	      return [];
	    } else {
	      return {};
	    }
	  }

	  if (input.headers && input.headers["set-cookie"]) {
	    // fast-path for node.js (which automatically normalizes header names to lower-case
	    input = input.headers["set-cookie"];
	  } else if (input.headers) {
	    // slow-path for other environments - see #25
	    var sch =
	      input.headers[
	        Object.keys(input.headers).find(function (key) {
	          return key.toLowerCase() === "set-cookie";
	        })
	      ];
	    // warn if called on a request-like object with a cookie header rather than a set-cookie header - see #34, 36
	    if (!sch && input.headers.cookie && !options.silent) {
	      console.warn(
	        "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
	      );
	    }
	    input = sch;
	  }
	  if (!Array.isArray(input)) {
	    input = [input];
	  }

	  options = options
	    ? Object.assign({}, defaultParseOptions, options)
	    : defaultParseOptions;

	  if (!options.map) {
	    return input.filter(isNonEmptyString).map(function (str) {
	      return parseString(str, options);
	    });
	  } else {
	    var cookies = {};
	    return input.filter(isNonEmptyString).reduce(function (cookies, str) {
	      var cookie = parseString(str, options);
	      cookies[cookie.name] = cookie;
	      return cookies;
	    }, cookies);
	  }
	}

	/*
	  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
	  that are within a single set-cookie field-value, such as in the Expires portion.

	  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
	  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
	  React Native's fetch does this for *every* header, including set-cookie.

	  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
	  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
	*/
	function splitCookiesString(cookiesString) {
	  if (Array.isArray(cookiesString)) {
	    return cookiesString;
	  }
	  if (typeof cookiesString !== "string") {
	    return [];
	  }

	  var cookiesStrings = [];
	  var pos = 0;
	  var start;
	  var ch;
	  var lastComma;
	  var nextStart;
	  var cookiesSeparatorFound;

	  function skipWhitespace() {
	    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
	      pos += 1;
	    }
	    return pos < cookiesString.length;
	  }

	  function notSpecialChar() {
	    ch = cookiesString.charAt(pos);

	    return ch !== "=" && ch !== ";" && ch !== ",";
	  }

	  while (pos < cookiesString.length) {
	    start = pos;
	    cookiesSeparatorFound = false;

	    while (skipWhitespace()) {
	      ch = cookiesString.charAt(pos);
	      if (ch === ",") {
	        // ',' is a cookie separator if we have later first '=', not ';' or ','
	        lastComma = pos;
	        pos += 1;

	        skipWhitespace();
	        nextStart = pos;

	        while (pos < cookiesString.length && notSpecialChar()) {
	          pos += 1;
	        }

	        // currently special character
	        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
	          // we found cookies separator
	          cookiesSeparatorFound = true;
	          // pos is inside the next cookie, so back up and return it.
	          pos = nextStart;
	          cookiesStrings.push(cookiesString.substring(start, lastComma));
	          start = pos;
	        } else {
	          // in param ',' or param separator ';',
	          // we continue from that comma
	          pos = lastComma + 1;
	        }
	      } else {
	        pos += 1;
	      }
	    }

	    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
	      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
	    }
	  }

	  return cookiesStrings;
	}

	setCookie.exports = parse;
	setCookieExports$1.parse = parse;
	setCookieExports$1.parseString = parseString;
	setCookieExports$1.splitCookiesString = splitCookiesString;
	return setCookieExports$1;
}

var setCookieExports = requireSetCookie();

function nodeToWeb(nodeStream) {
  var destroyed = false;
  var listeners = {};

  function start(controller) {
    listeners["data"] = onData;
    listeners["end"] = onData;
    listeners["end"] = onDestroy;
    listeners["close"] = onDestroy;
    listeners["error"] = onDestroy;
    for (var name in listeners) nodeStream.on(name, listeners[name]);

    nodeStream.pause();

    function onData(chunk) {
      if (destroyed) return;
      controller.enqueue(chunk);
      nodeStream.pause();
    }

    function onDestroy(err) {
      if (destroyed) return;
      destroyed = true;

      for (var name in listeners) nodeStream.removeListener(name, listeners[name]);

      if (err) controller.error(err);
      else controller.close();
    }
  }

  function pull() {
    if (destroyed) return;
    nodeStream.resume();
  }

  function cancel() {
    destroyed = true;

    for (var name in listeners) nodeStream.removeListener(name, listeners[name]);

    nodeStream.push(null);
    nodeStream.pause();
    if (nodeStream.destroy) nodeStream.destroy();
    else if (nodeStream.close) nodeStream.close();
  }

  return new ReadableStream({ start: start, pull: pull, cancel: cancel });
}

function createHeaders(requestHeaders) {
  let headers = new Headers$1();

  for (let [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

class NodeRequest extends Request$1 {
  constructor(input, init) {
    if (init && init.data && init.data.on) {
      init = {
        duplex: "half",
        ...init,
        body: init.data.headers["content-type"]?.includes("x-www")
          ? init.data
          : nodeToWeb(init.data)
      };
    }

    super(input, init);
  }

  // async json() {
  //   return JSON.parse(await this.text());
  // }

  async buffer() {
    return Buffer.from(await super.arrayBuffer());
  }

  // async text() {
  //   return (await this.buffer()).toString();
  // }

  // @ts-ignore
  async formData() {
    if (this.headers.get("content-type") === "application/x-www-form-urlencoded") {
      return await super.formData();
    } else {
      const data = await this.buffer();
      const input = multipart.parse(
        data,
        this.headers.get("content-type").replace("multipart/form-data; boundary=", "")
      );
      const form = new FormData();
      input.forEach(({ name, data, filename, type }) => {
        // file fields have Content-Type set,
        // whereas non-file fields must not
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#multipart-form-data
        const isFile = type !== undefined;
        if (isFile) {
          const value = new File([data], filename, { type });
          form.append(name, value, filename);
        } else {
          const value = data.toString("utf-8");
          form.append(name, value);
        }
      });
      return form;
    }
  }

  // @ts-ignore
  clone() {
    /** @type {BaseNodeRequest & { buffer?: () => Promise<Buffer>; formData?: () => Promise<FormData> }}  */
    let el = super.clone();
    el.buffer = this.buffer.bind(el);
    el.formData = this.formData.bind(el);
    return el;
  }
}

function createRequest(req) {
  let origin = req.headers.origin || `http://${req.headers.host}`;
  let url = new URL(req.url, origin);

  let init = {
    method: req.method,
    headers: createHeaders(req.headers),
    // POST, PUT, & PATCH will be read as body by NodeRequest
    data: req.method.indexOf("P") === 0 ? req : null
  };

  return new NodeRequest(url.href, init);
}

async function handleNodeResponse(webRes, res) {
  res.statusCode = webRes.status;
  res.statusMessage = webRes.statusText;

  for (const [name, value] of webRes.headers) {
    if (name === "set-cookie") {
      res.setHeader(name, setCookieExports.splitCookiesString(value));
    } else res.setHeader(name, value);
  }

  if (webRes.body) {
    const readable = Readable.from(webRes.body);
    readable.pipe(res);
    await once(readable, "end");
  } else {
    res.end();
  }
}

global.onunhandledrejection = (err, promise) => {
  console.error(err);
  console.error(promise);
};

function createServer({ handler, paths, env }) {
  const comp = compression({
    threshold: 0,
    filter: req => {
      return !req.headers["accept"]?.startsWith("text/event-stream");
    }
  });
  const assets_handler = fs__default.existsSync(paths.assets)
    ? sirv(paths.assets, {
        setHeaders: (res, pathname) => {
          const isAsset = pathname.startsWith("/assets/");
          if (isAsset) {
            res.setHeader("cache-control", "public, immutable, max-age=31536000");
          }
        }
      })
    : (_req, _res, next) => next();

  const render = async (req, res) => {
    try {
      env.getStaticHTML = async assetPath => {
        let text = await readFile(join(paths.assets, assetPath + ".html"), "utf8");
        return new Response(text, {
          headers: {
            "content-type": "text/html"
          }
        });
      };

      const webRes = await handler({
        request: createRequest(req),
        clientAddress: req.socket.remoteAddress,
        locals: {},
        env
      });

      handleNodeResponse(webRes, res);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = "Internal Server Error";
      res.end();
    }
  };

  const server = polka().use("/", comp, assets_handler).use(comp, render);

  return server;
}

Object.assign(globalThis, Streams, {
  Request: Request$1,
  Response: Response$1,
  fetch: fetch$1,
  Headers: Headers$1
});

if (globalThis.crypto != crypto.webcrypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

var manifest = {
	"/*404": [
	{
		type: "script",
		href: "/assets/_...404_-d071ecc0.js"
	},
	{
		type: "script",
		href: "/assets/entry-client-65a8a37c.js"
	},
	{
		type: "style",
		href: "/assets/entry-client-8403bf7d.css"
	}
],
	"/": [
	{
		type: "script",
		href: "/assets/index-64bb2982.js"
	},
	{
		type: "script",
		href: "/assets/entry-client-65a8a37c.js"
	},
	{
		type: "style",
		href: "/assets/entry-client-8403bf7d.css"
	}
],
	"entry-client": [
	{
		type: "script",
		href: "/assets/entry-client-65a8a37c.js"
	},
	{
		type: "style",
		href: "/assets/entry-client-8403bf7d.css"
	}
],
	"index.html": [
]
};

const ERROR = Symbol("error");
function castError(err) {
  if (err instanceof Error || typeof err === "string") return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  const fns = lookup(Owner, ERROR);
  if (!fns) throw err;
  for (const f of fns) f(err);
}
const UNOWNED = {
  context: null,
  owner: null,
  owned: null,
  cleanups: null
};
let Owner = null;
function createOwner() {
  const o = {
    owner: Owner,
    context: null,
    owned: null,
    cleanups: null
  };
  if (Owner) {
    if (!Owner.owned) Owner.owned = [o];else Owner.owned.push(o);
  }
  return o;
}
function createRoot(fn, detachedOwner) {
  const owner = Owner,
    root = fn.length === 0 ? UNOWNED : {
      context: null,
      owner: detachedOwner === undefined ? owner : detachedOwner,
      owned: null,
      cleanups: null
    };
  Owner = root;
  let result;
  try {
    result = fn(fn.length === 0 ? () => {} : () => cleanNode(root));
  } catch (err) {
    handleError(err);
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value, options) {
  return [() => value, v => {
    return value = typeof v === "function" ? v(value) : v;
  }];
}
function createComputed(fn, value) {
  Owner = createOwner();
  try {
    fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
const createRenderEffect = createComputed;
function createMemo(fn, value) {
  Owner = createOwner();
  let v;
  try {
    v = fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
  return () => v;
}
function batch(fn) {
  return fn();
}
const untrack = batch;
function on(deps, fn, options = {}) {
  const isArray = Array.isArray(deps);
  const defer = options.defer;
  return () => {
    if (defer) return undefined;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
    } else value = deps();
    return fn(value);
  };
}
function onCleanup(fn) {
  if (Owner) {
    if (!Owner.cleanups) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  }
  return fn;
}
function cleanNode(node) {
  if (node.owned) {
    for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
}
function onError(fn) {
  if (Owner) {
    if (Owner.context === null) Owner.context = {
      [ERROR]: [fn]
    };else if (!Owner.context[ERROR]) Owner.context[ERROR] = [fn];else Owner.context[ERROR].push(fn);
  }
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let ctx;
  return (ctx = lookup(Owner, context.id)) !== undefined ? ctx : context.defaultValue;
}
function getOwner() {
  return Owner;
}
function children(fn) {
  const memo = createMemo(() => resolveChildren(fn()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  Owner = o;
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
  }
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== undefined ? owner.context[key] : lookup(owner.owner, key) : undefined;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        [id]: props.value
      };
      return children(() => props.children);
    });
  };
}

function resolveSSRNode$1(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode$1(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode$1(node());
  return String(node);
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? {
    ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  } : undefined;
}
function createUniqueId() {
  const ctx = sharedConfig.context;
  if (!ctx) throw new Error(`createUniqueId cannot be used under non-hydrating context`);
  return `${ctx.id}${ctx.count++}`;
}
function createComponent(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source);
      for (const key in descriptors) {
        if (key in target) continue;
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let s = sources[i] || {};
              if (typeof s === "function") s = s();
              const v = s[key];
              if (v !== undefined) return v;
            }
          }
        });
      }
    }
  }
  return target;
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
    split = k => {
      const clone = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        if (descriptors[key]) {
          Object.defineProperty(clone, key, descriptors[key]);
          delete descriptors[key];
        }
      }
      return clone;
    };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
}
function ErrorBoundary$1(props) {
  let error,
    res,
    clean,
    sync = true;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  function displayFallback() {
    cleanNode(clean);
    ctx.writeResource(id, error, true);
    setHydrateContext({
      ...ctx,
      count: 0
    });
    const f = props.fallback;
    return typeof f === "function" && f.length ? f(error, () => {}) : f;
  }
  onError(err => {
    error = err;
    !sync && ctx.replace("e" + id, displayFallback);
    sync = true;
  });
  createMemo(() => {
    clean = Owner;
    return res = props.children;
  });
  if (error) return displayFallback();
  sync = false;
  return {
    t: `<!e${id}>${resolveSSRNode$1(res)}<!/e${id}>`
  };
}
const SuspenseContext = createContext();
function suspenseComplete(c) {
  for (const r of c.resources.values()) {
    if (r.loading) return false;
  }
  return true;
}
function startTransition(fn) {
  fn();
}
function Suspense(props) {
  let done;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  const o = createOwner();
  const value = ctx.suspense[id] || (ctx.suspense[id] = {
    resources: new Map(),
    completed: () => {
      const res = runSuspense();
      if (suspenseComplete(value)) {
        done(resolveSSRNode$1(res));
      }
    }
  });
  function runSuspense() {
    setHydrateContext({
      ...ctx,
      count: 0
    });
    o && cleanNode(o);
    return runWithOwner(o, () => {
      return createComponent(SuspenseContext.Provider, {
        value,
        get children() {
          return props.children;
        }
      });
    });
  }
  const res = runSuspense();
  if (suspenseComplete(value)) return res;
  onError(err => {
    if (!done || !done(undefined, err)) {
      if (o) runWithOwner(o.owner, () => {
        throw err;
      });else throw err;
    }
  });
  done = ctx.async ? ctx.registerFragment(id) : undefined;
  if (ctx.async) {
    setHydrateContext({
      ...ctx,
      count: 0,
      id: ctx.id + "0-f",
      noHydrate: true
    });
    const res = {
      t: `<template id="pl-${id}"></template>${resolveSSRNode$1(props.fallback)}<!pl-${id}>`
    };
    setHydrateContext(ctx);
    return res;
  }
  setHydrateContext({
    ...ctx,
    count: 0,
    id: ctx.id + "0-f"
  });
  ctx.writeResource(id, "$$f");
  return props.fallback;
}

const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
const BooleanAttributes = /*#__PURE__*/new Set(booleans);
const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});

const {
  hasOwnProperty
} = Object.prototype;
const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
const REF_START_CHARS_LEN = REF_START_CHARS.length;
const REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
const REF_CHARS_LEN = REF_CHARS.length;
const STACK = [];
const BUFFER = [""];
let ASSIGNMENTS = new Map();
let INDEX_OR_REF = new WeakMap();
let REF_COUNT = 0;
BUFFER.pop();
function stringify(root) {
  if (writeProp(root, "")) {
    let result = BUFFER[0];
    for (let i = 1, len = BUFFER.length; i < len; i++) {
      result += BUFFER[i];
    }
    if (REF_COUNT) {
      if (ASSIGNMENTS.size) {
        let ref = INDEX_OR_REF.get(root);
        if (typeof ref === "number") {
          ref = toRefParam(REF_COUNT++);
          result = ref + "=" + result;
        }
        for (const [assignmentRef, assignments] of ASSIGNMENTS) {
          result += ";" + assignments + assignmentRef;
        }
        result += ";return " + ref;
        ASSIGNMENTS = new Map();
      } else {
        result = "return " + result;
      }
      result = "(function(" + refParamsString() + "){" + result + "}())";
    } else if (root && root.constructor === Object) {
      result = "(" + result + ")";
    }
    BUFFER.length = 0;
    INDEX_OR_REF = new WeakMap();
    return result;
  }
  return "void 0";
}
function writeProp(cur, accessor) {
  switch (typeof cur) {
    case "string":
      BUFFER.push(quote(cur, 0));
      break;
    case "number":
      BUFFER.push(cur + "");
      break;
    case "boolean":
      BUFFER.push(cur ? "!0" : "!1");
      break;
    case "object":
      if (cur === null) {
        BUFFER.push("null");
      } else {
        const ref = getRef(cur, accessor);
        switch (ref) {
          case true:
            return false;
          case false:
            switch (cur.constructor) {
              case Object:
                writeObject(cur);
                break;
              case Array:
                writeArray(cur);
                break;
              case Date:
                BUFFER.push('new Date("' + cur.toISOString() + '")');
                break;
              case RegExp:
                BUFFER.push(cur + "");
                break;
              case Map:
                BUFFER.push("new Map(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case Set:
                BUFFER.push("new Set(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case undefined:
                BUFFER.push("Object.assign(Object.create(null),");
                writeObject(cur);
                BUFFER.push(")");
                break;
              default:
                return false;
            }
            break;
          default:
            BUFFER.push(ref);
            break;
        }
      }
      break;
    default:
      return false;
  }
  return true;
}
function writeObject(obj) {
  let sep = "{";
  STACK.push(obj);
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const escapedKey = toObjectKey(key);
      BUFFER.push(sep + escapedKey + ":");
      if (writeProp(val, escapedKey)) {
        sep = ",";
      } else {
        BUFFER.pop();
      }
    }
  }
  if (sep === "{") {
    BUFFER.push("{}");
  } else {
    BUFFER.push("}");
  }
  STACK.pop();
}
function writeArray(arr) {
  BUFFER.push("[");
  STACK.push(arr);
  writeProp(arr[0], 0);
  for (let i = 1, len = arr.length; i < len; i++) {
    BUFFER.push(",");
    writeProp(arr[i], i);
  }
  STACK.pop();
  BUFFER.push("]");
}
function getRef(cur, accessor) {
  let ref = INDEX_OR_REF.get(cur);
  if (ref === undefined) {
    INDEX_OR_REF.set(cur, BUFFER.length);
    return false;
  }
  if (typeof ref === "number") {
    ref = insertAndGetRef(cur, ref);
  }
  if (STACK.includes(cur)) {
    const parent = STACK[STACK.length - 1];
    let parentRef = INDEX_OR_REF.get(parent);
    if (typeof parentRef === "number") {
      parentRef = insertAndGetRef(parent, parentRef);
    }
    ASSIGNMENTS.set(ref, (ASSIGNMENTS.get(ref) || "") + toAssignment(parentRef, accessor) + "=");
    return true;
  }
  return ref;
}
function toObjectKey(name) {
  const invalidIdentifierPos = getInvalidIdentifierPos(name);
  return invalidIdentifierPos === -1 ? name : quote(name, invalidIdentifierPos);
}
function toAssignment(parent, key) {
  return parent + (typeof key === "number" || key[0] === '"' ? "[" + key + "]" : "." + key);
}
function getInvalidIdentifierPos(name) {
  let char = name[0];
  if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$" || char === "_")) {
    return 0;
  }
  for (let i = 1, len = name.length; i < len; i++) {
    char = name[i];
    if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char >= "0" && char <= "9" || char === "$" || char === "_")) {
      return i;
    }
  }
  return -1;
}
function quote(str, startPos) {
  let result = "";
  let lastPos = 0;
  for (let i = startPos, len = str.length; i < len; i++) {
    let replacement;
    switch (str[i]) {
      case '"':
        replacement = '\\"';
        break;
      case "\\":
        replacement = "\\\\";
        break;
      case "<":
        replacement = "\\x3C";
        break;
      case "\n":
        replacement = "\\n";
        break;
      case "\r":
        replacement = "\\r";
        break;
      case "\u2028":
        replacement = "\\u2028";
        break;
      case "\u2029":
        replacement = "\\u2029";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos === startPos) {
    result = str;
  } else {
    result += str.slice(lastPos);
  }
  return '"' + result + '"';
}
function insertAndGetRef(obj, pos) {
  const ref = toRefParam(REF_COUNT++);
  INDEX_OR_REF.set(obj, ref);
  if (pos) {
    BUFFER[pos - 1] += ref + "=";
  } else {
    BUFFER[pos] = ref + "=" + BUFFER[pos];
  }
  return ref;
}
function refParamsString() {
  let result = REF_START_CHARS[0];
  for (let i = 1; i < REF_COUNT; i++) {
    result += "," + toRefParam(i);
  }
  REF_COUNT = 0;
  return result;
}
function toRefParam(index) {
  let mod = index % REF_START_CHARS_LEN;
  let ref = REF_START_CHARS[mod];
  index = (index - mod) / REF_START_CHARS_LEN;
  while (index > 0) {
    mod = index % REF_CHARS_LEN;
    ref += REF_CHARS[mod];
    index = (index - mod) / REF_CHARS_LEN;
  }
  return ref;
}

const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const REPLACE_SCRIPT = `function $df(e,t,n,o,d){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)d=o.nextSibling,o.remove(),o=d;o.replaceWith(n.content)}n.remove(),_$HY.set(e,t),_$HY.fe(e)}`;
function renderToStringAsync(code, options = {}) {
  const {
    timeoutMs = 30000
  } = options;
  let timeoutHandle;
  const timeout = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject("renderToString timed out"), timeoutMs);
  });
  return Promise.race([renderToStream(code, options), timeout]).then(html => {
    clearTimeout(timeoutHandle);
    return html;
  });
}
function renderToStream(code, options = {}) {
  let {
    nonce,
    onCompleteShell,
    onCompleteAll,
    renderId
  } = options;
  let dispose;
  const blockingResources = [];
  const registry = new Map();
  const dedupe = new WeakMap();
  const checkEnd = () => {
    if (!registry.size && !completed) {
      writeTasks();
      onCompleteAll && onCompleteAll({
        write(v) {
          !completed && buffer.write(v);
        }
      });
      writable && writable.end();
      completed = true;
      dispose();
    }
  };
  const pushTask = task => {
    tasks += task + ";";
    if (!scheduled && firstFlushed) {
      Promise.resolve().then(writeTasks);
      scheduled = true;
    }
  };
  const writeTasks = () => {
    if (tasks.length && !completed && firstFlushed) {
      buffer.write(`<script${nonce ? ` nonce="${nonce}"` : ""}>${tasks}</script>`);
      tasks = "";
    }
    scheduled = false;
  };
  let context;
  let writable;
  let tmp = "";
  let tasks = "";
  let firstFlushed = false;
  let completed = false;
  let scriptFlushed = false;
  let scheduled = true;
  let buffer = {
    write(payload) {
      tmp += payload;
    }
  };
  sharedConfig.context = context = {
    id: renderId || "",
    count: 0,
    async: true,
    resources: {},
    lazy: {},
    suspense: {},
    assets: [],
    nonce,
    block(p) {
      if (!firstFlushed) blockingResources.push(p);
    },
    replace(id, payloadFn) {
      if (firstFlushed) return;
      const placeholder = `<!${id}>`;
      const first = html.indexOf(placeholder);
      if (first === -1) return;
      const last = html.indexOf(`<!/${id}>`, first + placeholder.length);
      html = html.replace(html.slice(first, last + placeholder.length + 1), resolveSSRNode(payloadFn()));
    },
    writeResource(id, p, error, wait) {
      const serverOnly = sharedConfig.context.noHydrate;
      if (error) return !serverOnly && pushTask(serializeSet(dedupe, id, p, serializeError));
      if (!p || typeof p !== "object" || !("then" in p)) return !serverOnly && pushTask(serializeSet(dedupe, id, p));
      if (!firstFlushed) wait && blockingResources.push(p);else !serverOnly && pushTask(`_$HY.init("${id}")`);
      if (serverOnly) return;
      p.then(d => {
        !completed && pushTask(serializeSet(dedupe, id, d));
      }).catch(() => {
        !completed && pushTask(`_$HY.set("${id}", {})`);
      });
    },
    registerFragment(key) {
      if (!registry.has(key)) {
        registry.set(key, []);
        firstFlushed && pushTask(`_$HY.init("${key}")`);
      }
      return (value, error) => {
        if (registry.has(key)) {
          const keys = registry.get(key);
          registry.delete(key);
          if (waitForFragments(registry, key)) return;
          if ((value !== undefined || error) && !completed) {
            if (!firstFlushed) {
              Promise.resolve().then(() => html = replacePlaceholder(html, key, value !== undefined ? value : ""));
              error && pushTask(serializeSet(dedupe, key, error, serializeError));
            } else {
              buffer.write(`<template id="${key}">${value !== undefined ? value : " "}</template>`);
              pushTask(`${keys.length ? keys.map(k => `_$HY.unset("${k}")`).join(";") + ";" : ""}$df("${key}"${error ? "," + serializeError(error) : ""})${!scriptFlushed ? ";" + REPLACE_SCRIPT : ""}`);
              scriptFlushed = true;
            }
          }
        }
        if (!registry.size) Promise.resolve().then(checkEnd);
        return firstFlushed;
      };
    }
  };
  let html = createRoot(d => {
    dispose = d;
    return resolveSSRNode(escape(code()));
  });
  function doShell() {
    sharedConfig.context = context;
    context.noHydrate = true;
    html = injectAssets(context.assets, html);
    for (const key in context.resources) {
      if (!("data" in context.resources[key] || context.resources[key].ref[0].error)) pushTask(`_$HY.init("${key}")`);
    }
    for (const key of registry.keys()) pushTask(`_$HY.init("${key}")`);
    if (tasks.length) html = injectScripts(html, tasks, nonce);
    buffer.write(html);
    tasks = "";
    scheduled = false;
    onCompleteShell && onCompleteShell({
      write(v) {
        !completed && buffer.write(v);
      }
    });
  }
  return {
    then(fn) {
      function complete() {
        doShell();
        fn(tmp);
      }
      if (onCompleteAll) {
        ogComplete = onCompleteAll;
        onCompleteAll = options => {
          ogComplete(options);
          complete();
        };
      } else onCompleteAll = complete;
      if (!registry.size) Promise.resolve().then(checkEnd);
    },
    pipe(w) {
      Promise.allSettled(blockingResources).then(() => {
        doShell();
        buffer = writable = w;
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();else setTimeout(checkEnd);
      });
    },
    pipeTo(w) {
      Promise.allSettled(blockingResources).then(() => {
        doShell();
        const encoder = new TextEncoder();
        const writer = w.getWriter();
        writable = {
          end() {
            writer.releaseLock();
            w.close();
          }
        };
        buffer = {
          write(payload) {
            writer.write(encoder.encode(payload));
          }
        };
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();else setTimeout(checkEnd);
      });
    }
  };
}
function HydrationScript(props) {
  const {
    nonce
  } = sharedConfig.context;
  return ssr(generateHydrationScript({
    nonce,
    ...props
  }));
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
    result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += key;
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  const skipChildren = VOID_ELEMENTS.test(tag);
  if (props == null) props = {};else if (typeof props === "function") props = props();
  const keys = Object.keys(props);
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined && !skipChildren) children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${(n = props.class) ? n + " " : ""}${(n = props.className) ? n + " " : ""}${ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  if (skipChildren) {
    return {
      t: result + '/>'
    };
  }
  return {
    t: result + `>${resolveSSRNode(children)}</${tag}>`
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s(), attr);
    if (!attr && Array.isArray(s)) {
      let r = "";
      for (let i = 0; i < s.length; i++) r += resolveSSRNode(escape(s[i], attr));
      return {
        t: r
      };
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function useAssets(fn) {
  sharedConfig.context.assets.push(() => resolveSSRNode(fn()));
}
function generateHydrationScript({
  eventNames = ["click", "input"],
  nonce
} = {}) {
  return `<script${nonce ? ` nonce="${nonce}"` : ""}>(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host instanceof Node?e.host:e.parentNode));["${eventNames.join('", "')}"].forEach((o=>document.addEventListener(o,(o=>{let s=o.composedPath&&o.composedPath()[0]||o.target,a=t(s);a&&!e.completed.has(a)&&e.events.push([a,o])}))))})(window._$HY||(_$HY={events:[],completed:new WeakSet,r:{},fe(){},init(e,t){_$HY.r[e]=[new Promise((e=>t=e)),t]},set(e,t,o){(o=_$HY.r[e])&&o[1](t),_$HY.r[e]=[t]},unset(e){delete _$HY.r[e]},load:e=>_$HY.r[e]}));</script><!--xs-->`;
}
function NoHydration(props) {
  sharedConfig.context.noHydrate = true;
  return props.children;
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function serializeError(error) {
  if (error.message) {
    const fields = {};
    const keys = Object.getOwnPropertyNames(error);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = error[key];
      if (!value || key !== "message" && typeof value !== "function") {
        fields[key] = value;
      }
    }
    return `Object.assign(new Error(${stringify(error.message)}), ${stringify(fields)})`;
  }
  return stringify(error);
}
function waitForFragments(registry, key) {
  for (const k of [...registry.keys()].reverse()) {
    if (key.startsWith(k)) {
      registry.get(k).push(key);
      return true;
    }
  }
  return false;
}
function serializeSet(registry, key, value, serializer = stringify) {
  const exist = registry.get(value);
  if (exist) return `_$HY.set("${key}", _$HY.r["${exist}"][0])`;
  value !== null && typeof value === "object" && registry.set(value, key);
  return `_$HY.set("${key}", ${serializer(value)})`;
}
function replacePlaceholder(html, key, value) {
  const marker = `<template id="pl-${key}">`;
  const close = `<!pl-${key}>`;
  const first = html.indexOf(marker);
  if (first === -1) return html;
  const last = html.indexOf(close, first + marker.length);
  return html.slice(0, first) + value + html.slice(last + close.length);
}

const isServer = true;

var vs = {};

var lib = {};

var server$2 = {};

var server$1 = {};

var hasRequiredServer$1;

function requireServer$1 () {
	if (hasRequiredServer$1) return server$1;
	hasRequiredServer$1 = 1;

	const equalFn = (a, b) => a === b;
	const $PROXY = Symbol("solid-proxy");
	const $TRACK = Symbol("solid-track");
	const $DEVCOMP = Symbol("solid-dev-component");
	const DEV = {};
	const ERROR = Symbol("error");
	function castError(err) {
	  if (err instanceof Error || typeof err === "string") return err;
	  return new Error("Unknown error");
	}
	function handleError(err) {
	  err = castError(err);
	  const fns = lookup(Owner, ERROR);
	  if (!fns) throw err;
	  for (const f of fns) f(err);
	}
	const UNOWNED = {
	  context: null,
	  owner: null,
	  owned: null,
	  cleanups: null
	};
	let Owner = null;
	function createOwner() {
	  const o = {
	    owner: Owner,
	    context: null,
	    owned: null,
	    cleanups: null
	  };
	  if (Owner) {
	    if (!Owner.owned) Owner.owned = [o];else Owner.owned.push(o);
	  }
	  return o;
	}
	function createRoot(fn, detachedOwner) {
	  const owner = Owner,
	    root = fn.length === 0 ? UNOWNED : {
	      context: null,
	      owner: detachedOwner === undefined ? owner : detachedOwner,
	      owned: null,
	      cleanups: null
	    };
	  Owner = root;
	  let result;
	  try {
	    result = fn(fn.length === 0 ? () => {} : () => cleanNode(root));
	  } catch (err) {
	    handleError(err);
	  } finally {
	    Owner = owner;
	  }
	  return result;
	}
	function createSignal(value, options) {
	  return [() => value, v => {
	    return value = typeof v === "function" ? v(value) : v;
	  }];
	}
	function createComputed(fn, value) {
	  Owner = createOwner();
	  try {
	    fn(value);
	  } catch (err) {
	    handleError(err);
	  } finally {
	    Owner = Owner.owner;
	  }
	}
	const createRenderEffect = createComputed;
	function createEffect(fn, value) {}
	function createReaction(fn) {
	  return fn => {
	    fn();
	  };
	}
	function createMemo(fn, value) {
	  Owner = createOwner();
	  let v;
	  try {
	    v = fn(value);
	  } catch (err) {
	    handleError(err);
	  } finally {
	    Owner = Owner.owner;
	  }
	  return () => v;
	}
	function createDeferred(source) {
	  return source;
	}
	function createSelector(source, fn = equalFn) {
	  return k => fn(k, source());
	}
	function batch(fn) {
	  return fn();
	}
	const untrack = batch;
	function on(deps, fn, options = {}) {
	  const isArray = Array.isArray(deps);
	  const defer = options.defer;
	  return () => {
	    if (defer) return undefined;
	    let value;
	    if (isArray) {
	      value = [];
	      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
	    } else value = deps();
	    return fn(value);
	  };
	}
	function onMount(fn) {}
	function onCleanup(fn) {
	  if (Owner) {
	    if (!Owner.cleanups) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
	  }
	  return fn;
	}
	function cleanNode(node) {
	  if (node.owned) {
	    for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
	    node.owned = null;
	  }
	  if (node.cleanups) {
	    for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
	    node.cleanups = null;
	  }
	}
	function onError(fn) {
	  if (Owner) {
	    if (Owner.context === null) Owner.context = {
	      [ERROR]: [fn]
	    };else if (!Owner.context[ERROR]) Owner.context[ERROR] = [fn];else Owner.context[ERROR].push(fn);
	  }
	}
	function getListener() {
	  return null;
	}
	function createContext(defaultValue) {
	  const id = Symbol("context");
	  return {
	    id,
	    Provider: createProvider(id),
	    defaultValue
	  };
	}
	function useContext(context) {
	  let ctx;
	  return (ctx = lookup(Owner, context.id)) !== undefined ? ctx : context.defaultValue;
	}
	function getOwner() {
	  return Owner;
	}
	function children(fn) {
	  const memo = createMemo(() => resolveChildren(fn()));
	  memo.toArray = () => {
	    const c = memo();
	    return Array.isArray(c) ? c : c != null ? [c] : [];
	  };
	  return memo;
	}
	function runWithOwner(o, fn) {
	  const prev = Owner;
	  Owner = o;
	  try {
	    return fn();
	  } catch (err) {
	    handleError(err);
	  } finally {
	    Owner = prev;
	  }
	}
	function lookup(owner, key) {
	  return owner ? owner.context && owner.context[key] !== undefined ? owner.context[key] : lookup(owner.owner, key) : undefined;
	}
	function resolveChildren(children) {
	  if (typeof children === "function" && !children.length) return resolveChildren(children());
	  if (Array.isArray(children)) {
	    const results = [];
	    for (let i = 0; i < children.length; i++) {
	      const result = resolveChildren(children[i]);
	      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
	    }
	    return results;
	  }
	  return children;
	}
	function createProvider(id) {
	  return function provider(props) {
	    return createMemo(() => {
	      Owner.context = {
	        [id]: props.value
	      };
	      return children(() => props.children);
	    });
	  };
	}
	function requestCallback(fn, options) {
	  return {
	    id: 0,
	    fn: () => {},
	    startTime: 0,
	    expirationTime: 0
	  };
	}
	function mapArray(list, mapFn, options = {}) {
	  const items = list();
	  let s = [];
	  if (items.length) {
	    for (let i = 0, len = items.length; i < len; i++) s.push(mapFn(items[i], () => i));
	  } else if (options.fallback) s = [options.fallback()];
	  return () => s;
	}
	function observable(input) {
	  return {
	    subscribe(observer) {
	      if (!(observer instanceof Object) || observer == null) {
	        throw new TypeError("Expected the observer to be an object.");
	      }
	      const handler = typeof observer === "function" ? observer : observer.next && observer.next.bind(observer);
	      if (!handler) {
	        return {
	          unsubscribe() {}
	        };
	      }
	      const dispose = createRoot(disposer => {
	        createEffect(() => {
	          const v = input();
	          untrack(() => handler(v));
	        });
	        return disposer;
	      });
	      if (getOwner()) onCleanup(dispose);
	      return {
	        unsubscribe() {
	          dispose();
	        }
	      };
	    },
	    [Symbol.observable || "@@observable"]() {
	      return this;
	    }
	  };
	}
	function from(producer) {
	  const [s, set] = createSignal(undefined);
	  if ("subscribe" in producer) {
	    const unsub = producer.subscribe(v => set(() => v));
	    onCleanup(() => "unsubscribe" in unsub ? unsub.unsubscribe() : unsub());
	  } else {
	    const clean = producer(set);
	    onCleanup(clean);
	  }
	  return s;
	}
	function enableExternalSource(factory) {}

	function resolveSSRNode(node) {
	  const t = typeof node;
	  if (t === "string") return node;
	  if (node == null || t === "boolean") return "";
	  if (Array.isArray(node)) {
	    let mapped = "";
	    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode(node[i]);
	    return mapped;
	  }
	  if (t === "object") return node.t;
	  if (t === "function") return resolveSSRNode(node());
	  return String(node);
	}
	const sharedConfig = {};
	function setHydrateContext(context) {
	  sharedConfig.context = context;
	}
	function nextHydrateContext() {
	  return sharedConfig.context ? {
	    ...sharedConfig.context,
	    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
	    count: 0
	  } : undefined;
	}
	function createUniqueId() {
	  const ctx = sharedConfig.context;
	  if (!ctx) throw new Error(`createUniqueId cannot be used under non-hydrating context`);
	  return `${ctx.id}${ctx.count++}`;
	}
	function createComponent(Comp, props) {
	  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
	    const c = sharedConfig.context;
	    setHydrateContext(nextHydrateContext());
	    const r = Comp(props || {});
	    setHydrateContext(c);
	    return r;
	  }
	  return Comp(props || {});
	}
	function mergeProps(...sources) {
	  const target = {};
	  for (let i = 0; i < sources.length; i++) {
	    let source = sources[i];
	    if (typeof source === "function") source = source();
	    if (source) {
	      const descriptors = Object.getOwnPropertyDescriptors(source);
	      for (const key in descriptors) {
	        if (key in target) continue;
	        Object.defineProperty(target, key, {
	          enumerable: true,
	          get() {
	            for (let i = sources.length - 1; i >= 0; i--) {
	              let s = sources[i] || {};
	              if (typeof s === "function") s = s();
	              const v = s[key];
	              if (v !== undefined) return v;
	            }
	          }
	        });
	      }
	    }
	  }
	  return target;
	}
	function splitProps(props, ...keys) {
	  const descriptors = Object.getOwnPropertyDescriptors(props),
	    split = k => {
	      const clone = {};
	      for (let i = 0; i < k.length; i++) {
	        const key = k[i];
	        if (descriptors[key]) {
	          Object.defineProperty(clone, key, descriptors[key]);
	          delete descriptors[key];
	        }
	      }
	      return clone;
	    };
	  return keys.map(split).concat(split(Object.keys(descriptors)));
	}
	function simpleMap(props, wrap) {
	  const list = props.each || [],
	    len = list.length,
	    fn = props.children;
	  if (len) {
	    let mapped = Array(len);
	    for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
	    return mapped;
	  }
	  return props.fallback;
	}
	function For(props) {
	  return simpleMap(props, (fn, item, i) => fn(item, () => i));
	}
	function Index(props) {
	  return simpleMap(props, (fn, item, i) => fn(() => item, i));
	}
	function Show(props) {
	  let c;
	  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
	}
	function Switch(props) {
	  let conditions = props.children;
	  Array.isArray(conditions) || (conditions = [conditions]);
	  for (let i = 0; i < conditions.length; i++) {
	    const w = conditions[i].when;
	    if (w) {
	      const c = conditions[i].children;
	      return typeof c === "function" ? c(w) : c;
	    }
	  }
	  return props.fallback || "";
	}
	function Match(props) {
	  return props;
	}
	function resetErrorBoundaries() {}
	function ErrorBoundary(props) {
	  let error,
	    res,
	    clean,
	    sync = true;
	  const ctx = sharedConfig.context;
	  const id = ctx.id + ctx.count;
	  function displayFallback() {
	    cleanNode(clean);
	    ctx.writeResource(id, error, true);
	    setHydrateContext({
	      ...ctx,
	      count: 0
	    });
	    const f = props.fallback;
	    return typeof f === "function" && f.length ? f(error, () => {}) : f;
	  }
	  onError(err => {
	    error = err;
	    !sync && ctx.replace("e" + id, displayFallback);
	    sync = true;
	  });
	  createMemo(() => {
	    clean = Owner;
	    return res = props.children;
	  });
	  if (error) return displayFallback();
	  sync = false;
	  return {
	    t: `<!e${id}>${resolveSSRNode(res)}<!/e${id}>`
	  };
	}
	const SuspenseContext = createContext();
	let resourceContext = null;
	function createResource(source, fetcher, options = {}) {
	  if (arguments.length === 2) {
	    if (typeof fetcher === "object") {
	      options = fetcher;
	      fetcher = source;
	      source = true;
	    }
	  } else if (arguments.length === 1) {
	    fetcher = source;
	    source = true;
	  }
	  const contexts = new Set();
	  const id = sharedConfig.context.id + sharedConfig.context.count++;
	  let resource = {};
	  let value = options.storage ? options.storage(options.initialValue)[0]() : options.initialValue;
	  let p;
	  let error;
	  if (sharedConfig.context.async && options.ssrLoadFrom !== "initial") {
	    resource = sharedConfig.context.resources[id] || (sharedConfig.context.resources[id] = {});
	    if (resource.ref) {
	      if (!resource.data && !resource.ref[0].loading && !resource.ref[0].error) resource.ref[1].refetch();
	      return resource.ref;
	    }
	  }
	  const read = () => {
	    if (error) throw error;
	    if (resourceContext && p) resourceContext.push(p);
	    const resolved = options.ssrLoadFrom !== "initial" && sharedConfig.context.async && "data" in sharedConfig.context.resources[id];
	    if (!resolved && read.loading) {
	      const ctx = useContext(SuspenseContext);
	      if (ctx) {
	        ctx.resources.set(id, read);
	        contexts.add(ctx);
	      }
	    }
	    return resolved ? sharedConfig.context.resources[id].data : value;
	  };
	  read.loading = false;
	  read.error = undefined;
	  read.state = "initialValue" in options ? "ready" : "unresolved";
	  Object.defineProperty(read, "latest", {
	    get() {
	      return read();
	    }
	  });
	  function load() {
	    const ctx = sharedConfig.context;
	    if (!ctx.async) return read.loading = !!(typeof source === "function" ? source() : source);
	    if (ctx.resources && id in ctx.resources && "data" in ctx.resources[id]) {
	      value = ctx.resources[id].data;
	      return;
	    }
	    resourceContext = [];
	    const lookup = typeof source === "function" ? source() : source;
	    if (resourceContext.length) {
	      p = Promise.all(resourceContext).then(() => fetcher(source(), {
	        value
	      }));
	    }
	    resourceContext = null;
	    if (!p) {
	      if (lookup == null || lookup === false) return;
	      p = fetcher(lookup, {
	        value
	      });
	    }
	    if (p != undefined && typeof p === "object" && "then" in p) {
	      read.loading = true;
	      read.state = "pending";
	      if (ctx.writeResource) ctx.writeResource(id, p, undefined, options.deferStream);
	      return p.then(res => {
	        read.loading = false;
	        read.state = "ready";
	        ctx.resources[id].data = res;
	        p = null;
	        notifySuspense(contexts);
	        return res;
	      }).catch(err => {
	        read.loading = false;
	        read.state = "errored";
	        read.error = error = castError(err);
	        p = null;
	        notifySuspense(contexts);
	      });
	    }
	    ctx.resources[id].data = p;
	    if (ctx.writeResource) ctx.writeResource(id, p);
	    p = null;
	    return ctx.resources[id].data;
	  }
	  if (options.ssrLoadFrom !== "initial") load();
	  return resource.ref = [read, {
	    refetch: load,
	    mutate: v => value = v
	  }];
	}
	function lazy(fn) {
	  let p;
	  let load = id => {
	    if (!p) {
	      p = fn();
	      p.then(mod => p.resolved = mod.default);
	      if (id) sharedConfig.context.lazy[id] = p;
	    }
	    return p;
	  };
	  const contexts = new Set();
	  const wrap = props => {
	    const id = sharedConfig.context.id.slice(0, -1);
	    let ref = sharedConfig.context.lazy[id];
	    if (ref) p = ref;else load(id);
	    if (p.resolved) return p.resolved(props);
	    const ctx = useContext(SuspenseContext);
	    const track = {
	      loading: true,
	      error: undefined
	    };
	    if (ctx) {
	      ctx.resources.set(id, track);
	      contexts.add(ctx);
	    }
	    if (sharedConfig.context.async) {
	      sharedConfig.context.block(p.then(() => {
	        track.loading = false;
	        notifySuspense(contexts);
	      }));
	    }
	    return "";
	  };
	  wrap.preload = load;
	  return wrap;
	}
	function suspenseComplete(c) {
	  for (const r of c.resources.values()) {
	    if (r.loading) return false;
	  }
	  return true;
	}
	function notifySuspense(contexts) {
	  for (const c of contexts) {
	    if (!suspenseComplete(c)) {
	      continue;
	    }
	    c.completed();
	    contexts.delete(c);
	  }
	}
	function enableScheduling() {}
	function enableHydration() {}
	function startTransition(fn) {
	  fn();
	}
	function useTransition() {
	  return [() => false, fn => {
	    fn();
	  }];
	}
	function SuspenseList(props) {
	  return props.children;
	}
	function Suspense(props) {
	  let done;
	  const ctx = sharedConfig.context;
	  const id = ctx.id + ctx.count;
	  const o = createOwner();
	  const value = ctx.suspense[id] || (ctx.suspense[id] = {
	    resources: new Map(),
	    completed: () => {
	      const res = runSuspense();
	      if (suspenseComplete(value)) {
	        done(resolveSSRNode(res));
	      }
	    }
	  });
	  function runSuspense() {
	    setHydrateContext({
	      ...ctx,
	      count: 0
	    });
	    o && cleanNode(o);
	    return runWithOwner(o, () => {
	      return createComponent(SuspenseContext.Provider, {
	        value,
	        get children() {
	          return props.children;
	        }
	      });
	    });
	  }
	  const res = runSuspense();
	  if (suspenseComplete(value)) return res;
	  onError(err => {
	    if (!done || !done(undefined, err)) {
	      if (o) runWithOwner(o.owner, () => {
	        throw err;
	      });else throw err;
	    }
	  });
	  done = ctx.async ? ctx.registerFragment(id) : undefined;
	  if (ctx.async) {
	    setHydrateContext({
	      ...ctx,
	      count: 0,
	      id: ctx.id + "0-f",
	      noHydrate: true
	    });
	    const res = {
	      t: `<template id="pl-${id}"></template>${resolveSSRNode(props.fallback)}<!pl-${id}>`
	    };
	    setHydrateContext(ctx);
	    return res;
	  }
	  setHydrateContext({
	    ...ctx,
	    count: 0,
	    id: ctx.id + "0-f"
	  });
	  ctx.writeResource(id, "$$f");
	  return props.fallback;
	}

	server$1.$DEVCOMP = $DEVCOMP;
	server$1.$PROXY = $PROXY;
	server$1.$TRACK = $TRACK;
	server$1.DEV = DEV;
	server$1.ErrorBoundary = ErrorBoundary;
	server$1.For = For;
	server$1.Index = Index;
	server$1.Match = Match;
	server$1.Show = Show;
	server$1.Suspense = Suspense;
	server$1.SuspenseList = SuspenseList;
	server$1.Switch = Switch;
	server$1.batch = batch;
	server$1.children = children;
	server$1.createComponent = createComponent;
	server$1.createComputed = createComputed;
	server$1.createContext = createContext;
	server$1.createDeferred = createDeferred;
	server$1.createEffect = createEffect;
	server$1.createMemo = createMemo;
	server$1.createReaction = createReaction;
	server$1.createRenderEffect = createRenderEffect;
	server$1.createResource = createResource;
	server$1.createRoot = createRoot;
	server$1.createSelector = createSelector;
	server$1.createSignal = createSignal;
	server$1.createUniqueId = createUniqueId;
	server$1.enableExternalSource = enableExternalSource;
	server$1.enableHydration = enableHydration;
	server$1.enableScheduling = enableScheduling;
	server$1.equalFn = equalFn;
	server$1.from = from;
	server$1.getListener = getListener;
	server$1.getOwner = getOwner;
	server$1.lazy = lazy;
	server$1.mapArray = mapArray;
	server$1.mergeProps = mergeProps;
	server$1.observable = observable;
	server$1.on = on;
	server$1.onCleanup = onCleanup;
	server$1.onError = onError;
	server$1.onMount = onMount;
	server$1.requestCallback = requestCallback;
	server$1.resetErrorBoundaries = resetErrorBoundaries;
	server$1.runWithOwner = runWithOwner;
	server$1.sharedConfig = sharedConfig;
	server$1.splitProps = splitProps;
	server$1.startTransition = startTransition;
	server$1.untrack = untrack;
	server$1.useContext = useContext;
	server$1.useTransition = useTransition;
	return server$1;
}

var hasRequiredServer;

function requireServer () {
	if (hasRequiredServer) return server$2;
	hasRequiredServer = 1;
	(function (exports) {

		var solidJs = requireServer$1();

		const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
		const BooleanAttributes = /*#__PURE__*/new Set(booleans);
		const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
		const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
		  className: "class",
		  htmlFor: "for"
		});

		const {
		  hasOwnProperty
		} = Object.prototype;
		const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
		const REF_START_CHARS_LEN = REF_START_CHARS.length;
		const REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
		const REF_CHARS_LEN = REF_CHARS.length;
		const STACK = [];
		const BUFFER = [""];
		let ASSIGNMENTS = new Map();
		let INDEX_OR_REF = new WeakMap();
		let REF_COUNT = 0;
		BUFFER.pop();
		function stringify(root) {
		  if (writeProp(root, "")) {
		    let result = BUFFER[0];
		    for (let i = 1, len = BUFFER.length; i < len; i++) {
		      result += BUFFER[i];
		    }
		    if (REF_COUNT) {
		      if (ASSIGNMENTS.size) {
		        let ref = INDEX_OR_REF.get(root);
		        if (typeof ref === "number") {
		          ref = toRefParam(REF_COUNT++);
		          result = ref + "=" + result;
		        }
		        for (const [assignmentRef, assignments] of ASSIGNMENTS) {
		          result += ";" + assignments + assignmentRef;
		        }
		        result += ";return " + ref;
		        ASSIGNMENTS = new Map();
		      } else {
		        result = "return " + result;
		      }
		      result = "(function(" + refParamsString() + "){" + result + "}())";
		    } else if (root && root.constructor === Object) {
		      result = "(" + result + ")";
		    }
		    BUFFER.length = 0;
		    INDEX_OR_REF = new WeakMap();
		    return result;
		  }
		  return "void 0";
		}
		function writeProp(cur, accessor) {
		  switch (typeof cur) {
		    case "string":
		      BUFFER.push(quote(cur, 0));
		      break;
		    case "number":
		      BUFFER.push(cur + "");
		      break;
		    case "boolean":
		      BUFFER.push(cur ? "!0" : "!1");
		      break;
		    case "object":
		      if (cur === null) {
		        BUFFER.push("null");
		      } else {
		        const ref = getRef(cur, accessor);
		        switch (ref) {
		          case true:
		            return false;
		          case false:
		            switch (cur.constructor) {
		              case Object:
		                writeObject(cur);
		                break;
		              case Array:
		                writeArray(cur);
		                break;
		              case Date:
		                BUFFER.push('new Date("' + cur.toISOString() + '")');
		                break;
		              case RegExp:
		                BUFFER.push(cur + "");
		                break;
		              case Map:
		                BUFFER.push("new Map(");
		                writeArray(Array.from(cur));
		                BUFFER.push(")");
		                break;
		              case Set:
		                BUFFER.push("new Set(");
		                writeArray(Array.from(cur));
		                BUFFER.push(")");
		                break;
		              case undefined:
		                BUFFER.push("Object.assign(Object.create(null),");
		                writeObject(cur);
		                BUFFER.push(")");
		                break;
		              default:
		                return false;
		            }
		            break;
		          default:
		            BUFFER.push(ref);
		            break;
		        }
		      }
		      break;
		    default:
		      return false;
		  }
		  return true;
		}
		function writeObject(obj) {
		  let sep = "{";
		  STACK.push(obj);
		  for (const key in obj) {
		    if (hasOwnProperty.call(obj, key)) {
		      const val = obj[key];
		      const escapedKey = toObjectKey(key);
		      BUFFER.push(sep + escapedKey + ":");
		      if (writeProp(val, escapedKey)) {
		        sep = ",";
		      } else {
		        BUFFER.pop();
		      }
		    }
		  }
		  if (sep === "{") {
		    BUFFER.push("{}");
		  } else {
		    BUFFER.push("}");
		  }
		  STACK.pop();
		}
		function writeArray(arr) {
		  BUFFER.push("[");
		  STACK.push(arr);
		  writeProp(arr[0], 0);
		  for (let i = 1, len = arr.length; i < len; i++) {
		    BUFFER.push(",");
		    writeProp(arr[i], i);
		  }
		  STACK.pop();
		  BUFFER.push("]");
		}
		function getRef(cur, accessor) {
		  let ref = INDEX_OR_REF.get(cur);
		  if (ref === undefined) {
		    INDEX_OR_REF.set(cur, BUFFER.length);
		    return false;
		  }
		  if (typeof ref === "number") {
		    ref = insertAndGetRef(cur, ref);
		  }
		  if (STACK.includes(cur)) {
		    const parent = STACK[STACK.length - 1];
		    let parentRef = INDEX_OR_REF.get(parent);
		    if (typeof parentRef === "number") {
		      parentRef = insertAndGetRef(parent, parentRef);
		    }
		    ASSIGNMENTS.set(ref, (ASSIGNMENTS.get(ref) || "") + toAssignment(parentRef, accessor) + "=");
		    return true;
		  }
		  return ref;
		}
		function toObjectKey(name) {
		  const invalidIdentifierPos = getInvalidIdentifierPos(name);
		  return invalidIdentifierPos === -1 ? name : quote(name, invalidIdentifierPos);
		}
		function toAssignment(parent, key) {
		  return parent + (typeof key === "number" || key[0] === '"' ? "[" + key + "]" : "." + key);
		}
		function getInvalidIdentifierPos(name) {
		  let char = name[0];
		  if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$" || char === "_")) {
		    return 0;
		  }
		  for (let i = 1, len = name.length; i < len; i++) {
		    char = name[i];
		    if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char >= "0" && char <= "9" || char === "$" || char === "_")) {
		      return i;
		    }
		  }
		  return -1;
		}
		function quote(str, startPos) {
		  let result = "";
		  let lastPos = 0;
		  for (let i = startPos, len = str.length; i < len; i++) {
		    let replacement;
		    switch (str[i]) {
		      case '"':
		        replacement = '\\"';
		        break;
		      case "\\":
		        replacement = "\\\\";
		        break;
		      case "<":
		        replacement = "\\x3C";
		        break;
		      case "\n":
		        replacement = "\\n";
		        break;
		      case "\r":
		        replacement = "\\r";
		        break;
		      case "\u2028":
		        replacement = "\\u2028";
		        break;
		      case "\u2029":
		        replacement = "\\u2029";
		        break;
		      default:
		        continue;
		    }
		    result += str.slice(lastPos, i) + replacement;
		    lastPos = i + 1;
		  }
		  if (lastPos === startPos) {
		    result = str;
		  } else {
		    result += str.slice(lastPos);
		  }
		  return '"' + result + '"';
		}
		function insertAndGetRef(obj, pos) {
		  const ref = toRefParam(REF_COUNT++);
		  INDEX_OR_REF.set(obj, ref);
		  if (pos) {
		    BUFFER[pos - 1] += ref + "=";
		  } else {
		    BUFFER[pos] = ref + "=" + BUFFER[pos];
		  }
		  return ref;
		}
		function refParamsString() {
		  let result = REF_START_CHARS[0];
		  for (let i = 1; i < REF_COUNT; i++) {
		    result += "," + toRefParam(i);
		  }
		  REF_COUNT = 0;
		  return result;
		}
		function toRefParam(index) {
		  let mod = index % REF_START_CHARS_LEN;
		  let ref = REF_START_CHARS[mod];
		  index = (index - mod) / REF_START_CHARS_LEN;
		  while (index > 0) {
		    mod = index % REF_CHARS_LEN;
		    ref += REF_CHARS[mod];
		    index = (index - mod) / REF_CHARS_LEN;
		  }
		  return ref;
		}

		const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
		const REPLACE_SCRIPT = `function $df(e,t,n,o,d){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)d=o.nextSibling,o.remove(),o=d;o.replaceWith(n.content)}n.remove(),_$HY.set(e,t),_$HY.fe(e)}`;
		function renderToString(code, options = {}) {
		  let scripts = "";
		  solidJs.sharedConfig.context = {
		    id: options.renderId || "",
		    count: 0,
		    suspense: {},
		    lazy: {},
		    assets: [],
		    nonce: options.nonce,
		    writeResource(id, p, error) {
		      if (solidJs.sharedConfig.context.noHydrate) return;
		      if (error) return scripts += `_$HY.set("${id}", ${serializeError(p)});`;
		      scripts += `_$HY.set("${id}", ${stringify(p)});`;
		    }
		  };
		  let html = solidJs.createRoot(d => {
		    const r = resolveSSRNode(escape(code()));
		    d();
		    return r;
		  });
		  solidJs.sharedConfig.context.noHydrate = true;
		  html = injectAssets(solidJs.sharedConfig.context.assets, html);
		  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
		  return html;
		}
		function renderToStringAsync(code, options = {}) {
		  const {
		    timeoutMs = 30000
		  } = options;
		  let timeoutHandle;
		  const timeout = new Promise((_, reject) => {
		    timeoutHandle = setTimeout(() => reject("renderToString timed out"), timeoutMs);
		  });
		  return Promise.race([renderToStream(code, options), timeout]).then(html => {
		    clearTimeout(timeoutHandle);
		    return html;
		  });
		}
		function renderToStream(code, options = {}) {
		  let {
		    nonce,
		    onCompleteShell,
		    onCompleteAll,
		    renderId
		  } = options;
		  let dispose;
		  const blockingResources = [];
		  const registry = new Map();
		  const dedupe = new WeakMap();
		  const checkEnd = () => {
		    if (!registry.size && !completed) {
		      writeTasks();
		      onCompleteAll && onCompleteAll({
		        write(v) {
		          !completed && buffer.write(v);
		        }
		      });
		      writable && writable.end();
		      completed = true;
		      dispose();
		    }
		  };
		  const pushTask = task => {
		    tasks += task + ";";
		    if (!scheduled && firstFlushed) {
		      Promise.resolve().then(writeTasks);
		      scheduled = true;
		    }
		  };
		  const writeTasks = () => {
		    if (tasks.length && !completed && firstFlushed) {
		      buffer.write(`<script${nonce ? ` nonce="${nonce}"` : ""}>${tasks}</script>`);
		      tasks = "";
		    }
		    scheduled = false;
		  };
		  let context;
		  let writable;
		  let tmp = "";
		  let tasks = "";
		  let firstFlushed = false;
		  let completed = false;
		  let scriptFlushed = false;
		  let scheduled = true;
		  let buffer = {
		    write(payload) {
		      tmp += payload;
		    }
		  };
		  solidJs.sharedConfig.context = context = {
		    id: renderId || "",
		    count: 0,
		    async: true,
		    resources: {},
		    lazy: {},
		    suspense: {},
		    assets: [],
		    nonce,
		    block(p) {
		      if (!firstFlushed) blockingResources.push(p);
		    },
		    replace(id, payloadFn) {
		      if (firstFlushed) return;
		      const placeholder = `<!${id}>`;
		      const first = html.indexOf(placeholder);
		      if (first === -1) return;
		      const last = html.indexOf(`<!/${id}>`, first + placeholder.length);
		      html = html.replace(html.slice(first, last + placeholder.length + 1), resolveSSRNode(payloadFn()));
		    },
		    writeResource(id, p, error, wait) {
		      const serverOnly = solidJs.sharedConfig.context.noHydrate;
		      if (error) return !serverOnly && pushTask(serializeSet(dedupe, id, p, serializeError));
		      if (!p || typeof p !== "object" || !("then" in p)) return !serverOnly && pushTask(serializeSet(dedupe, id, p));
		      if (!firstFlushed) wait && blockingResources.push(p);else !serverOnly && pushTask(`_$HY.init("${id}")`);
		      if (serverOnly) return;
		      p.then(d => {
		        !completed && pushTask(serializeSet(dedupe, id, d));
		      }).catch(() => {
		        !completed && pushTask(`_$HY.set("${id}", {})`);
		      });
		    },
		    registerFragment(key) {
		      if (!registry.has(key)) {
		        registry.set(key, []);
		        firstFlushed && pushTask(`_$HY.init("${key}")`);
		      }
		      return (value, error) => {
		        if (registry.has(key)) {
		          const keys = registry.get(key);
		          registry.delete(key);
		          if (waitForFragments(registry, key)) return;
		          if ((value !== undefined || error) && !completed) {
		            if (!firstFlushed) {
		              Promise.resolve().then(() => html = replacePlaceholder(html, key, value !== undefined ? value : ""));
		              error && pushTask(serializeSet(dedupe, key, error, serializeError));
		            } else {
		              buffer.write(`<template id="${key}">${value !== undefined ? value : " "}</template>`);
		              pushTask(`${keys.length ? keys.map(k => `_$HY.unset("${k}")`).join(";") + ";" : ""}$df("${key}"${error ? "," + serializeError(error) : ""})${!scriptFlushed ? ";" + REPLACE_SCRIPT : ""}`);
		              scriptFlushed = true;
		            }
		          }
		        }
		        if (!registry.size) Promise.resolve().then(checkEnd);
		        return firstFlushed;
		      };
		    }
		  };
		  let html = solidJs.createRoot(d => {
		    dispose = d;
		    return resolveSSRNode(escape(code()));
		  });
		  function doShell() {
		    solidJs.sharedConfig.context = context;
		    context.noHydrate = true;
		    html = injectAssets(context.assets, html);
		    for (const key in context.resources) {
		      if (!("data" in context.resources[key] || context.resources[key].ref[0].error)) pushTask(`_$HY.init("${key}")`);
		    }
		    for (const key of registry.keys()) pushTask(`_$HY.init("${key}")`);
		    if (tasks.length) html = injectScripts(html, tasks, nonce);
		    buffer.write(html);
		    tasks = "";
		    scheduled = false;
		    onCompleteShell && onCompleteShell({
		      write(v) {
		        !completed && buffer.write(v);
		      }
		    });
		  }
		  return {
		    then(fn) {
		      function complete() {
		        doShell();
		        fn(tmp);
		      }
		      if (onCompleteAll) {
		        ogComplete = onCompleteAll;
		        onCompleteAll = options => {
		          ogComplete(options);
		          complete();
		        };
		      } else onCompleteAll = complete;
		      if (!registry.size) Promise.resolve().then(checkEnd);
		    },
		    pipe(w) {
		      Promise.allSettled(blockingResources).then(() => {
		        doShell();
		        buffer = writable = w;
		        buffer.write(tmp);
		        firstFlushed = true;
		        if (completed) writable.end();else setTimeout(checkEnd);
		      });
		    },
		    pipeTo(w) {
		      Promise.allSettled(blockingResources).then(() => {
		        doShell();
		        const encoder = new TextEncoder();
		        const writer = w.getWriter();
		        writable = {
		          end() {
		            writer.releaseLock();
		            w.close();
		          }
		        };
		        buffer = {
		          write(payload) {
		            writer.write(encoder.encode(payload));
		          }
		        };
		        buffer.write(tmp);
		        firstFlushed = true;
		        if (completed) writable.end();else setTimeout(checkEnd);
		      });
		    }
		  };
		}
		function HydrationScript(props) {
		  const {
		    nonce
		  } = solidJs.sharedConfig.context;
		  return ssr(generateHydrationScript({
		    nonce,
		    ...props
		  }));
		}
		function ssr(t, ...nodes) {
		  if (nodes.length) {
		    let result = "";
		    for (let i = 0; i < nodes.length; i++) {
		      result += t[i];
		      const node = nodes[i];
		      if (node !== undefined) result += resolveSSRNode(node);
		    }
		    t = result + t[nodes.length];
		  }
		  return {
		    t
		  };
		}
		function ssrClassList(value) {
		  if (!value) return "";
		  let classKeys = Object.keys(value),
		    result = "";
		  for (let i = 0, len = classKeys.length; i < len; i++) {
		    const key = classKeys[i],
		      classValue = !!value[key];
		    if (!key || key === "undefined" || !classValue) continue;
		    i && (result += " ");
		    result += key;
		  }
		  return result;
		}
		function ssrStyle(value) {
		  if (!value) return "";
		  if (typeof value === "string") return value;
		  let result = "";
		  const k = Object.keys(value);
		  for (let i = 0; i < k.length; i++) {
		    const s = k[i];
		    const v = value[s];
		    if (v != undefined) {
		      if (i) result += ";";
		      result += `${s}:${escape(v, true)}`;
		    }
		  }
		  return result;
		}
		function ssrElement(tag, props, children, needsId) {
		  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
		  const skipChildren = VOID_ELEMENTS.test(tag);
		  if (props == null) props = {};else if (typeof props === "function") props = props();
		  const keys = Object.keys(props);
		  let classResolved;
		  for (let i = 0; i < keys.length; i++) {
		    const prop = keys[i];
		    if (ChildProperties.has(prop)) {
		      if (children === undefined && !skipChildren) children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
		      continue;
		    }
		    const value = props[prop];
		    if (prop === "style") {
		      result += `style="${ssrStyle(value)}"`;
		    } else if (prop === "class" || prop === "className" || prop === "classList") {
		      if (classResolved) continue;
		      let n;
		      result += `class="${(n = props.class) ? n + " " : ""}${(n = props.className) ? n + " " : ""}${ssrClassList(props.classList)}"`;
		      classResolved = true;
		    } else if (BooleanAttributes.has(prop)) {
		      if (value) result += prop;else continue;
		    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
		      continue;
		    } else {
		      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
		    }
		    if (i !== keys.length - 1) result += " ";
		  }
		  if (skipChildren) {
		    return {
		      t: result + '/>'
		    };
		  }
		  return {
		    t: result + `>${resolveSSRNode(children)}</${tag}>`
		  };
		}
		function ssrAttribute(key, value, isBoolean) {
		  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
		}
		function ssrHydrationKey() {
		  const hk = getHydrationKey();
		  return hk ? ` data-hk="${hk}"` : "";
		}
		function escape(s, attr) {
		  const t = typeof s;
		  if (t !== "string") {
		    if (!attr && t === "function") return escape(s(), attr);
		    if (!attr && Array.isArray(s)) {
		      let r = "";
		      for (let i = 0; i < s.length; i++) r += resolveSSRNode(escape(s[i], attr));
		      return {
		        t: r
		      };
		    }
		    if (attr && t === "boolean") return String(s);
		    return s;
		  }
		  const delim = attr ? '"' : "<";
		  const escDelim = attr ? "&quot;" : "&lt;";
		  let iDelim = s.indexOf(delim);
		  let iAmp = s.indexOf("&");
		  if (iDelim < 0 && iAmp < 0) return s;
		  let left = 0,
		    out = "";
		  while (iDelim >= 0 && iAmp >= 0) {
		    if (iDelim < iAmp) {
		      if (left < iDelim) out += s.substring(left, iDelim);
		      out += escDelim;
		      left = iDelim + 1;
		      iDelim = s.indexOf(delim, left);
		    } else {
		      if (left < iAmp) out += s.substring(left, iAmp);
		      out += "&amp;";
		      left = iAmp + 1;
		      iAmp = s.indexOf("&", left);
		    }
		  }
		  if (iDelim >= 0) {
		    do {
		      if (left < iDelim) out += s.substring(left, iDelim);
		      out += escDelim;
		      left = iDelim + 1;
		      iDelim = s.indexOf(delim, left);
		    } while (iDelim >= 0);
		  } else while (iAmp >= 0) {
		    if (left < iAmp) out += s.substring(left, iAmp);
		    out += "&amp;";
		    left = iAmp + 1;
		    iAmp = s.indexOf("&", left);
		  }
		  return left < s.length ? out + s.substring(left) : out;
		}
		function resolveSSRNode(node) {
		  const t = typeof node;
		  if (t === "string") return node;
		  if (node == null || t === "boolean") return "";
		  if (Array.isArray(node)) {
		    let mapped = "";
		    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode(node[i]);
		    return mapped;
		  }
		  if (t === "object") return node.t;
		  if (t === "function") return resolveSSRNode(node());
		  return String(node);
		}
		function getHydrationKey() {
		  const hydrate = solidJs.sharedConfig.context;
		  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
		}
		function useAssets(fn) {
		  solidJs.sharedConfig.context.assets.push(() => resolveSSRNode(fn()));
		}
		function getAssets() {
		  const assets = solidJs.sharedConfig.context.assets;
		  let out = "";
		  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
		  return out;
		}
		function generateHydrationScript({
		  eventNames = ["click", "input"],
		  nonce
		} = {}) {
		  return `<script${nonce ? ` nonce="${nonce}"` : ""}>(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host instanceof Node?e.host:e.parentNode));["${eventNames.join('", "')}"].forEach((o=>document.addEventListener(o,(o=>{let s=o.composedPath&&o.composedPath()[0]||o.target,a=t(s);a&&!e.completed.has(a)&&e.events.push([a,o])}))))})(window._$HY||(_$HY={events:[],completed:new WeakSet,r:{},fe(){},init(e,t){_$HY.r[e]=[new Promise((e=>t=e)),t]},set(e,t,o){(o=_$HY.r[e])&&o[1](t),_$HY.r[e]=[t]},unset(e){delete _$HY.r[e]},load:e=>_$HY.r[e]}));</script><!--xs-->`;
		}
		function Hydration(props) {
		  if (!solidJs.sharedConfig.context.noHydrate) return props.children;
		  const context = solidJs.sharedConfig.context;
		  solidJs.sharedConfig.context = {
		    ...context,
		    count: 0,
		    id: `${context.id}${context.count++}-`,
		    noHydrate: false
		  };
		  const res = props.children;
		  solidJs.sharedConfig.context = context;
		  return res;
		}
		function NoHydration(props) {
		  solidJs.sharedConfig.context.noHydrate = true;
		  return props.children;
		}
		function injectAssets(assets, html) {
		  if (!assets || !assets.length) return html;
		  let out = "";
		  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
		  return html.replace(`</head>`, out + `</head>`);
		}
		function injectScripts(html, scripts, nonce) {
		  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
		  const index = html.indexOf("<!--xs-->");
		  if (index > -1) {
		    return html.slice(0, index) + tag + html.slice(index);
		  }
		  return html + tag;
		}
		function serializeError(error) {
		  if (error.message) {
		    const fields = {};
		    const keys = Object.getOwnPropertyNames(error);
		    for (let i = 0; i < keys.length; i++) {
		      const key = keys[i];
		      const value = error[key];
		      if (!value || key !== "message" && typeof value !== "function") {
		        fields[key] = value;
		      }
		    }
		    return `Object.assign(new Error(${stringify(error.message)}), ${stringify(fields)})`;
		  }
		  return stringify(error);
		}
		function waitForFragments(registry, key) {
		  for (const k of [...registry.keys()].reverse()) {
		    if (key.startsWith(k)) {
		      registry.get(k).push(key);
		      return true;
		    }
		  }
		  return false;
		}
		function serializeSet(registry, key, value, serializer = stringify) {
		  const exist = registry.get(value);
		  if (exist) return `_$HY.set("${key}", _$HY.r["${exist}"][0])`;
		  value !== null && typeof value === "object" && registry.set(value, key);
		  return `_$HY.set("${key}", ${serializer(value)})`;
		}
		function replacePlaceholder(html, key, value) {
		  const marker = `<template id="pl-${key}">`;
		  const close = `<!pl-${key}>`;
		  const first = html.indexOf(marker);
		  if (first === -1) return html;
		  const last = html.indexOf(close, first + marker.length);
		  return html.slice(0, first) + value + html.slice(last + close.length);
		}
		function Assets(props) {
		  useAssets(() => props.children);
		}
		function pipeToNodeWritable(code, writable, options = {}) {
		  if (options.onReady) {
		    options.onCompleteShell = ({
		      write
		    }) => {
		      options.onReady({
		        write,
		        startWriting() {
		          stream.pipe(writable);
		        }
		      });
		    };
		  }
		  const stream = renderToStream(code, options);
		  if (!options.onReady) stream.pipe(writable);
		}
		function pipeToWritable(code, writable, options = {}) {
		  if (options.onReady) {
		    options.onCompleteShell = ({
		      write
		    }) => {
		      options.onReady({
		        write,
		        startWriting() {
		          stream.pipeTo(writable);
		        }
		      });
		    };
		  }
		  const stream = renderToStream(code, options);
		  if (!options.onReady) stream.pipeTo(writable);
		}
		function ssrSpread(props, isSVG, skipChildren) {
		  let result = "";
		  if (props == null) return result;
		  if (typeof props === "function") props = props();
		  const keys = Object.keys(props);
		  let classResolved;
		  for (let i = 0; i < keys.length; i++) {
		    const prop = keys[i];
		    if (prop === "children") {
		      !skipChildren && console.warn(`SSR currently does not support spread children.`);
		      continue;
		    }
		    const value = props[prop];
		    if (prop === "style") {
		      result += `style="${ssrStyle(value)}"`;
		    } else if (prop === "class" || prop === "className" || prop === "classList") {
		      if (classResolved) continue;
		      let n;
		      result += `class="${(n = props.class) ? n + " " : ""}${(n = props.className) ? n + " " : ""}${ssrClassList(props.classList)}"`;
		      classResolved = true;
		    } else if (BooleanAttributes.has(prop)) {
		      if (value) result += prop;else continue;
		    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
		      continue;
		    } else {
		      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
		    }
		    if (i !== keys.length - 1) result += " ";
		  }
		  return result;
		}

		const isServer = true;
		const isDev = false;
		function render() {}
		function hydrate() {}
		function insert() {}
		function spread() {}
		function addEventListener() {}
		function delegateEvents() {}
		function Dynamic(props) {
		  const [p, others] = solidJs.splitProps(props, ["component"]);
		  const comp = p.component,
		    t = typeof comp;
		  if (comp) {
		    if (t === "function") return comp(others);else if (t === "string") {
		      return ssrElement(comp, others, undefined, true);
		    }
		  }
		}
		function Portal(props) {
		  return "";
		}

		Object.defineProperty(exports, 'ErrorBoundary', {
		  enumerable: true,
		  get: function () { return solidJs.ErrorBoundary; }
		});
		Object.defineProperty(exports, 'For', {
		  enumerable: true,
		  get: function () { return solidJs.For; }
		});
		Object.defineProperty(exports, 'Index', {
		  enumerable: true,
		  get: function () { return solidJs.Index; }
		});
		Object.defineProperty(exports, 'Match', {
		  enumerable: true,
		  get: function () { return solidJs.Match; }
		});
		Object.defineProperty(exports, 'Show', {
		  enumerable: true,
		  get: function () { return solidJs.Show; }
		});
		Object.defineProperty(exports, 'Suspense', {
		  enumerable: true,
		  get: function () { return solidJs.Suspense; }
		});
		Object.defineProperty(exports, 'SuspenseList', {
		  enumerable: true,
		  get: function () { return solidJs.SuspenseList; }
		});
		Object.defineProperty(exports, 'Switch', {
		  enumerable: true,
		  get: function () { return solidJs.Switch; }
		});
		Object.defineProperty(exports, 'createComponent', {
		  enumerable: true,
		  get: function () { return solidJs.createComponent; }
		});
		Object.defineProperty(exports, 'mergeProps', {
		  enumerable: true,
		  get: function () { return solidJs.mergeProps; }
		});
		exports.Assets = Assets;
		exports.Dynamic = Dynamic;
		exports.Hydration = Hydration;
		exports.HydrationScript = HydrationScript;
		exports.NoHydration = NoHydration;
		exports.Portal = Portal;
		exports.addEventListener = addEventListener;
		exports.delegateEvents = delegateEvents;
		exports.escape = escape;
		exports.generateHydrationScript = generateHydrationScript;
		exports.getAssets = getAssets;
		exports.getHydrationKey = getHydrationKey;
		exports.hydrate = hydrate;
		exports.insert = insert;
		exports.isDev = isDev;
		exports.isServer = isServer;
		exports.pipeToNodeWritable = pipeToNodeWritable;
		exports.pipeToWritable = pipeToWritable;
		exports.render = render;
		exports.renderToStream = renderToStream;
		exports.renderToString = renderToString;
		exports.renderToStringAsync = renderToStringAsync;
		exports.resolveSSRNode = resolveSSRNode;
		exports.spread = spread;
		exports.ssr = ssr;
		exports.ssrAttribute = ssrAttribute;
		exports.ssrClassList = ssrClassList;
		exports.ssrElement = ssrElement;
		exports.ssrHydrationKey = ssrHydrationKey;
		exports.ssrSpread = ssrSpread;
		exports.ssrStyle = ssrStyle;
		exports.stringify = stringify;
		exports.useAssets = useAssets;
} (server$2));
	return server$2;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;

	Object.defineProperty(lib, '__esModule', { value: true });

	var web = requireServer();

	const _tmpl$ = ["<svg", " fill=\"currentColor\" stroke-width=\"0\" style=\"", "\" ", " xmlns=\"http://www.w3.org/2000/svg\">", "", "</svg>"],
	      _tmpl$2 = ["<title>", "</title>"];
	function IconTemplate(iconSrc, props) {
	  const mergedProps = web.mergeProps(iconSrc.a, props);
	  return web.ssr(_tmpl$, web.ssrAttribute("stroke", web.escape(iconSrc.a.stroke, true), false), web.ssrStyle({ ...props.style,
	    overflow: "visible",
	    color: props.color || "currentColor"
	  }), web.ssrSpread(mergedProps, true, true) + web.ssrAttribute("height", web.escape(props.size, true) || "1em", false) + web.ssrAttribute("width", web.escape(props.size, true) || "1em", false), web.isServer && iconSrc.c, props.title && web.ssr(_tmpl$2, web.escape(props.title)));
	}

	lib.IconTemplate = IconTemplate;
	return lib;
}

var hasRequiredVs;

function requireVs () {
	if (hasRequiredVs) return vs;
	hasRequiredVs = 1;
	var IconTemplate = requireLib().IconTemplate;
	  vs.VsAccount = function VsAccount(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M16 7.992C16 3.58 12.416 0 8 0S0 3.58 0 7.992c0 2.43 1.104 4.62 2.832 6.09.016.016.032.016.032.032.144.112.288.224.448.336.08.048.144.111.224.175A7.98 7.98 0 008.016 16a7.98 7.98 0 004.48-1.375c.08-.048.144-.111.224-.16.144-.111.304-.223.448-.335.016-.016.032-.016.032-.032 1.696-1.487 2.8-3.676 2.8-6.106zm-8 7.001c-1.504 0-2.88-.48-4.016-1.279.016-.128.048-.255.08-.383a4.17 4.17 0 01.416-.991c.176-.304.384-.576.64-.816.24-.24.528-.463.816-.639.304-.176.624-.304.976-.4A4.15 4.15 0 018 10.342a4.185 4.185 0 012.928 1.166c.368.368.656.8.864 1.295.112.288.192.592.24.911A7.03 7.03 0 018 14.993zm-2.448-7.4a2.49 2.49 0 01-.208-1.024c0-.351.064-.703.208-1.023.144-.32.336-.607.576-.847.24-.24.528-.431.848-.575.32-.144.672-.208 1.024-.208.368 0 .704.064 1.024.208.32.144.608.336.848.575.24.24.432.528.576.847.144.32.208.672.208 1.023 0 .368-.064.704-.208 1.023a2.84 2.84 0 01-.576.848 2.84 2.84 0 01-.848.575 2.715 2.715 0 01-2.064 0 2.84 2.84 0 01-.848-.575 2.526 2.526 0 01-.56-.848zm7.424 5.306c0-.032-.016-.048-.016-.08a5.22 5.22 0 00-.688-1.406 4.883 4.883 0 00-1.088-1.135 5.207 5.207 0 00-1.04-.608 2.82 2.82 0 00.464-.383 4.2 4.2 0 00.624-.784 3.624 3.624 0 00.528-1.934 3.71 3.71 0 00-.288-1.47 3.799 3.799 0 00-.816-1.199 3.845 3.845 0 00-1.2-.8 3.72 3.72 0 00-1.472-.287 3.72 3.72 0 00-1.472.288 3.631 3.631 0 00-1.2.815 3.84 3.84 0 00-.8 1.199 3.71 3.71 0 00-.288 1.47c0 .352.048.688.144 1.007.096.336.224.64.4.927.16.288.384.544.624.784.144.144.304.271.48.383a5.12 5.12 0 00-1.04.624c-.416.32-.784.703-1.088 1.119a4.999 4.999 0 00-.688 1.406c-.016.032-.016.064-.016.08C1.776 11.636.992 9.91.992 7.992.992 4.14 4.144.991 8 .991s7.008 3.149 7.008 7.001a6.96 6.96 0 01-2.032 4.907z"/>'
	      }, props)
	  };
	  vs.VsActivateBreakpoints = function VsActivateBreakpoints(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 5.5a4.394 4.394 0 01-4 4.5 2.955 2.955 0 00-.2-1A3.565 3.565 0 0014 5.5a3.507 3.507 0 00-7-.3A3.552 3.552 0 006 5a4.622 4.622 0 014.5-4A4.481 4.481 0 0115 5.5zM5.5 6a4.5 4.5 0 100 9.001 4.5 4.5 0 000-9z"/>'
	      }, props)
	  };
	  vs.VsAdd = function VsAdd(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"/>'
	      }, props)
	  };
	  vs.VsArchive = function VsArchive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 1h-13l-.5.5v3l.5.5H2v8.5l.5.5h11l.5-.5V5h.5l.5-.5v-3l-.5-.5zm-1 3H2V2h12v2h-.5zM3 13V5h10v8H3zm8-6H5v1h6V7z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowBoth = function VsArrowBoth(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3 9l2.146 2.146-.707.708-3-3v-.708l3-3 .707.708L3 8h10l-2.146-2.146.707-.708 3 3v.708l-3 3-.707-.707L13 9H3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowCircleDown = function VsArrowCircleDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5.369 8.08l2.14 2.14V4.468h1v5.68l2.066-2.067.707.707-2.957 2.956h-.707L4.662 8.788l.707-.707z"/><path d="M14 8A6 6 0 102 8a6 6 0 0012 0zm-1 0A5 5 0 113 8a5 5 0 0110 0z"/>'
	      }, props)
	  };
	  vs.VsArrowCircleLeft = function VsArrowCircleLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.92 10.631l-2.14-2.14h5.752v-1h-5.68L7.92 5.426l-.707-.707-2.956 2.957v.707l2.956 2.956.707-.707z"/><path d="M8 2a6 6 0 110 12A6 6 0 018 2zm0 1a5 5 0 100 10A5 5 0 008 3z"/>'
	      }, props)
	  };
	  vs.VsArrowCircleRight = function VsArrowCircleRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.08 5.369l2.14 2.14H4.468v1h5.68L8.08 10.574l.707.707 2.956-2.957v-.707L8.788 4.662l-.707.707z"/><path d="M8 14A6 6 0 118 2a6 6 0 010 12zm0-1A5 5 0 108 3a5 5 0 000 10z"/>'
	      }, props)
	  };
	  vs.VsArrowCircleUp = function VsArrowCircleUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5.369 7.92l2.14-2.14v5.752h1v-5.68l2.066 2.067.707-.707-2.957-2.956h-.707L4.662 7.212l.707.707z"/><path d="M14 8A6 6 0 112 8a6 6 0 0112 0zm-1 0A5 5 0 103 8a5 5 0 0010 0z"/>'
	      }, props)
	  };
	  vs.VsArrowDown = function VsArrowDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.147 9l5 5h.707l5-5-.707-.707L9 12.439V2H8v10.44L3.854 8.292 3.147 9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowLeft = function VsArrowLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7 3.093l-5 5V8.8l5 5 .707-.707-4.146-4.147H14v-1H3.56L7.708 3.8 7 3.093z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowRight = function VsArrowRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9 13.887l5-5V8.18l-5-5-.707.707 4.146 4.147H2v1h10.44L8.292 13.18l.707.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowSmallDown = function VsArrowSmallDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10.7 8.64l-2.5 2.5h-.7L5 8.64l.7-.71 1.65 1.64V4h1v5.57L10 7.92l.7.72z"/>'
	      }, props)
	  };
	  vs.VsArrowSmallLeft = function VsArrowSmallLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6.5 10.7L4 8.2v-.7L6.5 5l.71.7-1.64 1.65h5.57v1H5.57L7.22 10l-.72.7z"/>'
	      }, props)
	  };
	  vs.VsArrowSmallRight = function VsArrowSmallRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.64 5l2.5 2.5v.7l-2.5 2.5-.71-.7 1.64-1.65H4v-1h5.57L7.92 5.7l.72-.7z"/>'
	      }, props)
	  };
	  vs.VsArrowSmallUp = function VsArrowSmallUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5 6.5L7.5 4h.7l2.5 2.5-.7.71-1.65-1.64v5.57h-1V5.57L5.7 7.22 5 6.5z"/>'
	      }, props)
	  };
	  vs.VsArrowSwap = function VsArrowSwap(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.207 15.061L1 11.854v-.707L4.207 7.94l.707.707-2.353 2.354H15v1H2.56l2.354 2.353-.707.707zm7.586-7L15 4.854v-.707L11.793.94l-.707.707L13.439 4H1v1h12.44l-2.354 2.354.707.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsArrowUp = function VsArrowUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.854 7l-5-5h-.707l-5 5 .707.707L8 3.561V14h1V3.56l4.146 4.147.708-.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsAzureDevops = function VsAzureDevops(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 3.622v8.512L11.5 15l-5.425-1.975v1.957l-3.071-4.01 8.951.698V4.006L15 3.622zm-2.984.428L6.994 1v2.001L2.383 4.356 1 6.13v4.029l1.978.873V5.869l9.038-1.818z"/>'
	      }, props)
	  };
	  vs.VsAzure = function VsAzure(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M15.37 13.68l-4-12a1 1 0 00-1-.68H5.63a1 1 0 00-.95.68l-4.05 12a1 1 0 001 1.32h2.93a1 1 0 00.94-.68l.61-1.78 3 2.27a1 1 0 00.6.19h4.68a1 1 0 00.98-1.32zm-5.62.66a.32.32 0 01-.2-.07L3.9 10.08l-.09-.07h3l.08-.21 1-2.53 2.24 6.63a.34.34 0 01-.38.44zm4.67 0H10.7a1 1 0 000-.66l-4.05-12h3.72a.34.34 0 01.32.23l4.05 12a.34.34 0 01-.32.43z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsBeakerStop = function VsBeakerStop(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3 15.006h5.007a5.03 5.03 0 01-.998-.993L3 14.017l1.542-3.011H6V11c0-.34.034-.673.099-.994h-1.05l1.844-3.598L7 6.193V2.036l2-.024v4.237l.07.137c.31-.13.636-.23.974-.295L10 6.006v-4h1v-1H9.994V1l-.456.005H5V2h1v3.952l-3.894 7.609A1 1 0 003 15.006zm5.778-7.332a4 4 0 114.444 6.652 4 4 0 01-4.444-6.652zm.1 5.447A3 3 0 0011 14a3 3 0 001.74-.55L8.55 9.26A3 3 0 008 11a3 3 0 00.879 2.121zm.382-4.57l4.19 4.189A3 3 0 0014 11a3 3 0 00-3-3 3 3 0 00-1.74.55z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsBeaker = function VsBeaker(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.893 13.558L10 6.006v-4h1v-1H9.994V1l-.456.005H5V2h1v3.952l-3.894 7.609A1 1 0 003 15.006h10a1 1 0 00.893-1.448zm-7-7.15L7 6.193V2.036l2-.024v4.237l.11.215 1.827 3.542H5.049l1.844-3.598zM3 14.017l1.54-3.011h6.916l1.547 3L3 14.017z"/>'
	      }, props)
	  };
	  vs.VsBellDot = function VsBellDot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.994 7.875A4.008 4.008 0 0112 8h-.01v.217c0 .909.143 1.818.442 2.691l.371 1.113h-9.63v-.012l.37-1.113a8.633 8.633 0 00.443-2.691V6.004c0-.563.12-1.113.347-1.616.227-.514.55-.969.969-1.34.419-.382.91-.67 1.436-.837.538-.18 1.1-.24 1.65-.18l.12.018c.182-.327.41-.625.673-.887a5.15 5.15 0 00-.697-.135c-.694-.072-1.4 0-2.07.227-.67.215-1.28.574-1.794 1.053a4.923 4.923 0 00-1.208 1.675 5.067 5.067 0 00-.431 2.022v2.2a7.61 7.61 0 01-.383 2.37L2 12.343l.479.658h3.505c0 .526.215 1.04.586 1.412.37.37.885.586 1.412.586.526 0 1.04-.215 1.411-.586s.587-.886.587-1.412h3.505l.478-.658-.586-1.77a7.63 7.63 0 01-.383-2.381v-.318zM7.982 14.02a.997.997 0 00.706-.3.939.939 0 00.287-.705H6.977c0 .263.107.514.299.706.191.191.443.299.706.299z" clip-rule="evenodd"/><path d="M12 7a3 3 0 100-6 3 3 0 000 6z"/>'
	      }, props)
	  };
	  vs.VsBellSlashDot = function VsBellSlashDot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.617 1.045c-.335.28-.628.607-.87.97-.34.02-.68.086-1.01.196a3.877 3.877 0 00-1.435.838c-.419.37-.742.825-.97 1.34a3.918 3.918 0 00-.346 1.615v2.2c0 .616-.071 1.23-.206 1.834L2.268 11.55l.33-.977a7.61 7.61 0 00.383-2.368V6.004c0-.706.156-1.388.43-2.022A4.923 4.923 0 014.62 2.307a4.777 4.777 0 011.795-1.053 4.874 4.874 0 012.202-.21zm4.397 7.694a4.475 4.475 0 01-.991.231c.058.656.193 1.307.41 1.938l.37 1.113H6.318l-.98.981h.646c0 .526.215 1.04.586 1.412.37.37.885.586 1.412.586.526 0 1.04-.215 1.411-.586s.587-.886.587-1.412h3.505l.478-.658-.586-1.77a7.655 7.655 0 01-.363-1.835zm-4.326 4.98a.997.997 0 01-.706.3.997.997 0 01-.706-.3.997.997 0 01-.3-.705h1.999a.939.939 0 01-.287.706zM15.249 1.666a4.024 4.024 0 00-.682-.733l.575-.575.707.707-.6.6zM8.933 6.567L1 14.5l.707.707L9.666 7.25a4.023 4.023 0 01-.733-.682z" clip-rule="evenodd"/><path d="M12 7a3 3 0 100-6 3 3 0 000 6z"/>'
	      }, props)
	  };
	  vs.VsBellSlash = function VsBellSlash(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.027 2.086a5.128 5.128 0 00-2.543-1.06c-.694-.071-1.4 0-2.07.228-.67.215-1.28.574-1.794 1.053a4.923 4.923 0 00-1.208 1.675 5.067 5.067 0 00-.431 2.022v2.2c0 .772-.122 1.543-.355 2.282l1.3-1.3c.04-.326.06-.654.06-.981V6.004c0-.563.12-1.113.347-1.616.227-.514.55-.969.969-1.34.419-.382.91-.67 1.436-.837.538-.18 1.1-.24 1.65-.18.697.092 1.36.362 1.92.774l.719-.72zM7.024 12.02h5.779l-.37-1.113a8.298 8.298 0 01-.444-2.691V7.055l1.005-1.004v2.142c0 .813.132 1.615.383 2.38l.586 1.771-.478.658H9.98c0 .526-.216 1.04-.587 1.412-.37.37-.885.586-1.411.586-.527 0-1.041-.215-1.412-.586a2.014 2.014 0 01-.585-1.354l1.039-1.039zm.958 1.998a.997.997 0 00.706-.3.939.939 0 00.287-.705H6.977c0 .263.107.514.299.706.191.191.442.299.706.299z" clip-rule="evenodd"/><path d="M1 14.5L15.142.358l.707.707L1.707 15.207z"/>'
	      }, props)
	  };
	  vs.VsBell = function VsBell(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.377 10.573a7.63 7.63 0 01-.383-2.38V6.195a5.115 5.115 0 00-1.268-3.446 5.138 5.138 0 00-3.242-1.722c-.694-.072-1.4 0-2.07.227-.67.215-1.28.574-1.794 1.053a4.923 4.923 0 00-1.208 1.675 5.067 5.067 0 00-.431 2.022v2.2a7.61 7.61 0 01-.383 2.37L2 12.343l.479.658h3.505c0 .526.215 1.04.586 1.412.37.37.885.586 1.412.586.526 0 1.04-.215 1.411-.586s.587-.886.587-1.412h3.505l.478-.658-.586-1.77zm-4.69 3.147a.997.997 0 01-.705.299.997.997 0 01-.706-.3.997.997 0 01-.3-.705h1.999a.939.939 0 01-.287.706zm-5.515-1.71l.371-1.114a8.633 8.633 0 00.443-2.691V6.004c0-.563.12-1.113.347-1.616.227-.514.55-.969.969-1.34.419-.382.91-.67 1.436-.837.538-.18 1.1-.24 1.65-.18a4.147 4.147 0 012.597 1.4 4.133 4.133 0 011.004 2.776v2.01c0 .909.144 1.818.443 2.691l.371 1.113h-9.63v-.012z"/>'
	      }, props)
	  };
	  vs.VsBlank = function VsBlank(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: ''
	      }, props)
	  };
	  vs.VsBold = function VsBold(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5 13V3h3.362c1.116 0 1.954.224 2.515.673.565.449.848 1.113.848 1.992 0 .467-.137.881-.41 1.243-.273.357-.645.634-1.116.831.556.151.993.44 1.314.865.325.422.487.925.487 1.511 0 .898-.299 1.603-.897 2.116-.598.513-1.443.769-2.536.769H5zm1.356-4.677v3.599h2.24c.63 0 1.127-.158 1.49-.474.367-.32.55-.76.55-1.319 0-1.204-.673-1.806-2.02-1.806h-2.26zm0-1.058h2.049c.593 0 1.066-.144 1.42-.433.357-.288.536-.68.536-1.174 0-.55-.165-.948-.494-1.195-.33-.252-.831-.378-1.505-.378H6.356v3.18z"/>'
	      }, props)
	  };
	  vs.VsBook = function VsBook(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 2H9l-.35.15-.65.64-.65-.64L7 2H1.5l-.5.5v10l.5.5h5.29l.86.85h.7l.86-.85h5.29l.5-.5v-10l-.5-.5zm-7 10.32l-.18-.17L7 12H2V3h4.79l.74.74-.03 8.58zM14 12H9l-.35.15-.14.13V3.7l.7-.7H14v9zM6 5H3v1h3V5zm0 4H3v1h3V9zM3 7h3v1H3V7zm10-2h-3v1h3V5zm-3 2h3v1h-3V7zm0 2h3v1h-3V9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsBookmark = function VsBookmark(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M12.5 1h-9l-.5.5v13l.872.335L8 10.247l4.128 4.588L13 14.5v-13l-.5-.5zM12 13.2L8.372 9.165h-.744L4 13.2V2h8v11.2z"/>'
	      }, props)
	  };
	  vs.VsBracketDot = function VsBracketDot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 2.972v.012h-.09c-.199 0-.386.04-.562.121a1.468 1.468 0 00-.457.32 1.47 1.47 0 00-.42 1.035c0 .227.004.453.012.677.008.224.008.446 0 .665a4.751 4.751 0 01-.055.64c-.033.21-.089.41-.168.603A2.284 2.284 0 013.522 8a2.284 2.284 0 01.738.955c.08.193.135.395.168.608.033.206.051.42.055.64.008.216.008.438 0 .666-.008.22-.012.444-.012.672 0 .203.037.394.111.573.079.177.182.333.309.468.13.13.283.237.457.319.175.077.363.115.563.115H6V14h-.09c-.313 0-.616-.062-.909-.185a2.33 2.33 0 01-.775-.53 2.23 2.23 0 01-.493-.753v-.001a3.54 3.54 0 01-.198-.824v-.002a6.186 6.186 0 01-.024-.87c.012-.289.018-.578.018-.868 0-.198-.04-.387-.117-.566V9.4a1.414 1.414 0 00-.308-.465l-.002-.002a1.377 1.377 0 00-.455-.318h-.001a1.316 1.316 0 00-.557-.122H2v-.984h.09c.195 0 .38-.038.557-.115a1.504 1.504 0 00.765-.786v-.002c.078-.18.117-.37.117-.572 0-.29-.006-.58-.018-.869a6.08 6.08 0 01.024-.863v-.002c.033-.287.099-.564.197-.83v-.001a2.23 2.23 0 01.494-.753A2.33 2.33 0 015 2.185c.293-.123.596-.185.91-.185H6v.972zm7.923 5.52H14v-.984h-.09c-.195 0-.38-.04-.556-.121l-.001-.001a1.376 1.376 0 01-.455-.318l-.002-.002a1.414 1.414 0 01-.307-.465l-.001-.002a1.405 1.405 0 01-.117-.566c0-.29.006-.58.018-.869a6.19 6.19 0 00-.024-.87v-.001a3.542 3.542 0 00-.197-.824v-.001a2.23 2.23 0 00-.494-.753 2.33 2.33 0 00-.775-.53 2.325 2.325 0 00-.91-.185H10v.984h.09c.2 0 .386.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.282 2.282 0 00.738.955l-.032.025c.53.058 1.03.221 1.477.467z" clip-rule="evenodd"/><path d="M12 9a3 3 0 100 6 3 3 0 000-6z"/>'
	      }, props)
	  };
	  vs.VsBracketError = function VsBracketError(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 2.972v.012h-.09c-.199 0-.386.04-.562.121a1.468 1.468 0 00-.457.32 1.47 1.47 0 00-.42 1.035c0 .227.004.453.012.677.008.224.008.446 0 .665a4.751 4.751 0 01-.055.64c-.033.21-.089.41-.168.603A2.284 2.284 0 013.522 8a2.284 2.284 0 01.738.955c.08.193.135.395.168.608.033.206.051.42.055.64.008.216.008.438 0 .666-.008.22-.012.444-.012.672 0 .203.037.394.111.573.079.177.182.333.309.468.13.13.283.237.457.319.175.077.363.115.563.115H6V14h-.09c-.313 0-.616-.062-.909-.185a2.33 2.33 0 01-.775-.53 2.23 2.23 0 01-.493-.753v-.001a3.54 3.54 0 01-.198-.824v-.002a6.186 6.186 0 01-.024-.87c.012-.289.018-.578.018-.868 0-.198-.04-.387-.117-.566V9.4a1.414 1.414 0 00-.308-.465l-.002-.002a1.377 1.377 0 00-.455-.318h-.001a1.316 1.316 0 00-.557-.122H2v-.984h.09c.195 0 .38-.038.557-.115a1.504 1.504 0 00.765-.786v-.002c.078-.18.117-.37.117-.572 0-.29-.006-.58-.018-.869a6.08 6.08 0 01.024-.863v-.002c.033-.287.099-.564.197-.83v-.001a2.23 2.23 0 01.494-.753A2.33 2.33 0 015 2.185c.293-.123.596-.185.91-.185H6v.972zm7.923 5.52H14v-.984h-.09c-.195 0-.38-.04-.556-.121l-.001-.001a1.376 1.376 0 01-.455-.318l-.002-.002a1.414 1.414 0 01-.307-.465l-.001-.002a1.405 1.405 0 01-.117-.566c0-.29.006-.58.018-.869a6.19 6.19 0 00-.024-.87v-.001a3.542 3.542 0 00-.197-.824v-.001a2.23 2.23 0 00-.494-.753 2.33 2.33 0 00-.775-.53 2.325 2.325 0 00-.91-.185H10v.984h.09c.2 0 .386.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.282 2.282 0 00.738.955l-.032.025c.53.058 1.03.221 1.477.467zM10.333 9.506a3 3 0 113.334 4.988 3 3 0 01-3.334-4.988zm2.813.64L12 11.293l-1.146-1.147-.707.707L11.293 12l-1.147 1.146.708.708L12 12.707l1.146 1.146.708-.707L12.707 12l1.147-1.146-.708-.708z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsBriefcase = function VsBriefcase(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 4H11V2.5l-.5-.5h-5l-.5.5V4H1.5l-.5.5v8l.5.5h13l.5-.5v-8l-.5-.5zM6 3h4v1H6V3zm8 2v.76L10 8v-.5L9.51 7h-3L6 7.5V8L2 5.71V5h12zM9 8v1H7V8h2zm-7 4V6.86l4 2.29v.35l.5.5h3l.5-.5v-.31l4-2.28V12H2z"/>'
	      }, props)
	  };
	  vs.VsBroadcast = function VsBroadcast(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4.667 2.011A6 6 0 018 1a6.007 6.007 0 016 6 6 6 0 01-3.996 5.655v-.044c.016-.014.031-.03.046-.045a1.48 1.48 0 00.434-1.046v-.137A5.042 5.042 0 0012.19 4.2a5.04 5.04 0 10-6.69 7.176v.144a1.48 1.48 0 00.48 1.09v.04A5.999 5.999 0 014.667 2.01z"/><path d="M9.343 11.86a.48.48 0 01-.34.14v2.52a.48.48 0 01-.48.48H7.46c.011 0-.004-.004-.034-.012-.075-.02-.241-.064-.305-.129a.48.48 0 01-.141-.34V12a.48.48 0 01-.48-.48V9.5a1 1 0 011-1h.984a1 1 0 011 1v2.02a.48.48 0 01-.137.335l-.004.004z"/><path d="M10.64 7c0 .525-.157 1.034-.445 1.465.183.302.289.656.289 1.035v.106a3.596 3.596 0 00.06-5.15A3.6 3.6 0 105.5 9.59V9.5c0-.384.108-.743.296-1.047A2.64 2.64 0 1110.64 7z"/><path d="M9 7a1 1 0 11-2 0 1 1 0 012 0z"/>'
	      }, props)
	  };
	  vs.VsBrowser = function VsBrowser(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v12l-.5.5h-13l-.5-.5v-12l.5-.5zM2 5v8h12V5H2zm0-1h12V2H2v2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsBug = function VsBug(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.877 4.5v-.582a2.918 2.918 0 10-5.836 0V4.5h-.833L2.545 2.829l-.593.59 1.611 1.619-.019.049a8.03 8.03 0 00-.503 2.831c0 .196.007.39.02.58l.003.045H1v.836h2.169l.006.034c.172.941.504 1.802.954 2.531l.034.055L2.2 13.962l.592.592 1.871-1.872.058.066c.868.992 2.002 1.589 3.238 1.589 1.218 0 2.336-.579 3.199-1.544l.057-.064 1.91 1.92.593-.591-1.996-2.006.035-.056c.467-.74.81-1.619.986-2.583l.006-.034h2.171v-.836h-2.065l.003-.044a8.43 8.43 0 00.02-.58 8.02 8.02 0 00-.517-2.866l-.019-.05 1.57-1.57-.592-.59L11.662 4.5h-.785zm-5 0v-.582a2.082 2.082 0 114.164 0V4.5H5.878zm5.697.837l.02.053c.283.753.447 1.61.447 2.528 0 1.61-.503 3.034-1.274 4.037-.77 1.001-1.771 1.545-2.808 1.545-1.036 0-2.037-.544-2.807-1.545-.772-1.003-1.275-2.427-1.275-4.037 0-.918.164-1.775.448-2.528l.02-.053h7.229z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCalendar = function VsCalendar(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 2H13V1h-1v1H4V1H3v1H1.5l-.5.5v12l.5.5h13l.5-.5v-12l-.5-.5zM14 14H2V5h12v9zm0-10H2V3h12v1zM4 8H3v1h1V8zm-1 2h1v1H3v-1zm1 2H3v1h1v-1zm2-4h1v1H6V8zm1 2H6v1h1v-1zm-1 2h1v1H6v-1zm1-6H6v1h1V6zm2 2h1v1H9V8zm1 2H9v1h1v-1zm-1 2h1v1H9v-1zm1-6H9v1h1V6zm2 2h1v1h-1V8zm1 2h-1v1h1v-1zm-1-4h1v1h-1V6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCallIncoming = function VsCallIncoming(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.547 9.328a1.567 1.567 0 00-.594-.117 1.202 1.202 0 00-.555.101 2.762 2.762 0 00-.43.258 2.166 2.166 0 00-.359.328c-.104.12-.205.23-.304.329a2.409 2.409 0 01-.29.25.534.534 0 01-.695-.063 32.17 32.17 0 01-.328-.312c-.14-.136-.312-.3-.515-.493A61.776 61.776 0 017.844 9l-.68-.664a25.847 25.847 0 01-1.21-1.266 5.312 5.312 0 01-.391-.484c-.094-.135-.141-.234-.141-.297a.46.46 0 01.101-.312c.073-.094.16-.19.258-.29.1-.098.209-.203.328-.312.12-.11.23-.227.329-.352.098-.125.182-.268.25-.43.067-.16.101-.343.101-.546a1.567 1.567 0 00-.453-1.102 7.604 7.604 0 01-.531-.578 6.487 6.487 0 00-.617-.64 4.207 4.207 0 00-.696-.516A1.46 1.46 0 003.742 1a1.567 1.567 0 00-1.101.453c-.271.271-.508.513-.711.727a4.006 4.006 0 00-.516.664 2.63 2.63 0 00-.312.765A4.39 4.39 0 001 4.625c0 .552.089 1.125.266 1.719.177.593.416 1.185.718 1.773.302.589.67 1.167 1.102 1.735.432.567.901 1.106 1.406 1.617.505.51 1.042.982 1.61 1.414.567.432 1.148.805 1.742 1.117.593.313 1.19.557 1.789.734a6.157 6.157 0 001.75.266 4.696 4.696 0 001.008-.11 2.59 2.59 0 00.773-.312c.23-.14.45-.312.664-.515.214-.204.453-.438.719-.704A1.568 1.568 0 0015 12.257a2.009 2.009 0 00-.102-.515 1.674 1.674 0 00-.257-.484 7.24 7.24 0 00-.368-.445 5.381 5.381 0 00-.421-.422 91.549 91.549 0 00-.43-.383 8.277 8.277 0 01-.367-.344 1.516 1.516 0 00-.508-.336zm-.367 4.586a3.13 3.13 0 01-.797.086 5.526 5.526 0 01-1.516-.242 8.362 8.362 0 01-1.586-.664 13.205 13.205 0 01-3.047-2.297 17.15 17.15 0 01-1.289-1.461 10.502 10.502 0 01-1.03-1.578 9.12 9.12 0 01-.673-1.61A5.308 5.308 0 012 4.602a3.34 3.34 0 01.094-.79c.057-.218.143-.414.258-.585.114-.172.255-.339.421-.5.167-.162.357-.35.57-.563a.542.542 0 01.4-.164c.062-.005.158.036.288.125.13.089.271.195.422.32a7.058 7.058 0 01.899.899c.125.15.229.289.312.414.083.125.125.221.125.289a.429.429 0 01-.101.312c-.073.084-.16.18-.258.29-.1.109-.209.213-.328.312-.12.099-.23.216-.329.351a2.266 2.266 0 00-.25.438 1.345 1.345 0 00-.101.54c.005.213.047.413.125.6.078.188.19.355.336.5l3.726 3.727a1.527 1.527 0 001.102.46 1.2 1.2 0 00.547-.1 2.414 2.414 0 00.789-.586c.11-.12.21-.23.305-.329.093-.098.19-.182.289-.25a.545.545 0 01.312-.101c.073 0 .172.042.297.125.125.083.263.19.414.32.151.13.307.274.469.43.161.156.305.312.43.469.124.156.229.297.312.422.083.125.125.22.125.289a.533.533 0 01-.164.39c-.224.219-.414.41-.57.57a3.159 3.159 0 01-.5.422 1.93 1.93 0 01-.586.266zM15 1.704l-4.64 4.648h3.288v1h-5v-5h1V5.64L14.297 1l.703.703z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCallOutgoing = function VsCallOutgoing(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.648 6.648L13.29 2H10V1h5v5h-1V2.71L9.352 7.353l-.704-.704zm3.305 2.563a1.567 1.567 0 011.102.453c.11.11.232.224.367.344l.43.383c.15.135.291.276.421.421.13.146.253.295.368.446.114.15.2.312.257.484.058.172.092.344.102.516a1.568 1.568 0 01-.453 1.101c-.266.266-.505.5-.719.704a4.006 4.006 0 01-.664.515c-.23.14-.487.245-.773.313a4.696 4.696 0 01-1.008.109 6.157 6.157 0 01-1.75-.266A9.819 9.819 0 017.843 14a12.445 12.445 0 01-1.741-1.117 15.329 15.329 0 01-1.61-1.414c-.505-.51-.974-1.05-1.406-1.617a11.64 11.64 0 01-1.102-1.735 10.38 10.38 0 01-.718-1.773A6.005 6.005 0 011 4.625c0-.396.034-.734.102-1.016a2.63 2.63 0 01.312-.765c.14-.23.313-.45.516-.664.203-.214.44-.456.71-.727A1.567 1.567 0 013.743 1c.26 0 .51.07.75.21.24.142.472.313.696.517.223.203.43.416.617.64.187.224.364.417.53.578a1.567 1.567 0 01.453 1.102 1.4 1.4 0 01-.1.547 1.824 1.824 0 01-.25.43 2.983 2.983 0 01-.329.351c-.12.11-.229.214-.328.313a3.128 3.128 0 00-.258.289.46.46 0 00-.101.312c0 .063.047.162.14.297a5.3 5.3 0 00.391.484 24.386 24.386 0 001.211 1.266c.234.23.461.45.68.664.218.214.43.417.633.61.203.192.375.356.515.492.14.135.25.24.328.312a.534.534 0 00.696.063c.093-.068.19-.152.289-.25.099-.1.2-.209.304-.329.104-.12.224-.229.36-.328.135-.099.278-.185.43-.258a1.21 1.21 0 01.554-.101zM11.383 14c.318 0 .583-.029.797-.086a1.93 1.93 0 00.586-.266c.177-.12.343-.26.5-.421.156-.162.346-.352.57-.57.11-.11.164-.24.164-.391 0-.068-.042-.164-.125-.29a6.122 6.122 0 00-.313-.421 5.01 5.01 0 00-.43-.47c-.16-.155-.317-.299-.468-.429a4.322 4.322 0 00-.414-.32c-.125-.083-.224-.125-.297-.125a.545.545 0 00-.312.101 1.801 1.801 0 00-.29.25c-.093.1-.195.209-.304.329-.11.12-.23.229-.36.328-.13.099-.273.185-.43.258a1.208 1.208 0 01-.546.101 1.527 1.527 0 01-1.102-.46L4.883 7.39a1.537 1.537 0 01-.336-.5 1.655 1.655 0 01-.125-.602c0-.203.034-.383.101-.539.068-.156.151-.302.25-.438.1-.135.209-.252.329-.351.12-.099.229-.203.328-.313.099-.109.185-.205.258-.289a.429.429 0 00.101-.312c0-.068-.042-.164-.125-.29a5.085 5.085 0 00-.312-.413 6.791 6.791 0 00-.43-.469 6.787 6.787 0 00-.469-.43 5.674 5.674 0 00-.422-.32c-.13-.089-.226-.13-.289-.125a.542.542 0 00-.398.164 65.24 65.24 0 01-.57.563 3.073 3.073 0 00-.422.5 1.9 1.9 0 00-.258.586A3.377 3.377 0 002 4.601c0 .5.08 1.015.242 1.546a9.12 9.12 0 00.672 1.61c.287.541.63 1.068 1.031 1.578.401.51.831.997 1.29 1.46a13.205 13.205 0 003.046 2.298 8.37 8.37 0 001.586.664 5.526 5.526 0 001.516.242z"/>'
	      }, props)
	  };
	  vs.VsCaseSensitive = function VsCaseSensitive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.854 11.702h-1l-.816-2.159H3.772l-.768 2.16H2L4.954 4h.935l2.965 7.702zm-2.111-2.97L5.534 5.45a3.142 3.142 0 01-.118-.515h-.021c-.036.218-.077.39-.124.515L4.073 8.732h2.67zM13.756 11.702h-.88v-.86h-.022c-.383.66-.947.99-1.692.99-.548 0-.978-.146-1.29-.436-.307-.29-.461-.675-.461-1.155 0-1.027.605-1.625 1.815-1.794l1.65-.23c0-.935-.379-1.403-1.134-1.403-.663 0-1.26.226-1.794.677V6.59c.54-.344 1.164-.516 1.87-.516 1.292 0 1.938.684 1.938 2.052v3.577zm-.88-2.782l-1.327.183c-.409.057-.717.159-.924.306-.208.143-.312.399-.312.768 0 .268.095.489.285.66.193.169.45.253.768.253a1.41 1.41 0 001.08-.457c.286-.308.43-.696.43-1.165V8.92z"/>'
	      }, props)
	  };
	  vs.VsCheckAll = function VsCheckAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M15.62 3.596L7.815 12.81l-.728-.033L4 8.382l.754-.53 2.744 3.907L14.917 3l.703.596z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.234 8.774l4.386-5.178L10.917 3l-4.23 4.994.547.78zm-1.55.403l.548.78-.547-.78zm-1.617 1.91l.547.78-.799.943-.728-.033L0 8.382l.754-.53 2.744 3.907.57-.672z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCheck = function VsCheck(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChecklist = function VsChecklist(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChevronDown = function VsChevronDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChevronLeft = function VsChevronLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.928 7.976l4.357 4.357-.618.62L5 8.284v-.618L9.667 3l.618.619-4.357 4.357z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChevronRight = function VsChevronRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChevronUp = function VsChevronUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.024 5.928l-4.357 4.357-.62-.618L7.716 5h.618L13 9.667l-.619.618-4.357-4.357z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChromeClose = function VsChromeClose(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsChromeMaximize = function VsChromeMaximize(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/>'
	      }, props)
	  };
	  vs.VsChromeMinimize = function VsChromeMinimize(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 8v1H3V8h11z"/>'
	      }, props)
	  };
	  vs.VsChromeRestore = function VsChromeRestore(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3 5v9h9V5H3zm8 8H4V6h7v7z"/><path fill-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCircleFilled = function VsCircleFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 4c.367 0 .721.048 1.063.145a3.943 3.943 0 011.762 1.031 3.944 3.944 0 011.03 1.762c.097.34.145.695.145 1.062 0 .367-.048.721-.145 1.063a3.94 3.94 0 01-1.03 1.765 4.017 4.017 0 01-1.762 1.031C8.72 11.953 8.367 12 8 12s-.721-.047-1.063-.14a4.056 4.056 0 01-1.765-1.032A4.055 4.055 0 014.14 9.062 3.992 3.992 0 014 8c0-.367.047-.721.14-1.063a4.02 4.02 0 01.407-.953A4.089 4.089 0 015.98 4.546a3.94 3.94 0 01.957-.401A3.89 3.89 0 018 4z"/>'
	      }, props)
	  };
	  vs.VsCircleLargeFilled = function VsCircleLargeFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 1a6.8 6.8 0 011.86.253 6.899 6.899 0 013.083 1.805 6.903 6.903 0 011.804 3.083C14.916 6.738 15 7.357 15 8s-.084 1.262-.253 1.86a6.9 6.9 0 01-.704 1.674 7.157 7.157 0 01-2.516 2.509 6.966 6.966 0 01-1.668.71A6.984 6.984 0 018 15a6.984 6.984 0 01-1.86-.246 7.098 7.098 0 01-1.674-.711 7.3 7.3 0 01-1.415-1.094 7.295 7.295 0 01-1.094-1.415 7.098 7.098 0 01-.71-1.675A6.985 6.985 0 011 8c0-.643.082-1.262.246-1.86a6.968 6.968 0 01.711-1.667 7.156 7.156 0 012.509-2.516 6.895 6.895 0 011.675-.704A6.808 6.808 0 018 1z"/>'
	      }, props)
	  };
	  vs.VsCircleLargeOutline = function VsCircleLargeOutline(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.588 2.215A5.808 5.808 0 008 2c-.554 0-1.082.073-1.588.215l-.006.002c-.514.141-.99.342-1.432.601A6.156 6.156 0 002.82 4.98l-.002.004A5.967 5.967 0 002.21 6.41 5.986 5.986 0 002 8c0 .555.07 1.085.21 1.591a6.05 6.05 0 001.548 2.651c.37.365.774.677 1.216.94a6.1 6.1 0 001.435.609A6.02 6.02 0 008 14c.555 0 1.085-.07 1.591-.21.515-.145.99-.348 1.426-.607l.004-.002a6.16 6.16 0 002.161-2.155 5.85 5.85 0 00.6-1.432l.003-.006A5.807 5.807 0 0014 8c0-.554-.072-1.082-.215-1.588l-.002-.006a5.772 5.772 0 00-.6-1.423l-.002-.004a5.9 5.9 0 00-.942-1.21l-.008-.008a5.902 5.902 0 00-1.21-.942l-.004-.002a5.772 5.772 0 00-1.423-.6l-.006-.002zm4.455 9.32a7.157 7.157 0 01-2.516 2.508 6.966 6.966 0 01-1.668.71A6.984 6.984 0 018 15a6.984 6.984 0 01-1.86-.246 7.098 7.098 0 01-1.674-.711 7.3 7.3 0 01-1.415-1.094 7.295 7.295 0 01-1.094-1.415 7.098 7.098 0 01-.71-1.675A6.985 6.985 0 011 8c0-.643.082-1.262.246-1.86a6.968 6.968 0 01.711-1.667 7.156 7.156 0 012.509-2.516 6.895 6.895 0 011.675-.704A6.808 6.808 0 018 1a6.8 6.8 0 011.86.253 6.899 6.899 0 013.083 1.805 6.903 6.903 0 011.804 3.083C14.916 6.738 15 7.357 15 8s-.084 1.262-.253 1.86a6.9 6.9 0 01-.704 1.674z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCircleOutline = function VsCircleOutline(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 12a4 4 0 100-8 4 4 0 000 8zm2.61-4a2.61 2.61 0 11-5.22 0 2.61 2.61 0 015.22 0zM8 5.246z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCircleSlash = function VsCircleSlash(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 1a7 7 0 11-7 7 7.008 7.008 0 017-7zM2 8c0 1.418.504 2.79 1.423 3.87l8.447-8.447A5.993 5.993 0 002 8zm12 0c0-1.418-.504-2.79-1.423-3.87L4.13 12.577A5.993 5.993 0 0014 8z"/>'
	      }, props)
	  };
	  vs.VsCircleSmallFilled = function VsCircleSmallFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10 8a2 2 0 11-4 0 2 2 0 014 0z"/>'
	      }, props)
	  };
	  vs.VsCircleSmall = function VsCircleSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.832 8.556a1 1 0 11-1.663-1.112 1 1 0 011.663 1.112zm.831.555A2 2 0 106.338 6.89 2 2 0 009.663 9.11z"/>'
	      }, props)
	  };
	  vs.VsCircuitBoard = function VsCircuitBoard(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 1h-13l-.5.5v13l.5.5h13l.5-.5v-13l-.5-.5zM14 14H5v-2h2.3c.3.6 1 1 1.7 1 1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2H4v3H2V2h2v2.3c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2h2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2c-.7 0-1.4.4-1.7 1H6.7c-.3-.6-1-1-1.7-1V2h9v12zm-6-3c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zM5 5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm6 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>'
	      }, props)
	  };
	  vs.VsClearAll = function VsClearAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10 12.6l.7.7 1.6-1.6 1.6 1.6.8-.7L13 11l1.7-1.6-.8-.8-1.6 1.7-1.6-1.7-.7.8 1.6 1.6-1.6 1.6zM1 4h14V3H1v1zm0 3h14V6H1v1zm8 2.5V9H1v1h8v-.5zM9 13v-1H1v1h8z"/>'
	      }, props)
	  };
	  vs.VsClippy = function VsClippy(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7 13.992H4v-9h8v2h1v-2.5l-.5-.5H11v-1h-1a2 2 0 00-4 0H4.94v1H3.5l-.5.5v10l.5.5H7v-1zm0-11.2a1 1 0 01.8-.8 1 1 0 01.58.06.94.94 0 01.45.36 1 1 0 11-1.75.94 1 1 0 01-.08-.56zm7.08 9.46L13 13.342v-5.35h-1v5.34l-1.08-1.08-.71.71 1.94 1.93h.71l1.93-1.93-.71-.71zm-5.92-4.16h.71l1.93 1.93-.71.71-1.08-1.08v5.34h-1v-5.35l-1.08 1.09-.71-.71 1.94-1.93z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCloseAll = function VsCloseAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.621 8.086l-.707-.707L6.5 8.793 5.086 7.379l-.707.707L5.793 9.5l-1.414 1.414.707.707L6.5 10.207l1.414 1.414.707-.707L7.207 9.5l1.414-1.414z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsClose = function VsClose(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCloudDownload = function VsCloudDownload(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.957 6h.05a2.99 2.99 0 012.116.879 3.003 3.003 0 010 4.242 2.99 2.99 0 01-2.117.879v-1a2.002 2.002 0 000-4h-.914l-.123-.857a2.49 2.49 0 00-2.126-2.122A2.478 2.478 0 006.231 5.5l-.333.762-.809-.189A2.49 2.49 0 004.523 6c-.662 0-1.297.263-1.764.732A2.503 2.503 0 004.523 11h.498v1h-.498a3.486 3.486 0 01-2.628-1.16 3.502 3.502 0 011.958-5.78 3.462 3.462 0 011.468.04 3.486 3.486 0 013.657-2.06A3.479 3.479 0 0111.957 6zm-5.25 5.121l1.314 1.314V7h.994v5.4l1.278-1.279.707.707-2.146 2.147h-.708L6 11.829l.707-.708z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCloudUpload = function VsCloudUpload(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.956 6h.05a2.99 2.99 0 012.117.879 3.003 3.003 0 010 4.242 2.99 2.99 0 01-2.117.879h-1.995v-1h1.995a2.002 2.002 0 000-4h-.914l-.123-.857a2.49 2.49 0 00-2.126-2.122A2.478 2.478 0 006.23 5.5l-.333.762-.809-.189A2.49 2.49 0 004.523 6c-.662 0-1.297.263-1.764.732A2.503 2.503 0 004.523 11h2.494v1H4.523a3.486 3.486 0 01-2.628-1.16 3.502 3.502 0 01-.4-4.137A3.497 3.497 0 013.853 5.06c.486-.09.987-.077 1.468.041a3.486 3.486 0 013.657-2.06A3.479 3.479 0 0111.956 6zm-1.663 3.853L8.979 8.54v5.436h-.994v-5.4L6.707 9.854 6 9.146 8.146 7h.708L11 9.146l-.707.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCloud = function VsCloud(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.957 6h.05a2.99 2.99 0 012.116.879 3.003 3.003 0 010 4.242 2.99 2.99 0 01-2.117.879v-.013L12 12H4.523a3.486 3.486 0 01-2.628-1.16 3.502 3.502 0 011.958-5.78 3.462 3.462 0 011.468.04 3.486 3.486 0 013.657-2.06A3.479 3.479 0 0111.957 6zM5 11h7.01a1.994 1.994 0 001.992-2 2.002 2.002 0 00-1.996-2h-.914l-.123-.857a2.49 2.49 0 00-2.126-2.122A2.478 2.478 0 006.231 5.5l-.333.762-.809-.189A2.49 2.49 0 004.523 6c-.662 0-1.297.263-1.764.732A2.503 2.503 0 004.523 11H5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCode = function VsCode(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4.708 5.578L2.061 8.224l2.647 2.646-.708.708-3-3V7.87l3-3 .708.708zm7-.708L11 5.578l2.647 2.646L11 10.87l.708.708 3-3V7.87l-3-3zM4.908 13l.894.448 5-10L9.908 3l-5 10z"/>'
	      }, props)
	  };
	  vs.VsCollapseAll = function VsCollapseAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9 9H4v1h5V9z"/><path fill-rule="evenodd" d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsColorMode = function VsColorMode(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13V2a6 6 0 110 12z"/>'
	      }, props)
	  };
	  vs.VsCombine = function VsCombine(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1l-.5.5v3l.5.5h3l.5-.5v-3L4.5 1h-3zM2 4V2h2v2H2zm-.5 2l-.5.5v3l.5.5h3l.5-.5v-3L4.5 6h-3zM2 9V7h2v2H2zm-1 2.5l.5-.5h3l.5.5v3l-.5.5h-3l-.5-.5v-3zm1 .5v2h2v-2H2zm10.5-7l-.5.5v6l.5.5h3l.5-.5v-6l-.5-.5h-3zM15 8h-2V6h2v2zm0 3h-2V9h2v2zM9.1 8H6v1h3.1l-1 1 .7.6 1.8-1.8v-.7L8.8 6.3l-.7.7 1 1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCommentDiscussion = function VsCommentDiscussion(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 11.29l1-1v1.42l-1.15 1.14L3 12.5V10H1.5L1 9.5v-8l.5-.5h12l.5.5V6h-1V2H2v7h1.5l.5.5v1.79zM10.29 13l1.86 1.85.85-.35V13h1.5l.5-.5v-5l-.5-.5h-8l-.5.5v5l.5.5h3.79zm.21-1H7V8h7v4h-1.5l-.5.5v.79l-1.15-1.14-.35-.15z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCommentUnresolved = function VsCommentUnresolved(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v6.854a4.019 4.019 0 00-1-.819V3H2v8h2.5l.5.5v1.793l2.146-2.147L7.5 11h.626c-.082.32-.126.655-.126 1h-.293l-2.853 2.854L4 14.5V12H1.5l-.5-.5v-9l.5-.5z" clip-rule="evenodd"/><path d="M12 9a3 3 0 100 6 3 3 0 000-6z"/>'
	      }, props)
	  };
	  vs.VsComment = function VsComment(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 2h-13l-.5.5v9l.5.5H4v2.5l.854.354L7.707 12H14.5l.5-.5v-9l-.5-.5zm-.5 9H7.5l-.354.146L5 13.293V11.5l-.5-.5H2V3h12v8z"/>'
	      }, props)
	  };
	  vs.VsCompassActive = function VsCompassActive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.101 13.9a6.004 6.004 0 01-.601.08V13h-1v.98a6.001 6.001 0 01-5.482-5.518H3v-1h-.976A6.001 6.001 0 017.5 2.02V3h1v-.98a6.001 6.001 0 015.48 5.48H13v1h.98a6.004 6.004 0 01-.08.601c.334.077.652.196.95.351a7 7 0 10-5.397 5.397 3.973 3.973 0 01-.352-.95zm.803-3.433L6.99 9.01 4.967 4.967 9.009 6.99l1.459 2.913a4.02 4.02 0 00-.564.563zm-.469-1.032L8.481 7.52l-1.916-.955.954 1.917 1.916.954z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.333 10.506a3 3 0 113.333 4.987 3 3 0 01-3.333-4.987zm1.698 3.817l1.79-2.387-.8-.6-1.48 1.974-.876-.7-.624.78 1.278 1.023.712-.09z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCompassDot = function VsCompassDot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.101 13.9a6.004 6.004 0 01-.601.08V13h-1v.98a6.001 6.001 0 01-5.482-5.518H3v-1h-.976A6.001 6.001 0 017.5 2.02V3h1v-.98a6.001 6.001 0 015.48 5.48H13v1h.98a6.004 6.004 0 01-.08.601c.334.077.652.196.95.351a7 7 0 10-5.397 5.397 3.973 3.973 0 01-.352-.95zm.803-3.433L6.99 9.01 4.967 4.967 9.009 6.99l1.459 2.913a4.02 4.02 0 00-.564.563zm-.469-1.032L8.481 7.52l-1.916-.955.954 1.917 1.916.954z" clip-rule="evenodd"/><circle cx="13" cy="13" r="3"/>'
	      }, props)
	  };
	  vs.VsCompass = function VsCompass(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.009 6.991l2.024 4.042L6.991 9.01 4.967 4.967 9.009 6.99zm.426 2.444L8.481 7.52l-1.916-.955.954 1.917 1.916.954z"/><path fill-rule="evenodd" d="M13.98 8.5a6.002 6.002 0 01-5.48 5.48V13h-1v.98a6.001 6.001 0 01-5.482-5.518H3v-1h-.976A6.001 6.001 0 017.5 2.02V3h1v-.98a6.001 6.001 0 015.48 5.48H13v1h.98zM8 15A7 7 0 108 1a7 7 0 000 14z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCopy = function VsCopy(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsCreditCard = function VsCreditCard(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14 5v1H2V5h12zM2 7h12v5H2V7zm12-3H2a1 1 0 00-1 1v7a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zm-3 6h2v1h-2v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDash = function VsDash(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5 8h6v1H5z"/>'
	      }, props)
	  };
	  vs.VsDashboard = function VsDashboard(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.889 2.095a6.5 6.5 0 117.222 10.81A6.5 6.5 0 013.89 2.094zm.555 9.978A5.5 5.5 0 007.5 13 5.506 5.506 0 0013 7.5a5.5 5.5 0 10-8.556 4.573zM10.294 4l.706.707-2.15 2.15a1.514 1.514 0 11-.707-.707L10.293 4zM7.221 7.916a.5.5 0 10.556-.832.5.5 0 00-.556.832zm4.286-2.449l-.763.763c.166.403.253.834.255 1.27a3.463 3.463 0 01-.5 1.777l.735.735a4.477 4.477 0 00.274-4.545h-.001zM8.733 4.242A3.373 3.373 0 007.5 4 3.5 3.5 0 004 7.5a3.46 3.46 0 00.5 1.777l-.734.735A4.5 4.5 0 019.5 3.473l-.767.769z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDatabase = function VsDatabase(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13 3.5C13 2.119 10.761 1 8 1S3 2.119 3 3.5c0 .04.02.077.024.117H3v8.872l.056.357C3.336 14.056 5.429 15 8 15c2.571 0 4.664-.944 4.944-2.154l.056-.357V3.617h-.024c.004-.04.024-.077.024-.117zM8 2.032c2.442 0 4 .964 4 1.468s-1.558 1.468-4 1.468S4 4 4 3.5s1.558-1.468 4-1.468zm4 10.458l-.03.131C11.855 13.116 10.431 14 8 14s-3.855-.884-3.97-1.379L4 12.49v-7.5A7.414 7.414 0 008 6a7.414 7.414 0 004-1.014v7.504z"/>'
	      }, props)
	  };
	  vs.VsDebugAll = function VsDebugAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.293 9.006l-.88.88A2.484 2.484 0 004 8a2.488 2.488 0 00-2.413 1.886l-.88-.88L0 9.712l1.147 1.146-.147.146v1H0v.999h1v.053c.051.326.143.643.273.946L0 15.294.707 16l1.1-1.099A2.873 2.873 0 004 16a2.875 2.875 0 002.193-1.099L7.293 16 8 15.294l-1.273-1.292A3.92 3.92 0 007 13.036v-.067h1v-.965H7v-1l-.147-.146L8 9.712l-.707-.706zM4 9.006a1.5 1.5 0 011.5 1.499h-3A1.498 1.498 0 014 9.006zm2 3.997A2.217 2.217 0 014 15a2.22 2.22 0 01-2-1.998v-1.499h4v1.499z"/><path fill-rule="evenodd" d="M3.78 2L3 2.41V7h1V3.35l7.6 5.07L9 10.15v1.2l3.78-2.52V8l-9-6zM9 13.35v-1.202l5.6-3.728L7 3.35V2.147L15.78 8v.83L9 13.35z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugAltSmall = function VsDebugAltSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.293 9.006l-.88.88A2.484 2.484 0 004 8a2.488 2.488 0 00-2.413 1.886l-.88-.88L0 9.712l1.147 1.146-.147.146v1H0v.999h1v.053c.051.326.143.643.273.946L0 15.294.707 16l1.1-1.099A2.873 2.873 0 004 16a2.875 2.875 0 002.193-1.099L7.293 16 8 15.294l-1.273-1.292A3.92 3.92 0 007 13.036v-.067h1v-.965H7v-1l-.147-.146L8 9.712l-.707-.706zM4 9.006a1.5 1.5 0 011.5 1.499h-3A1.498 1.498 0 014 9.006zm2 3.997A2.217 2.217 0 014 15a2.22 2.22 0 01-2-1.998v-1.499h4v1.499z"/><path fill-rule="evenodd" d="M5 2.41L5.78 2l9 6v.83L9 12.683v-1.2l4.6-3.063L6 3.35V7H5V2.41z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugAlt = function VsDebugAlt(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M10.94 13.5l-1.32 1.32a3.73 3.73 0 00-7.24 0L1.06 13.5 0 14.56l1.72 1.72-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94 1.06 24l1.65-1.65A4.308 4.308 0 006 24a4.31 4.31 0 003.29-1.65L10.94 24 12 22.94 10.09 21c.198-.464.336-.951.41-1.45v-.1H12V18h-1.5v-1.5l-.22-.22L12 14.56l-1.06-1.06zM6 13.5a2.25 2.25 0 012.25 2.25h-4.5A2.25 2.25 0 016 13.5zm3 6a3.33 3.33 0 01-3 3 3.33 3.33 0 01-3-3v-2.25h6v2.25zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v9.46a5.07 5.07 0 00-1.5-.72V.63L8.64 0l15.12 9.6z"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointConditionalUnverified = function VsDebugBreakpointConditionalUnverified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.778 4.674a4 4 0 114.444 6.652 4 4 0 01-4.444-6.652zm.694 5.612a2.75 2.75 0 103.056-4.572 2.75 2.75 0 00-3.056 4.572zM9.5 6.5h-3v1h3v-1zm0 2h-3v1h3v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointConditional = function VsDebugBreakpointConditional(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zm2 5v1H6V9h4zm0-3v1H6V6h4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointDataUnverified = function VsDebugBreakpointDataUnverified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.931 4h-4.62l-2.31 4 2.31 4h4.62l2.31-4-2.31-4zm-.75 6.7h-3.12L4.501 8l1.56-2.7h3.12l1.56 2.7-1.56 2.7z"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointData = function VsDebugBreakpointData(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M12.238 8l-2.31 4H5.31L3 8l2.31-4h4.618l2.31 4z"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointFunctionUnverified = function VsDebugBreakpointFunctionUnverified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 11h8L8 4l-4 7zm2.154-1.25h3.692L8 6.52 6.154 9.75z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointFunction = function VsDebugBreakpointFunction(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 4l4 6.905H4L8 4z"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointLogUnverified = function VsDebugBreakpointLogUnverified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.02 7.98L8 3l4.98 4.98L8 12.96 3.02 7.98zM8 10.77l2.79-2.79L8 5.19 5.21 7.98 8 10.77z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointLog = function VsDebugBreakpointLog(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 3l5 5-5 5-5-5 5-5z"/>'
	      }, props)
	  };
	  vs.VsDebugBreakpointUnsupported = function VsDebugBreakpointUnsupported(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.326 10.222a4 4 0 10-6.653-4.444 4 4 0 006.653 4.444zM8.65 10H7.4v1h1.25v-1zM7.4 9V5h1.25v4H7.4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugConsole = function VsDebugConsole(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M7.04 1.361l.139-.057H21.32l.14.057 1.178 1.179.057.139V16.82l-.057.14-1.179 1.178-.139.057H14V18a1.99 1.99 0 00-.548-1.375h7.673V2.875H7.375v7.282a5.73 5.73 0 00-1.571-.164V2.679l.057-.14L7.04 1.362zm9.531 9.452l-2.809 2.8a2 2 0 00-.348-.467l-.419-.42 2.236-2.235-3.606-3.694.813-.833 4.133 4.133v.716zM9.62 14.82l1.32-1.32L12 14.56l-1.72 1.72.22.22V18H12v1.45h-1.5v.1a5.888 5.888 0 01-.41 1.45L12 22.94 10.94 24l-1.65-1.65A4.308 4.308 0 016 24a4.31 4.31 0 01-3.29-1.65L1.06 24 0 22.94 1.91 21a5.889 5.889 0 01-.41-1.42v-.08H0V18h1.5v-1.5l.22-.22L0 14.56l1.06-1.06 1.32 1.32a3.73 3.73 0 017.24 0zm-2.029-.661A2.25 2.25 0 003.75 15.75h4.5a2.25 2.25 0 00-.659-1.591zm.449 7.38A3.33 3.33 0 009 19.5v-2.25H3v2.25a3.33 3.33 0 003 3 3.33 3.33 0 002.04-.96z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugContinueSmall = function VsDebugContinueSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 2H3v12h1V2zm3.29.593L6.5 3v10l.79.407 7-5v-.814l-7-5zM13.14 8L7.5 12.028V3.972L13.14 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugContinue = function VsDebugContinue(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.5 2H4v12H2.5V2zm4.936.39L6.25 3v10l1.186.61 7-5V7.39l-7-5zM12.71 8l-4.96 3.543V4.457L12.71 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugCoverage = function VsDebugCoverage(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5 2.41L5.78 2l9 6v.83L9 12.683v-1.2l4.6-3.063L6 3.35V7H5V2.41z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.13 12.124c-.182.18-.322.379-.42.6-.097.219-.145.457-.145.715v.862a.685.685 0 01-.205.495.703.703 0 01-.496.204h-.865a.691.691 0 01-.497-.204.701.701 0 01-.205-.495v-.862c0-.258-.049-.496-.147-.716a1.913 1.913 0 00-.418-.6 2.525 2.525 0 01-.542-.773 2.255 2.255 0 01-.19-.927A2.386 2.386 0 012.332 9.2a2.404 2.404 0 01.87-.87A2.473 2.473 0 014.432 8a2.41 2.41 0 011.225.33 2.41 2.41 0 011.205 2.093c0 .332-.063.641-.19.927a2.525 2.525 0 01-.542.774zm-1.103.991H3.835v1.186c0 .043.016.08.049.114.033.033.07.048.115.048h.865a.156.156 0 00.114-.048.154.154 0 00.049-.114v-1.186z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugDisconnect = function VsDebugDisconnect(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.617 3.844a2.87 2.87 0 00-.451-.868l1.354-1.36L13.904 1l-1.36 1.354a2.877 2.877 0 00-.868-.452 3.073 3.073 0 00-2.14.075 3.03 3.03 0 00-.991.664L7 4.192l4.327 4.328 1.552-1.545c.287-.287.508-.618.663-.992a3.074 3.074 0 00.075-2.14zm-.889 1.804a2.15 2.15 0 01-.471.705l-.93.93-3.09-3.09.93-.93a2.15 2.15 0 01.704-.472 2.134 2.134 0 011.689.007c.264.114.494.271.69.472.2.195.358.426.472.69a2.134 2.134 0 01.007 1.688zm-4.824 4.994l1.484-1.545-.616-.622-1.49 1.551-1.86-1.859 1.491-1.552L6.291 6 4.808 7.545l-.616-.615-1.551 1.545a3 3 0 00-.663.998 3.023 3.023 0 00-.233 1.169c0 .332.05.656.15.97.105.31.258.597.459.862L1 13.834l.615.615 1.36-1.353c.265.2.552.353.862.458.314.1.638.15.97.15.406 0 .796-.077 1.17-.232.378-.155.71-.376.998-.663l1.545-1.552-.616-.615zm-2.262 2.023a2.16 2.16 0 01-.834.164c-.301 0-.586-.057-.855-.17a2.278 2.278 0 01-.697-.466 2.28 2.28 0 01-.465-.697 2.167 2.167 0 01-.17-.854 2.16 2.16 0 01.642-1.545l.93-.93 3.09 3.09-.93.93a2.22 2.22 0 01-.711.478z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugLineByLine = function VsDebugLineByLine(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6 10V9h9v1H6zm4-4h5v1h-5V6zm5-3v1H6V3h9zm-9 9v1h9v-1H6z"/><path fill-rule="evenodd" d="M1 2.795l.783-.419 5.371 3.581v.838l-5.371 3.581L1 9.957V2.795zm1.007.94v5.281l3.96-2.64-3.96-2.64z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugPause = function VsDebugPause(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4.5 3H6v10H4.5V3zm7 0v10H10V3h1.5z"/>'
	      }, props)
	  };
	  vs.VsDebugRerun = function VsDebugRerun(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.167 12a3 3 0 01-5.74 1.223l-.928.376A4.001 4.001 0 101 9.556V8.333H0V11l.5.5h2.333v-1H1.568A3 3 0 017.167 12z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M5 2.41L5.78 2l9 6v.83L10 12.017v-1.2l3.6-2.397L6 3.35V7H5V2.41z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugRestartFrame = function VsDebugRestartFrame(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 10V9h5.207a5.48 5.48 0 00-.185 1H1zm6.257-3a5.54 5.54 0 011.08-1H1v1h6.257zM6.6 13a5.465 5.465 0 01-.393-1H1v1h5.6zM15 3v1H1V3h14zm-3.36 10.031a2.531 2.531 0 10-2.192-3.797h1.068v.844h-1.97l-.421-.422v-2.25h.844v1.032a3.375 3.375 0 11-.423 3.412l.782-.318a2.532 2.532 0 002.313 1.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugRestart = function VsDebugRestart(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.75 8a4.5 4.5 0 01-8.61 1.834l-1.391.565A6.001 6.001 0 0014.25 8 6 6 0 003.5 4.334V2.5H2v4l.75.75h3.5v-1.5H4.352A4.5 4.5 0 0112.75 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugReverseContinue = function VsDebugReverseContinue(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.5 2H12v12h1.5V2zm-4.936.39L9.75 3v10l-1.186.61-7-5V7.39l7-5zM3.29 8l4.96 3.543V4.457L3.29 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStackframeActive = function VsDebugStackframeActive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10 8a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M14.5 7.15l-4.26-4.74L9.31 2H4.25L3 3.25v9.48l1.25 1.25h5.06l.93-.42 4.26-4.74V7.15zm-5.19 5.58H4.25V3.25h5.06l4.26 4.73-4.26 4.75z"/>'
	      }, props)
	  };
	  vs.VsDebugStackframe = function VsDebugStackframe(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 7.15l-4.26-4.74L9.31 2H4.25L3 3.25v9.48l1.25 1.25h5.06l.93-.42 4.26-4.74V7.15zm-5.19 5.58H4.25V3.25h5.06l4.26 4.73-4.26 4.75z"/>'
	      }, props)
	  };
	  vs.VsDebugStart = function VsDebugStart(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.25 3l1.166-.624 8 5.333v1.248l-8 5.334-1.166-.624V3zm1.5 1.401v7.864l5.898-3.932L5.75 4.401z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStepBack = function VsDebugStepBack(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.75 5.75v-4h1.5v2.542c1.145-1.359 2.911-2.209 4.84-2.209 3.177 0 5.92 2.307 6.16 5.398l.02.269h-1.5l-.022-.226c-.212-2.195-2.202-3.94-4.656-3.94-1.736 0-3.244.875-4.05 2.166h2.83v1.5H2.707l-.961-.975V5.75h.003zM8 14a2 2 0 110-4 2 2 0 010 4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStepInto = function VsDebugStepInto(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 9.532h.542l3.905-3.905-1.061-1.06-2.637 2.61V1H7.251v6.177l-2.637-2.61-1.061 1.06 3.905 3.905H8zm1.956 3.481a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStepOut = function VsDebugStepOut(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 1h-.542L3.553 4.905l1.061 1.06 2.637-2.61v6.177h1.498V3.355l2.637 2.61 1.061-1.06L8.542 1H8zm1.956 12.013a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStepOver = function VsDebugStepOver(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.25 5.75v-4h-1.5v2.542c-1.145-1.359-2.911-2.209-4.84-2.209-3.177 0-5.92 2.307-6.16 5.398l-.02.269h1.501l.022-.226c.212-2.195 2.202-3.94 4.656-3.94 1.736 0 3.244.875 4.05 2.166h-2.83v1.5h4.163l.962-.975V5.75h-.004zM8 14a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDebugStop = function VsDebugStop(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 2v12h12V2H2zm10.75 10.75h-9.5v-9.5h9.5v9.5z"/>'
	      }, props)
	  };
	  vs.VsDebug = function VsDebug(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M3.463 12.86l-.005-.07.005.07zm7.264.69l-3.034-3.049 1.014-1.014 3.209 3.225 3.163-3.163 1.014 1.014-3.034 3.034 3.034 3.05-1.014 1.014-3.209-3.225L8.707 17.6l-1.014-1.014 3.034-3.034z"/><path fill-rule="evenodd" d="M16.933 5.003V6h1.345l2.843-2.842 1.014 1.014-2.692 2.691.033.085a13.75 13.75 0 01.885 4.912c0 .335-.011.667-.034.995l-.005.075h3.54v1.434h-3.72l-.01.058c-.303 1.653-.891 3.16-1.692 4.429l-.06.094 3.423 3.44-1.017 1.012-3.274-3.29-.099.11c-1.479 1.654-3.395 2.646-5.483 2.646-2.12 0-4.063-1.023-5.552-2.723l-.098-.113-3.209 3.208-1.014-1.014 3.366-3.365-.059-.095c-.772-1.25-1.34-2.725-1.636-4.34l-.01-.057H0V12.93h3.538l-.005-.075a14.23 14.23 0 01-.034-.995c0-1.743.31-3.39.863-4.854l.032-.084-2.762-2.776L2.65 3.135 5.5 6h1.427v-.997a5.003 5.003 0 0110.006 0zm-8.572 0V6H15.5v-.997a3.569 3.569 0 00-7.138 0zm9.8 2.522l-.034-.09H5.733l-.034.09a12.328 12.328 0 00-.766 4.335c0 2.76.862 5.201 2.184 6.92 1.32 1.716 3.036 2.649 4.813 2.649 1.777 0 3.492-.933 4.813-2.65 1.322-1.718 2.184-4.16 2.184-6.919 0-1.574-.28-3.044-.766-4.335z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDesktopDownload = function VsDesktopDownload(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 15v-1c2 0 2-.6 2-1H1.5l-.5-.5v-10l.5-.5h13l.5.5v9.24l-1-1V3H2v9h5.73l-.5.5 2.5 2.5H4zm7.86 0l2.5-2.5-.71-.7L12 13.45V7h-1v6.44l-1.64-1.65-.71.71 2.5 2.5h.71z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDeviceCameraVideo = function VsDeviceCameraVideo(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.25 4.74L11 6.62V4.5l-.5-.5h-9l-.5.5v7l.5.5h9l.5-.5v-2l3.25 1.87.75-.47V5.18l-.75-.44zM10 11H2V5h8v6zm4-1l-3-1.7v-.52L14 6v4z"/>'
	      }, props)
	  };
	  vs.VsDeviceCamera = function VsDeviceCamera(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.707 3H14.5l.5.5v9l-.5.5h-13l-.5-.5v-9l.5-.5h3.793l.853-.854L6.5 2h3l.354.146.853.854zM2 12h12V4h-3.5l-.354-.146L9.293 3H6.707l-.853.854L5.5 4H2v8zm1.5-7a.5.5 0 100 1 .5.5 0 000-1zM8 6a2 2 0 110 4 2 2 0 010-4zm0-1a3 3 0 100 6 3 3 0 000-6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDeviceMobile = function VsDeviceMobile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.5 1h8l.5.5v13l-.5.5h-8l-.5-.5v-13l.5-.5zM5 14h7V2H5v12zm2.5-2h2v1h-2v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiffAdded = function VsDiffAdded(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 4H7v3H4v1h3v3h1V8h3V7H8V4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiffIgnored = function VsDiffIgnored(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 14h12V2H2v12zm8-10h2v2l-6 6H4v-2l6-6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiffModified = function VsDiffModified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 2v12h12V2H2zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiffRemoved = function VsDiffRemoved(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10 7v1H5V7h5z"/><path fill-rule="evenodd" d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiffRenamed = function VsDiffRenamed(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 14h12V2H2v12zm2-5h3v3l5-4-5-4v3H4v2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiff = function VsDiff(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 3.5l.5-.5h5l.5.5v9l-.5.5h-5l-.5-.5v-9zM3 12h4V6H3v6zm0-7h4V4H3v1zm6.5-2h5l.5.5v9l-.5.5h-5l-.5-.5v-9l.5-.5zm.5 9h4v-2h-4v2zm0-4h4V4h-4v4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsDiscard = function VsDiscard(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.5 2v3.5L4 6h3.5V5H4.979l.941-.941a3.552 3.552 0 115.023 5.023L5.746 14.28l.72.72 5.198-5.198A4.57 4.57 0 005.2 3.339l-.7.7V2h-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsEdit = function VsEdit(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"/>'
	      }, props)
	  };
	  vs.VsEditorLayout = function VsEditorLayout(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 6.5l-.47-.5H7V1.47L6.53 1H1.47L1 1.47v8.06l.47.47H4v4.53l.47.47h10.06l.47-.47V6.5zM2 9V3h4v6H2zm12 5H5v-4h1.53L7 9.53V8.013h7V14z"/>'
	      }, props)
	  };
	  vs.VsEllipsis = function VsEllipsis(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4 8a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z"/>'
	      }, props)
	  };
	  vs.VsEmptyWindow = function VsEmptyWindow(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 4h3v1H4v3H3V5H0V4h3V1h1v3zM1 14.5V9h1v5h12V7H8V6h6V4H8V3h6.5l.5.5v11l-.5.5h-13l-.5-.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsErrorSmall = function VsErrorSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.177 10.105L8 8.928l-1.177 1.177-.928-.928L7.072 8 5.895 6.823l.928-.928L8 7.072l1.177-1.177.928.928L8.928 8l1.177 1.177-.928.928z"/><path d="M12 8a4 4 0 11-8 0 4 4 0 018 0zm-1 0a3 3 0 10-6 0 3 3 0 006 0z"/>'
	      }, props)
	  };
	  vs.VsError = function VsError(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsExclude = function VsExclude(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.412 1H6.588l-.484 2.423-2.056-1.37-1.996 1.995 1.37 2.056L1 6.588v2.824l2.423.484-1.37 2.056 1.995 1.996 2.056-1.37L6.588 15h2.083a4.526 4.526 0 01-.917-1.005h-.342l-.288-1.441a4.473 4.473 0 01-.067-.334l-.116-.583-.764-.316-2 1.334-.832-.831L4.68 9.823l-.316-.764-2.358-.471V7.412l2.358-.471.316-.764-1.334-2 .831-.832 2 1.335.764-.316.471-2.358h1.176l.471 2.358.764.316 2-1.334.832.831-1.334 2.001.316.764.582.116c.113.018.225.04.335.067l1.441.288v.342c.38.254.719.563 1.005.917V6.588l-2.422-.484 1.37-2.056-1.996-1.996-2.056 1.37L9.412 1zM8 6a2 2 0 011.875 1.302 4.46 4.46 0 00-.9.473 1 1 0 10-1.2 1.2 4.46 4.46 0 00-.473.9A2 2 0 018 6zm1.28 2.795a3.5 3.5 0 114.44 5.41 3.5 3.5 0 01-4.44-5.41zM9 11v1h5v-1H9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsExpandAll = function VsExpandAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9 9H4v1h5V9z"/><path d="M7 12V7H6v5h1z"/><path fill-rule="evenodd" d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsExport = function VsExport(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.086 7l-2.39-2.398.702-.704L15 7.5l-3.602 3.602-.703-.704 2.383-2.382V8H3V7h10.086zM1 4h1v7H1V4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsExtensions = function VsExtensions(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M13.5 1.5L15 0h7.5L24 1.5V9l-1.5 1.5H15L13.5 9V1.5zm1.5 0V9h7.5V1.5H15zM0 15V6l1.5-1.5H9L10.5 6v7.5H18l1.5 1.5v7.5L18 24H1.5L0 22.5V15zm9-1.5V6H1.5v7.5H9zM9 15H1.5v7.5H9V15zm1.5 7.5H18V15h-7.5v7.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsEyeClosed = function VsEyeClosed(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1.48 1.48a.5.5 0 00-.049.65l.049.057 2.69 2.69A6.657 6.657 0 001.533 8.71a.5.5 0 00.97.242 5.66 5.66 0 012.386-3.356l1.207 1.207a2.667 2.667 0 003.771 3.771l3.946 3.946a.5.5 0 00.756-.65l-.049-.057-4.075-4.076v-.001l-.8-.799-1.913-1.913h.001l-1.92-1.919v-.001l-.755-.754-2.871-2.87a.5.5 0 00-.707 0zm5.323 6.03l2.356 2.357A1.667 1.667 0 016.802 7.51zM8 3.667c-.667 0-1.314.098-1.926.283l.825.824a5.669 5.669 0 016.6 4.181.5.5 0 00.97-.242A6.669 6.669 0 008 3.667zm.13 2.34l2.534 2.533A2.668 2.668 0 008.13 6.006z"/>'
	      }, props)
	  };
	  vs.VsEye = function VsEye(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 6.003a2.667 2.667 0 110 5.334 2.667 2.667 0 010-5.334zm0 1a1.667 1.667 0 100 3.334 1.667 1.667 0 000-3.334zm0-3.336c3.076 0 5.73 2.1 6.467 5.043a.5.5 0 11-.97.242 5.67 5.67 0 00-10.995.004.5.5 0 01-.97-.243A6.669 6.669 0 018 3.667z"/>'
	      }, props)
	  };
	  vs.VsFeedback = function VsFeedback(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.549 10.078c.46.182.88.424 1.258.725.378.3.701.65.97 1.046a4.829 4.829 0 01.848 2.714V15H9.75v-.438a3.894 3.894 0 00-1.155-2.782 4.054 4.054 0 00-1.251-.84 3.898 3.898 0 00-1.532-.315A3.894 3.894 0 003.03 11.78a4.06 4.06 0 00-.84 1.251c-.206.474-.31.985-.315 1.531V15H1v-.438a4.724 4.724 0 01.848-2.713 4.918 4.918 0 012.229-1.77 2.994 2.994 0 01-.555-.493 3.156 3.156 0 01-.417-.602 2.942 2.942 0 01-.26-.683 3.345 3.345 0 01-.095-.739c0-.423.08-.82.24-1.189a3.095 3.095 0 011.626-1.627 3.067 3.067 0 012.386-.007 3.095 3.095 0 011.627 1.627 3.067 3.067 0 01.157 1.928c-.06.237-.148.465-.266.684a3.506 3.506 0 01-.417.608c-.16.187-.345.35-.554.492zM5.812 9.75c.301 0 .584-.057.848-.17a2.194 2.194 0 001.162-1.163c.119-.269.178-.554.178-.854a2.138 2.138 0 00-.643-1.538 2.383 2.383 0 00-.697-.472 2.048 2.048 0 00-.848-.178c-.3 0-.583.057-.847.17a2.218 2.218 0 00-1.17 1.17c-.113.264-.17.547-.17.848 0 .3.057.583.17.847.115.264.27.497.466.697a2.168 2.168 0 001.552.643zM15 1v7h-1.75l-2.625 2.625V8H9.75v-.875h1.75v1.388l1.388-1.388h1.237v-5.25h-8.75v1.572a7.255 7.255 0 00-.438.069 2.62 2.62 0 00-.437.123V1H15z"/>'
	      }, props)
	  };
	  vs.VsFileBinary = function VsFileBinary(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.57 1.14l3.28 3.3.15.36v9.7l-.5.5h-11l-.5-.5v-13l.5-.5h7.72l.35.14zM3 2v12h10V5l-3-3H3zm1.46 4.052c0 1.287.458 1.93 1.374 1.93.457 0 .807-.173 1.05-.52.246-.348.368-.847.368-1.499C7.252 4.654 6.805 4 5.91 4c-.471 0-.831.175-1.08.526-.247.35-.37.858-.37 1.526zm.862-.022c0-.922.183-1.383.55-1.383.344 0 .516.448.516 1.343s-.176 1.343-.527 1.343c-.36 0-.54-.434-.54-1.303zm3.187 1.886h2.435v-.672h-.792V4l-1.665.336v.687l.82-.177v2.398h-.798v.672zm-1.337 5H4.736v-.672h.798V9.846l-.82.177v-.687L6.38 9v3.244h.792v.671zm1.035-1.931c0 1.287.458 1.93 1.375 1.93.457 0 .807-.173 1.05-.52.245-.348.368-.847.368-1.499 0-1.309-.448-1.963-1.343-1.963-.47 0-.83.175-1.08.526-.246.35-.37.858-.37 1.526zm.862-.022c0-.922.184-1.383.55-1.383.344 0 .516.448.516 1.343s-.175 1.343-.526 1.343c-.36 0-.54-.434-.54-1.303z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileCode = function VsFileCode(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.57 1.14l3.28 3.3.15.36v9.7l-.5.5h-11l-.5-.5v-13l.5-.5h7.72l.35.14zM10 5h3l-3-3v3zM3 2v12h10V6H9.5L9 5.5V2H3zm2.062 7.533l1.817-1.828L6.17 7 4 9.179v.707l2.171 2.174.707-.707-1.816-1.82zM8.8 7.714l.7-.709 2.189 2.175v.709L9.5 12.062l-.705-.709 1.831-1.82L8.8 7.714z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileMedia = function VsFileMedia(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 2h6v3.5l.5.5H12v1h1V4.8l-.15-.36-3.28-3.3L9.22 1H1.5l-.5.5v13l.5.5H5v-1H2V2zm7 0l3 3H9V2zm5.5 6h-8l-.5.5v6l.5.5h8l.5-.5v-6l-.5-.5zM14 9v4l-1.63-1.6h-.71l-1.16 1.17-2.13-2.13h-.71L7 11.1V9h7zm-2.8 4.27l.81-.81L13.55 14h-1.62l-.73-.73zM7 14v-1.49l1-1L10.52 14H7zm5.5-3.5a.5.5 0 100-1 .5.5 0 000 1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFilePdf = function VsFilePdf(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.85 4.44l-3.28-3.3-.35-.14H2.5l-.5.5V7h1V2h6v3.5l.5.5H13v1h1V4.8l-.15-.36zM10 5V2l3 3h-3zM2.5 8l-.5.5v6l.5.5h11l.5-.5v-6l-.5-.5h-11zM13 13v1H3V9h10v4zm-8-1h-.32v1H4v-3h1.06c.75 0 1.13.36 1.13 1a.94.94 0 01-.32.72A1.33 1.33 0 015 12zm-.06-1.45h-.26v.93h.26c.36 0 .54-.16.54-.47 0-.31-.18-.46-.54-.46zM9 12.58a1.48 1.48 0 00.44-1.12c0-1-.53-1.46-1.6-1.46H6.78v3h1.06A1.6 1.6 0 009 12.58zm-1.55-.13v-1.9h.33a.94.94 0 01.7.25.91.91 0 01.25.67 1 1 0 01-.25.72.94.94 0 01-.69.26h-.34zm4.45-.61h-.97V13h-.68v-3h1.74v.55h-1.06v.74h.97v.55z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileSubmodule = function VsFileSubmodule(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 11h1V6.99H2V11zm1-5.01V5.5l.5-.5h4.43l.43.25.43.75h5.71l.5.5v8l-.5.5h-11l-.5-.5V12H1.5l-.5-.5v-9l.5-.5h4.42l.44.25.43.75h5.71l.5.5V6l-1-.03V4H6.5l-.43-.25L5.64 3H2v2.99h1zm5.07.76L7.64 6H4v3h3.15l.41-.74L8 8h6V7H8.5l-.43-.25zM7.45 10H4v4h10V9H8.3l-.41.74-.44.26z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileSymlinkDirectory = function VsFileSymlinkDirectory(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.71 3h6.79l.51.5v10l-.5.5h-13l-.5-.5v-11l.5-.5h5l.35.15.85.85zm6.28 10v-1.51l.01-4v-1.5H7.7l-.86.86-.35.15H2v6h11.99zm-6.5-8h6.5l.01-.99H7.5l-.36-.15-.85-.85H2v3h4.28l.86-.86.35-.15zm2.29 4.07L8.42 7.7l.74-.69 2.22 2.22v.71l-2.29 2.21-.7-.72 1.4-1.35H8.42a2 2 0 00-1.35.61A1.8 1.8 0 006.54 12h-1a2.76 2.76 0 01.81-2 3 3 0 012-.93h1.43z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileSymlinkFile = function VsFileSymlinkFile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.57 1.14l3.28 3.3.15.36v9.7l-.5.5H10v-1h3V6H9.5L9 5.5V2H3v4H2V1.5l.5-.5h7.72l.35.14zM10 5h3l-3-3v3zM8.5 7h-7l-.5.5v7l.5.5h7l.5-.5v-7L8.5 7zM8 14H2V8h6v6zM7 9.5v3H6v-1.793l-2.646 2.647-.708-.708L5.293 10H3.53V9H6.5l.5.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFileZip = function VsFileZip(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.5 1h11l.5.5v5l-.15.35-.85.86v6.79l-.5.5h-10l-.5-.5v-13l.5-.5zM6 2H5v2h1V2zm0 12h4V7.68l-.85-.85L9 6.47V2H7v2.5l-.5.5H6v1H5V5h-.5L4 4.5V2H3v12h2v-1h1v1zm0-2v1h1v-1H6zm0-1v1H5v-1h1zm0-1h1v1H6v-1zm0-1v1H5V9h1zm0-1h1v1H6V8zm0-1v1H5V7h1zm0 0h1V6H6v1zm6.15.15l.85-.86V2h-3v4.27l.85.85.15.35V14h1V7.5l.15-.35z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFile = function VsFile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM13 14H4V2h5v4h4v8zm-3-9V2l3 3h-3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFiles = function VsFiles(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/>'
	      }, props)
	  };
	  vs.VsFilterFilled = function VsFilterFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M15 2v1.67l-5 4.759V14H6V8.429l-5-4.76V2h14z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFilter = function VsFilter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M15 2v1.67l-5 4.759V14H6V8.429l-5-4.76V2h14zM7 8v5h2V8l5-4.76V3H2v.24L7 8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFlame = function VsFlame(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.13 15l-.53-.77a1.85 1.85 0 00-.28-2.54 3.51 3.51 0 01-1.19-2c-1.56 2.23-.75 3.46 0 4.55l-.55.76A4.4 4.4 0 013 10.46S2.79 8.3 5.28 6.19c0 0 2.82-2.61 1.84-4.54L7.83 1a6.57 6.57 0 012.61 6.94 2.57 2.57 0 00.56-.81l.87-.07c.07.12 1.84 2.93.89 5.3A4.72 4.72 0 019.13 15zm-2-6.95l.87.39a3 3 0 00.92 2.48 2.64 2.64 0 011 2.8A3.241 3.241 0 0011.8 12a4.87 4.87 0 00-.41-3.63 1.85 1.85 0 01-1.84.86l-.35-.68a5.31 5.31 0 00-.89-5.8C8.17 4.87 6 6.83 5.93 6.94 3.86 8.7 4 10.33 4 10.4a3.47 3.47 0 001.59 3.14C5 12.14 5 10.46 7.16 8.05h-.03z"/>'
	      }, props)
	  };
	  vs.VsFoldDown = function VsFoldDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.207 1.707L13.5 1l-6 6-6-6-.707.707 6.353 6.354h.708l6.353-6.354zm0 6L13.5 7l-6 6-6-6-.707.707 6.353 6.354h.708l6.353-6.354z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFoldUp = function VsFoldUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1 7.4l.7.7 6-6 6 6 .7-.7L8.1 1h-.7L1 7.4zm0 6l.7.7 6-6 6 6 .7-.7L8.1 7h-.7L1 13.4z"/>'
	      }, props)
	  };
	  vs.VsFold = function VsFold(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.952 2.381L7.976 6.357 4 2.381 3.38 3l4.286 4.285h.619L12.57 3l-.618-.619zM3.904 14l4.072-4.072L12.047 14l.62-.619L8.284 9h-.619l-4.381 4.381.619.619z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFolderActive = function VsFolderActive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.71 3h6.79l.51.5v4.507A4.997 4.997 0 0014 7.416V5.99H7.69l-.86.86-.35.15H1.99v6H7.1c.07.348.177.682.316 1H1.51l-.5-.5v-11l.5-.5h5l.35.15.85.85zm-.22 2h6.5l.01-.99H7.5l-.36-.15-.85-.85H2v3h4.28l.86-.86.35-.15z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.778 8.674a4 4 0 114.444 6.652 4 4 0 01-4.444-6.652zm2.13 4.99l2.387-3.182-.8-.6-2.077 2.769-1.301-1.041-.625.78 1.704 1.364.713-.09z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsFolderLibrary = function VsFolderLibrary(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.71 3h6.79l.51.5V7H14V5.99H7.69l-.86.86-.35.15H1.99v6H7v1H1.51l-.5-.5v-11l.5-.5h5l.35.15.85.85zm-.22 2h6.5l.01-.99H7.5l-.36-.15-.85-.85H2v3h4.28l.86-.86.35-.15z" clip-rule="evenodd"/><path d="M8 8h1v6H8zM10 8h1v6h-1zM12.004 8.352l.94-.342 2.052 5.638-.94.342z"/>'
	      }, props)
	  };
	  vs.VsFolderOpened = function VsFolderOpened(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1.5 14h11l.48-.37 2.63-7-.48-.63H14V3.5l-.5-.5H7.71l-.86-.85L6.5 2h-5l-.5.5v11l.5.5zM2 3h4.29l.86.85.35.15H13v2H8.5l-.35.15-.86.85H3.5l-.47.34-1 3.08L2 3zm10.13 10H2.19l1.67-5H7.5l.35-.15.86-.85h5.79l-2.37 6z"/>'
	      }, props)
	  };
	  vs.VsFolder = function VsFolder(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l-.01 4zm0-6.49h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99z"/>'
	      }, props)
	  };
	  vs.VsGear = function VsGear(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/>'
	      }, props)
	  };
	  vs.VsGift = function VsGift(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.5 4h-1.6c.1-.4.1-.8.1-1.2-.1-.3-.2-.6-.4-.9-.2-.3-.4-.5-.7-.6-.3-.1-.6-.3-.9-.3-.3 0-.6 0-.9.2-.7.2-1.2.7-1.6 1.3-.4-.6-.9-1.1-1.6-1.3-.3-.1-.6-.2-.9-.2-.3 0-.6.1-.9.3-.3.1-.5.3-.7.6-.2.2-.3.6-.4.9 0 .4 0 .8.1 1.2H1.5l-.5.5v9l.5.5h12l.5-.5v-9l-.5-.5zM7 13H2V5h5v8zm0-9H4v-.2c-.1-.3-.1-.5-.1-.8.1-.2.1-.4.3-.5.1-.2.3-.3.5-.4.1-.1.3-.1.5-.1s.4 0 .6.1c.3.1.6.3.8.6.2.3.4.6.4 1V4zm1-.3c0-.4.2-.7.4-1 .2-.3.5-.5.8-.6.2-.1.4-.1.6-.1.2 0 .4 0 .6.1.2.1.3.2.5.4.1.1.1.3.2.5 0 .3 0 .5-.1.8 0 .1 0 .1-.1.2H8v-.3zm5 9.3H8V5h5v8z"/>'
	      }, props)
	  };
	  vs.VsGistSecret = function VsGistSecret(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3 14h4v.91l.09.09H2.5l-.5-.5v-13l.5-.5h7.72l.35.14 3.28 3.3.15.36v2.54a3.1 3.1 0 00-1-.94V6H9.5L9 5.5V2H3v12zm10-9l-3-3v3h3zm.5 4v1h1l.5.5v4l-.5.5h-6l-.5-.5v-4l.5-.5h1V9a2 2 0 014 0zm-2.707-.707A1 1 0 0010.5 9v1h2V9a1 1 0 00-1.707-.707zM9 11v3h5v-3H9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGist = function VsGist(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.57 1.14l3.28 3.3.15.36v9.7l-.5.5h-11l-.5-.5v-13l.5-.5h7.72l.35.14zM10 5h3l-3-3v3zM3 2v12h10V6H9.5L9 5.5V2H3zm2.062 7.533l1.817-1.828L6.17 7 4 9.179v.707l2.171 2.174.707-.707-1.816-1.82zM8.8 7.714l.7-.709 2.189 2.175v.709L9.5 12.062l-.705-.709 1.831-1.82L8.8 7.714z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGitCommit = function VsGitCommit(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.5 0h1v4.03a4 4 0 010 7.94V16h-1v-4.03a4 4 0 010-7.94V0zM8 10.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"/>'
	      }, props)
	  };
	  vs.VsGitCompare = function VsGitCompare(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.389 12.99l-1.27-1.27.67-.7 2.13 2.13v.7l-2.13 2.13-.71-.71L7.349 14h-1.85a2.49 2.49 0 01-2.5-2.5V5.95a2.59 2.59 0 01-1.27-.68 2.52 2.52 0 01-.54-2.73A2.5 2.5 0 013.499 1a2.45 2.45 0 011 .19 2.48 2.48 0 011.35 1.35c.133.317.197.658.19 1a2.5 2.5 0 01-2 2.45v5.5a1.5 1.5 0 001.5 1.5h1.85zm-4.68-8.25a1.5 1.5 0 002.08-2.08 1.55 1.55 0 00-.68-.56 1.49 1.49 0 00-.86-.08 1.49 1.49 0 00-1.18 1.18 1.49 1.49 0 00.08.86c.117.277.311.513.56.68zm10.33 6.3c.48.098.922.335 1.27.68a2.51 2.51 0 01.31 3.159 2.5 2.5 0 11-3.47-3.468c.269-.182.571-.308.89-.37V5.49a1.5 1.5 0 00-1.5-1.5h-1.85l1.27 1.27-.71.71-2.13-2.13v-.7l2.13-2.13.71.71-1.27 1.27h1.85a2.49 2.49 0 012.5 2.5v5.55zm-.351 3.943a1.5 1.5 0 001.1-2.322 1.55 1.55 0 00-.68-.56 1.49 1.49 0 00-.859-.08 1.49 1.49 0 00-1.18 1.18 1.49 1.49 0 00.08.86 1.5 1.5 0 001.539.922z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGitMerge = function VsGitMerge(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.273 7.73a2.51 2.51 0 00-3.159-.31 2.5 2.5 0 00-.921 1.12 2.23 2.23 0 00-.13.44 4.52 4.52 0 01-4-4 2.23 2.23 0 00.44-.13 2.5 2.5 0 001.54-2.31 2.45 2.45 0 00-.19-1A2.48 2.48 0 005.503.19a2.45 2.45 0 00-1-.19 2.5 2.5 0 00-2.31 1.54 2.52 2.52 0 00.54 2.73c.35.343.79.579 1.27.68v5.1a2.411 2.411 0 00-.89.37 2.5 2.5 0 103.47 3.468 2.5 2.5 0 00.42-1.387 2.45 2.45 0 00-.19-1 2.48 2.48 0 00-1.81-1.49v-2.4a5.52 5.52 0 002 1.73 5.65 5.65 0 002.09.6 2.5 2.5 0 004.95-.49 2.51 2.51 0 00-.77-1.72zm-8.2 3.38c.276.117.512.312.68.56a1.5 1.5 0 01-2.08 2.08 1.55 1.55 0 01-.56-.68 1.49 1.49 0 01-.08-.86 1.49 1.49 0 011.18-1.18 1.49 1.49 0 01.86.08zM4.503 4a1.5 1.5 0 01-1.39-.93 1.49 1.49 0 01-.08-.86 1.49 1.49 0 011.18-1.18 1.49 1.49 0 01.86.08A1.5 1.5 0 014.503 4zm8.06 6.56a1.5 1.5 0 01-2.45-.49 1.49 1.49 0 01-.08-.86 1.49 1.49 0 011.18-1.18 1.49 1.49 0 01.86.08 1.499 1.499 0 01.49 2.45z"/>'
	      }, props)
	  };
	  vs.VsGitPullRequestClosed = function VsGitPullRequestClosed(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.616 4.928a2.487 2.487 0 01-1.119.922c-.148.06-.458.138-.458.138v5.008a2.51 2.51 0 011.579 1.062c.273.412.419.895.419 1.388.008.343-.057.684-.19 1A2.485 2.485 0 013.5 15.984a2.48 2.48 0 01-1.388-.42A2.486 2.486 0 011.05 13c.095-.486.331-.932.68-1.283.349-.343.79-.579 1.269-.68V5.949a2.6 2.6 0 01-1.269-.68 2.503 2.503 0 01-.68-1.283A2.487 2.487 0 012.11 1.421 2.49 2.49 0 013.5 1a2.504 2.504 0 011.807.729 2.493 2.493 0 01.729 1.81c.002.494-.144.977-.42 1.389zm-.756 7.861a1.5 1.5 0 00-.552-.579 1.45 1.45 0 00-.77-.21 1.495 1.495 0 00-1.47 1.79 1.493 1.493 0 001.18 1.179c.288.058.586.03.86-.08.276-.117.512-.312.68-.56.15-.226.235-.49.249-.76a1.51 1.51 0 00-.177-.78zM2.708 4.741c.247.161.536.25.83.25.271 0 .538-.075.77-.211a1.514 1.514 0 00.729-1.36 1.513 1.513 0 00-.25-.76 1.551 1.551 0 00-.68-.559 1.49 1.49 0 00-.86-.08 1.494 1.494 0 00-1.179 1.18c-.058.288-.03.586.08.86.117.276.312.512.56.68zm10.329 6.296c.48.097.922.335 1.269.68.466.47.729 1.107.725 1.766.002.493-.144.977-.42 1.388a2.5 2.5 0 01-3.848.384 2.5 2.5 0 01.382-3.848c.268-.183.572-.308.89-.37V7.489h1.002v3.548zm.557 3.508a1.493 1.493 0 00.191-1.888 1.551 1.551 0 00-.68-.56 1.49 1.49 0 00-.86-.08 1.493 1.493 0 00-1.179 1.18 1.49 1.49 0 00.08.86 1.497 1.497 0 002.448.49zM11.688 3.4L10 5.088l.707.707 1.688-1.688 1.687 1.688.707-.707L13.103 3.4l1.688-1.687-.708-.707-1.687 1.687-1.688-1.687-.707.707L11.688 3.4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGitPullRequestCreate = function VsGitPullRequestCreate(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.616 4.928a2.487 2.487 0 01-1.119.922c-.148.06-.458.138-.458.138v5.008a2.51 2.51 0 011.579 1.062c.273.412.419.895.419 1.388.008.343-.057.684-.19 1A2.485 2.485 0 013.5 15.984a2.482 2.482 0 01-1.388-.419A2.487 2.487 0 011.05 13c.095-.486.331-.932.68-1.283.349-.343.79-.579 1.269-.68V5.949a2.6 2.6 0 01-1.269-.68 2.503 2.503 0 01-.68-1.283 2.487 2.487 0 011.06-2.565A2.49 2.49 0 013.5 1a2.504 2.504 0 011.807.729 2.493 2.493 0 01.729 1.81c.002.494-.144.978-.42 1.389zm-.756 7.861a1.5 1.5 0 00-.552-.579 1.45 1.45 0 00-.77-.21 1.495 1.495 0 00-1.47 1.79 1.493 1.493 0 001.18 1.179c.288.058.586.03.86-.08.276-.117.512-.312.68-.56.15-.226.235-.49.249-.76a1.51 1.51 0 00-.177-.78zM2.708 4.741c.247.161.536.25.83.25.271 0 .538-.075.77-.211a1.514 1.514 0 00.729-1.359 1.513 1.513 0 00-.25-.76 1.551 1.551 0 00-.68-.56 1.49 1.49 0 00-.86-.08 1.494 1.494 0 00-1.179 1.18c-.058.288-.03.586.08.86.117.276.312.512.56.68zM13.037 7h-1.002V5.49a1.5 1.5 0 00-1.5-1.5H8.687l1.269 1.27-.71.709L7.117 3.84v-.7l2.13-2.13.71.711-1.269 1.27h1.85a2.484 2.484 0 012.312 1.541c.125.302.189.628.187.957V7zM13 16h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGitPullRequestDraft = function VsGitPullRequestDraft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4.497 5.85c.456-.19.846-.511 1.119-.922.275-.412.421-.895.419-1.388a2.493 2.493 0 00-1.538-2.35 2.504 2.504 0 00-.998-.19 2.49 2.49 0 00-1.388.42A2.487 2.487 0 001.05 3.987c.095.486.331.932.68 1.283a2.6 2.6 0 001.269.68v5.088c-.48.101-.92.337-1.269.68-.349.35-.585.797-.68 1.283a2.486 2.486 0 001.062 2.565 2.48 2.48 0 001.388.419 2.44 2.44 0 001-.19 2.485 2.485 0 001.538-2.349 2.51 2.51 0 00-1.998-2.45V5.989s.31-.078.458-.138zm-.189 6.36a1.5 1.5 0 01.48 2.12 1.551 1.551 0 01-.68.559 1.492 1.492 0 01-.86.08 1.487 1.487 0 01-1.18-1.18 1.49 1.49 0 01.08-.86c.117-.276.312-.512.56-.68.245-.164.534-.25.83-.25.271-.003.538.07.77.211zm-.77-7.22a1.52 1.52 0 01-.83-.25 1.551 1.551 0 01-.56-.68 1.491 1.491 0 01-.08-.86 1.486 1.486 0 011.18-1.179 1.49 1.49 0 01.86.08c.276.117.512.312.68.56A1.49 1.49 0 014.86 4.2c-.129.24-.32.438-.552.579-.232.136-.499.21-.77.21z"/><path fill-rule="evenodd" d="M15.054 13.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-2.5 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/><circle cx="12.554" cy="7.751" r="1"/><circle cx="12.554" cy="3.501" r="1"/>'
	      }, props)
	  };
	  vs.VsGitPullRequestGoToChanges = function VsGitPullRequestGoToChanges(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3 10v4l1 1h9l1-1V5l-.29-.71-3-3L10 1H8v1h2l3 3v9H4v-4H3zm8-4H9V4H8v2H6v1h2v2h1V7h2V6zm-5 5h5v1H6v-1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.06 3.854L4.915 6l-.707-.707L5.5 4h-3a1.5 1.5 0 000 3H3v1h-.5a2.5 2.5 0 110-5h3L4.207 1.707 4.914 1l2.147 2.146v.708z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGitPullRequestNewChanges = function VsGitPullRequestNewChanges(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h5.354a4.019 4.019 0 01-.819-1H4V2h6l3 3v3.126c.355.091.69.23 1 .41V5l-.29-.71zM8.126 11H6v1h2c0-.345.044-.68.126-1zM6 6h2V4h1v2h2v1H9v2H8V7H6V6z" clip-rule="evenodd"/><path d="M12 9a3 3 0 100 6 3 3 0 000-6z"/>'
	      }, props)
	  };
	  vs.VsGitPullRequest = function VsGitPullRequest(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.616 4.928a2.487 2.487 0 01-1.119.922c-.148.06-.458.138-.458.138v5.008a2.51 2.51 0 011.579 1.062c.273.412.419.895.419 1.388.008.343-.057.684-.19 1A2.485 2.485 0 013.5 15.984a2.482 2.482 0 01-1.388-.419A2.487 2.487 0 011.05 13c.095-.486.331-.932.68-1.283.349-.343.79-.579 1.269-.68V5.949a2.6 2.6 0 01-1.269-.68 2.503 2.503 0 01-.68-1.283 2.487 2.487 0 011.06-2.565A2.49 2.49 0 013.5 1a2.504 2.504 0 011.807.729 2.493 2.493 0 01.729 1.81c.002.494-.144.978-.42 1.389zm-.756 7.861a1.5 1.5 0 00-.552-.579 1.45 1.45 0 00-.77-.21 1.495 1.495 0 00-1.47 1.79 1.493 1.493 0 001.18 1.179c.288.058.586.03.86-.08.276-.117.512-.312.68-.56.15-.226.235-.49.249-.76a1.51 1.51 0 00-.177-.78zM2.708 4.741c.247.161.536.25.83.25.271 0 .538-.075.77-.211a1.514 1.514 0 00.729-1.359 1.513 1.513 0 00-.25-.76 1.551 1.551 0 00-.68-.56 1.49 1.49 0 00-.86-.08 1.494 1.494 0 00-1.179 1.18c-.058.288-.03.586.08.86.117.276.312.512.56.68zm10.329 6.296c.48.097.922.335 1.269.68.466.47.729 1.107.725 1.766.002.493-.144.977-.42 1.388a2.499 2.499 0 01-4.532-.899 2.5 2.5 0 011.067-2.565c.267-.183.571-.308.889-.37V5.489a1.5 1.5 0 00-1.5-1.499H8.687l1.269 1.27-.71.709L7.117 3.84v-.7l2.13-2.13.71.711-1.269 1.27h1.85a2.484 2.484 0 012.312 1.541c.125.302.189.628.187.957v5.548zm.557 3.509a1.493 1.493 0 00.191-1.89 1.552 1.552 0 00-.68-.559 1.49 1.49 0 00-.86-.08 1.493 1.493 0 00-1.179 1.18 1.49 1.49 0 00.08.86 1.496 1.496 0 002.448.49z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGithubAction = function VsGithubAction(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.04 10h2.58l.65 1H2.54l-.5-.5v-9l.5-.5h12l.5.5v4.77l-1-1.75V2h-11v8zm5.54 1l-1.41 3.47h2.2L15 8.7 14.27 7h-1.63l.82-1.46L12.63 4H9.76l-.92.59-2.28 5L7.47 11h1.11zm1.18-6h2.87l-1.87 3h3.51l-5.76 5.84L10.2 10H7.47l2.29-5zM6.95 7H4.04V6H7.4l-.45 1zm-.9 2H4.04V8H6.5l-.45 1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGithubAlt = function VsGithubAlt(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M21.035 5.257c.91 1.092 1.364 2.366 1.364 3.822 0 5.277-3.002 6.824-5.823 7.279.364.637.455 1.365.455 2.093v3.73c0 .455-.273.728-.637.728a.718.718 0 01-.728-.728v-3.73a2.497 2.497 0 00-.728-2.093l.455-1.183c2.821-.364 5.733-1.274 5.733-6.187 0-1.183-.455-2.275-1.274-3.185l-.182-.727a4.04 4.04 0 00.09-2.73c-.454.09-1.364.273-2.91 1.365l-.547.09a13.307 13.307 0 00-6.55 0l-.547-.09C7.57 2.71 6.66 2.437 6.204 2.437c-.273.91-.273 1.91.09 2.73l-.181.727c-.91.91-1.365 2.093-1.365 3.185 0 4.822 2.73 5.823 5.732 6.187l.364 1.183c-.546.546-.819 1.274-.728 2.002v3.821a.718.718 0 01-.728.728.718.718 0 01-.728-.728V20.18c-3.002.637-4.185-.91-5.095-2.092-.455-.546-.819-1.001-1.274-1.092-.09-.091-.364-.455-.273-.819.091-.364.455-.637.82-.455.91.182 1.455.91 2 1.547.82 1.092 1.639 2.092 4.095 1.547v-.364c-.09-.728.091-1.456.455-2.093-2.73-.546-5.914-2.093-5.914-7.279 0-1.456.455-2.73 1.365-3.822-.273-1.273-.182-2.638.273-3.73l.455-.364C5.749 1.073 7.023.8 9.66 2.437a13.673 13.673 0 016.642 0C18.851.708 20.216.98 20.398 1.072l.455.364c.455 1.274.546 2.548.182 3.821z"/>'
	      }, props)
	  };
	  vs.VsGithubInverted = function VsGithubInverted(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.976 0A7.977 7.977 0 000 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 01.832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.984 7.984 0 0016 7.976C15.951 3.572 12.38 0 7.976 0z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGithub = function VsGithub(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M12 0a12 12 0 100 24 12 12 0 000-24zm3.163 21.783h-.093a.513.513 0 01-.382-.14.513.513 0 01-.14-.372v-1.406c.006-.467.01-.94.01-1.416a3.693 3.693 0 00-.151-1.028 1.832 1.832 0 00-.542-.875 8.014 8.014 0 002.038-.471 4.051 4.051 0 001.466-.964c.407-.427.71-.943.885-1.506a6.77 6.77 0 00.3-2.13 4.138 4.138 0 00-.26-1.476 3.892 3.892 0 00-.795-1.284 2.81 2.81 0 00.162-.582c.033-.2.05-.402.05-.604 0-.26-.03-.52-.09-.773a5.309 5.309 0 00-.221-.763.293.293 0 00-.111-.02h-.11c-.23.002-.456.04-.674.111a5.34 5.34 0 00-.703.26 6.503 6.503 0 00-.661.343c-.215.127-.405.249-.573.362a9.578 9.578 0 00-5.143 0 13.507 13.507 0 00-.572-.362 6.022 6.022 0 00-.672-.342 4.516 4.516 0 00-.705-.261 2.203 2.203 0 00-.662-.111h-.11a.29.29 0 00-.11.02 5.844 5.844 0 00-.23.763c-.054.254-.08.513-.081.773 0 .202.017.404.051.604.033.199.086.394.16.582A3.888 3.888 0 005.702 10a4.142 4.142 0 00-.263 1.476 6.871 6.871 0 00.292 2.12c.181.563.483 1.08.884 1.516.415.422.915.75 1.466.964.653.25 1.337.41 2.033.476a1.828 1.828 0 00-.452.633 2.99 2.99 0 00-.2.744 2.754 2.754 0 01-1.175.27 1.788 1.788 0 01-1.065-.3 2.904 2.904 0 01-.752-.824 3.1 3.1 0 00-.292-.382 2.693 2.693 0 00-.372-.343 1.841 1.841 0 00-.432-.24 1.2 1.2 0 00-.481-.101c-.04.001-.08.005-.12.01a.649.649 0 00-.162.02.408.408 0 00-.13.06.116.116 0 00-.06.1.33.33 0 00.14.242c.093.074.17.131.232.171l.03.021c.133.103.261.214.382.333.112.098.213.209.3.33.09.119.168.246.231.381.073.134.15.288.231.463.188.474.522.875.954 1.145.453.243.961.364 1.476.351.174 0 .349-.01.522-.03.172-.028.343-.057.515-.091v1.743a.5.5 0 01-.533.521h-.062a10.286 10.286 0 116.324 0v.005z"/>'
	      }, props)
	  };
	  vs.VsGlobe = function VsGlobe(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.5 1a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm4.894 4a5.527 5.527 0 00-3.053-2.676c.444.84.765 1.74.953 2.676h2.1zm.582 2.995A5.11 5.11 0 0014 7.5a5.464 5.464 0 00-.213-1.5h-2.342c.032.331.055.664.055 1a10.114 10.114 0 01-.206 2h2.493c.095-.329.158-.665.19-1.005zm-3.535 0l.006-.051A9.04 9.04 0 0010.5 7a8.994 8.994 0 00-.076-1H6.576A8.82 8.82 0 006.5 7a8.98 8.98 0 00.233 2h3.534c.077-.332.135-.667.174-1.005zM10.249 5a8.974 8.974 0 00-1.255-2.97C8.83 2.016 8.666 2 8.5 2a3.62 3.62 0 00-.312.015l-.182.015L8 2.04A8.97 8.97 0 006.751 5h3.498zM5.706 5a9.959 9.959 0 01.966-2.681A5.527 5.527 0 003.606 5h2.1zM3.213 6A5.48 5.48 0 003 7.5 5.48 5.48 0 003.213 9h2.493A10.016 10.016 0 015.5 7c0-.336.023-.669.055-1H3.213zm2.754 4h-2.36a5.515 5.515 0 003.819 2.893A10.023 10.023 0 015.967 10zM8.5 12.644A8.942 8.942 0 009.978 10H7.022A8.943 8.943 0 008.5 12.644zM11.033 10a10.024 10.024 0 01-1.459 2.893A5.517 5.517 0 0013.393 10h-2.36z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGoToFile = function VsGoToFile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 5.914l2.06-2.06v-.708L5.915 1l-.707.707.043.043.25.25 1 1h-3a2.5 2.5 0 000 5H4V7h-.5a1.5 1.5 0 110-3h3L5.207 5.293 5.914 6 6 5.914zM11 2H8.328l-1-1H12l.71.29 3 3L16 5v9l-1 1H6l-1-1V6.5l1 .847V14h9V6h-4V2zm1 0v3h3l-3-3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGrabber = function VsGrabber(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M15 6H1v1h14V6zm0 3H1v1h14V9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGraphLeft = function VsGraphLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.119 4L3 4.881l-.619.619L.715 3.833v-.618L2.38 1.548l.62.619L2.167 3H15v1H2.119zM4 14.546V5.455L4.5 5h2l.5.455v9.09L6.5 15h-2l-.5-.454zm2-.455V5.909H5v8.182h1zm2-1.535V5.444L8.5 5h2l.5.444v7.112l-.5.444h-2l-.5-.444zm2-.445V5.89H9v6.222h1zm2-6.682v5.143l.5.428h2l.5-.428V5.429L14.5 5h-2l-.5.429zm2 .428v4.286h-1V5.857h1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGraphLine = function VsGraphLine(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 13v1H1.5l-.5-.5V0h1v13h13z"/><path d="M13 3.207L7.854 8.354h-.708L5.5 6.707l-3.646 3.647-.708-.708 4-4h.708L7.5 7.293l5.146-5.147h.707l2 2-.707.708L13 3.207z"/>'
	      }, props)
	  };
	  vs.VsGraphScatter = function VsGraphScatter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 13v1H1.5l-.5-.5V0h1v13h13z"/><path d="M5 2h2v2H5zM12 1h2v2h-2zM8 5h2v2H8zM5 9h2v2H5zM12 8h2v2h-2z"/>'
	      }, props)
	  };
	  vs.VsGraph = function VsGraph(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 14H15v-1H2V0H1v13.5l.5.5zM3 11.5v-8l.5-.5h2l.5.5v8l-.5.5h-2l-.5-.5zm2-.5V4H4v7h1zm6-9.5v10l.5.5h2l.5-.5v-10l-.5-.5h-2l-.5.5zm2 .5v9h-1V2h1zm-6 9.5v-6l.5-.5h2l.5.5v6l-.5.5h-2l-.5-.5zm2-.5V6H8v5h1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsGripper = function VsGripper(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5 3h2v2H5zm0 4h2v2H5zm0 4h2v2H5zm4-8h2v2H9zm0 4h2v2H9zm0 4h2v2H9z"/>'
	      }, props)
	  };
	  vs.VsGroupByRefType = function VsGroupByRefType(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h2v1H2v12h1.5v1h-2l-.5-.5v-13l.5-.5zm6 6h-2L5 6.5v-2l.5-.5h2l.5.5v2l-.5.5zM6 6h1V5H6v1zm7.5 1h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM11 6h2V4h-2v2zm-3.5 6h-2l-.5-.5v-2l.5-.5h2l.5.5v2l-.5.5zM6 11h1v-1H6v1zm7.5 2h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM11 12h2v-2h-2v2zm-1-2H8v1h2v-1zm0-5H8v1h2V5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsHeartFilled = function VsHeartFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.88 4.78a3.489 3.489 0 00-.37-.9 3.24 3.24 0 00-.6-.79 3.78 3.78 0 00-1.21-.81 3.74 3.74 0 00-2.84 0 4 4 0 00-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 00-1.16-.75 3.74 3.74 0 00-2.84 0 3.78 3.78 0 00-1.21.81 3.55 3.55 0 00-.97 1.69 3.75 3.75 0 00-.12 1c0 .318.04.634.12.94a4 4 0 00.36.89 3.8 3.8 0 00.61.79L8 14.31l5.91-5.91c.237-.232.44-.498.6-.79A3.578 3.578 0 0015 5.78a3.747 3.747 0 00-.12-1z"/>'
	      }, props)
	  };
	  vs.VsHeart = function VsHeart(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.88 4.78a3.489 3.489 0 00-.37-.9 3.24 3.24 0 00-.6-.79 3.78 3.78 0 00-1.21-.81 3.74 3.74 0 00-2.84 0 4 4 0 00-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 00-1.16-.75 3.74 3.74 0 00-2.84 0 3.78 3.78 0 00-1.21.81 3.55 3.55 0 00-.97 1.69 3.75 3.75 0 00-.12 1c0 .317.04.633.12.94a4 4 0 00.36.89 3.8 3.8 0 00.61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0015 5.78a3.747 3.747 0 00-.12-1zm-1 1.63a2.69 2.69 0 01-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 01-.44-.57 3 3 0 01-.27-.65 3.25 3.25 0 01-.08-.69A3.36 3.36 0 012.06 5a2.8 2.8 0 01.27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 01.89-.6 2.8 2.8 0 012.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 01.88-.59 2.8 2.8 0 012.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 01.35 1.34 2.6 2.6 0 01-.06.72h-.03z"/>'
	      }, props)
	  };
	  vs.VsHistory = function VsHistory(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.507 12.324a7 7 0 00.065-8.56A7 7 0 002 4.393V2H1v3.5l.5.5H5V5H2.811a6.008 6.008 0 11-.135 5.77l-.887.462a7 7 0 0011.718 1.092zm-3.361-.97l.708-.707L8 7.792V4H7v4l.146.354 3 3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsHome = function VsHome(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.36 1.37l6.36 5.8-.71.71L13 6.964v6.526l-.5.5h-3l-.5-.5v-3.5H7v3.5l-.5.5h-3l-.5-.5V6.972L2 7.88l-.71-.71 6.35-5.8h.72zM4 6.063v6.927h2v-3.5l.5-.5h3l.5.5v3.5h2V6.057L8 2.43 4 6.063z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsHorizontalRule = function VsHorizontalRule(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6.432 10h.823V4h-.823v2.61h-2.61V4H3v6h.823V7.394h2.61V10zm5.668 0h.9l-1.28-2.63c.131-.058.26-.134.389-.23a1.666 1.666 0 00.585-.797c.064-.171.096-.364.096-.58a1.77 1.77 0 00-.082-.557 1.644 1.644 0 00-.22-.446 1.504 1.504 0 00-.31-.341 1.864 1.864 0 00-.737-.373A1.446 1.446 0 0011.1 4H8.64v6h.824V7.518h1.467L12.1 10zm-.681-3.32a.874.874 0 01-.293.055H9.463V4.787h1.663a.87.87 0 01.576.24.956.956 0 01.306.737c0 .168-.029.314-.087.437a.91.91 0 01-.503.479zM13 12H3v1h10v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsHubot = function VsHubot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.48 4h4l.5.5v2.03h.52l.5.5V8l-.5.5h-.52v3l-.5.5H9.36l-2.5 2.76L6 14.4V12H3.5l-.5-.64V8.5h-.5L2 8v-.97l.5-.5H3V4.36L3.53 4h4V2.86A1 1 0 017 2a1 1 0 012 0 1 1 0 01-.52.83V4zM12 8V5H4v5.86l2.5.14H7v2.19l1.8-2.04.35-.15H12V8zm-2.12.51a2.71 2.71 0 01-1.37.74v-.01a2.71 2.71 0 01-2.42-.74l-.7.71c.34.34.745.608 1.19.79.45.188.932.286 1.42.29a3.7 3.7 0 002.58-1.07l-.7-.71zM6.49 6.5h-1v1h1v-1zm3 0h1v1h-1v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsInbox = function VsInbox(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 14h13l.5-.5V9l-2.77-7.66-.47-.34H4.27l-.47.33L1 8.74v4.76l.5.5zM14 13H2v-2.98h2.55l.74 1.25.43.24h4.57l.44-.26.69-1.23H14V13zm-.022-3.98H11.12l-.43.26-.69 1.23H6.01l-.75-1.25-.43-.24H2V9l2.62-7h6.78l2.578 7.02z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsIndent = function VsIndent(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 5v1.984a.5.5 0 00.5.5h6.882L9.749 5.851l.707-.707 2.121 2.121.423.423v.568L10.456 10.8l-.707-.707 1.61-1.609H4.5a1.5 1.5 0 01-1.5-1.5V5h1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsInfo = function VsInfo(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.568 1.031A6.8 6.8 0 0112.76 3.05a7.06 7.06 0 01.46 9.39 6.85 6.85 0 01-8.58 1.74 7 7 0 01-3.12-3.5 7.12 7.12 0 01-.23-4.71 7 7 0 012.77-3.79 6.8 6.8 0 014.508-1.149zM9.04 13.88a5.89 5.89 0 003.41-2.07 6.07 6.07 0 00-.4-8.06 5.82 5.82 0 00-7.43-.74 6.06 6.06 0 00.5 10.29 5.81 5.81 0 003.92.58zM7.375 6h1.25V5h-1.25v1zm1.25 1v4h-1.25V7h1.25z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsInspect = function VsInspect(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 3l1-1h12l1 1v6h-1V3H2v8h5v1H2l-1-1V3zm14.707 9.707L9 6v9.414l2.707-2.707h4zM10 13V8.414l3.293 3.293h-2L10 13z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsIssueDraft = function VsIssueDraft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.732 9.2l.952.31A6.494 6.494 0 0014 7.5c0-.701-.111-1.377-.316-2.01l-.952.31c.174.534.268 1.105.268 1.7s-.094 1.166-.268 1.7zm-.33-4.197l.89-.455a6.529 6.529 0 00-2.84-2.84l-.455.89a5.528 5.528 0 012.405 2.405zM9.2 2.268l.31-.951A6.495 6.495 0 007.5 1c-.701 0-1.377.111-2.01.317l.31.95A5.495 5.495 0 017.5 2c.595 0 1.166.094 1.7.268zm-4.197.33l-.455-.89a6.528 6.528 0 00-2.84 2.84l.89.455a5.528 5.528 0 012.405-2.405zM1 7.5c0-.701.111-1.377.317-2.01l.95.31A5.495 5.495 0 002 7.5c0 .595.094 1.166.268 1.7l-.951.31A6.495 6.495 0 011 7.5zm1.598 2.497l-.89.455a6.529 6.529 0 002.84 2.84l.455-.89a5.528 5.528 0 01-2.405-2.405zM5.8 12.732l-.31.952A6.494 6.494 0 007.5 14c.701 0 1.377-.111 2.01-.316l-.31-.952A5.497 5.497 0 017.5 13a5.497 5.497 0 01-1.7-.268zm4.197-.33l.455.89a6.53 6.53 0 002.84-2.84l-.89-.455a5.528 5.528 0 01-2.405 2.405zM7.5 8.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsIssueReopened = function VsIssueReopened(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.28 5.656L2 7.006l-.66-.26L0 3.506l.92-.38.81 1.95a6.48 6.48 0 0112.48 1.93h-1a5.48 5.48 0 00-10.64-1.28l2.32-1 .39.93zm8.86 2.68l1.34 3.23-.92.44-.82-2a6.49 6.49 0 01-12.5-2h1v-.5a5.49 5.49 0 0010.64 1.89l-2.25.93-.39-.92 3.25-1.35.65.28z" clip-rule="evenodd"/><circle cx="7.74" cy="7.54" r="1"/>'
	      }, props)
	  };
	  vs.VsIssues = function VsIssues(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.5 1a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 12a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"/><circle cx="7.5" cy="7.5" r="1"/>'
	      }, props)
	  };
	  vs.VsItalic = function VsItalic(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M9.001 13.593l-.097.325H4l.123-.325c.492-.012.817-.053.976-.123.257-.1.448-.238.57-.413.194-.276.394-.768.599-1.477l2.074-7.19c.176-.597.263-1.048.263-1.353a.643.643 0 00-.114-.387.683.683 0 00-.351-.237c-.153-.059-.454-.088-.906-.088L7.34 2h4.605l-.096.325c-.375-.006-.654.035-.835.123a1.358 1.358 0 00-.607.501c-.134.217-.31.697-.527 1.442l-2.066 7.19c-.187.661-.28 1.083-.28 1.265 0 .146.034.272.105.378.076.1.193.178.351.237.164.053.501.097 1.011.132z"/>'
	      }, props)
	  };
	  vs.VsJersey = function VsJersey(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M11.91 14.22H4.06l-.5-.5V7.06H2.15l-.48-.38L1 4l.33-.6L5.59 2l.64.32a2.7 2.7 0 00.21.44c.071.103.152.2.24.29.168.169.369.302.59.39a1.82 1.82 0 001.43 0 1.74 1.74 0 00.59-.39c.09-.095.173-.195.25-.3l.15-.29a1.21 1.21 0 00.05-.14l.64-.32 4.26 1.42L15 4l-.66 2.66-.49.38h-1.44v6.66l-.5.52zm-7.35-1h6.85V6.56l.5-.5h1.52l.46-1.83-3.4-1.14a1.132 1.132 0 01-.12.21c-.11.161-.233.312-.37.45a2.75 2.75 0 01-.91.61 2.85 2.85 0 01-2.22 0A2.92 2.92 0 016 3.75a2.17 2.17 0 01-.36-.44l-.13-.22-3.43 1.14.46 1.83h1.52l.5.5v6.66z"/>'
	      }, props)
	  };
	  vs.VsJson = function VsJson(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 2.984V2h-.09c-.313 0-.616.062-.909.185a2.33 2.33 0 00-.775.53 2.23 2.23 0 00-.493.753v.001a3.542 3.542 0 00-.198.83v.002a6.08 6.08 0 00-.024.863c.012.29.018.58.018.869 0 .203-.04.393-.117.572v.001a1.504 1.504 0 01-.765.787 1.376 1.376 0 01-.558.115H2v.984h.09c.195 0 .38.04.556.121l.001.001c.178.078.329.184.455.318l.002.002c.13.13.233.285.307.465l.001.002c.078.18.117.368.117.566 0 .29-.006.58-.018.869-.012.296-.004.585.024.87v.001c.033.283.099.558.197.824v.001c.106.273.271.524.494.753.223.23.482.407.775.53.293.123.596.185.91.185H6v-.984h-.09c-.2 0-.387-.038-.563-.115a1.613 1.613 0 01-.457-.32 1.659 1.659 0 01-.309-.467c-.074-.18-.11-.37-.11-.573 0-.228.003-.453.011-.672.008-.228.008-.45 0-.665a4.639 4.639 0 00-.055-.64 2.682 2.682 0 00-.168-.609A2.284 2.284 0 003.522 8a2.284 2.284 0 00.738-.955c.08-.192.135-.393.168-.602.033-.21.051-.423.055-.64.008-.22.008-.442 0-.666-.008-.224-.012-.45-.012-.678a1.47 1.47 0 01.877-1.354 1.33 1.33 0 01.563-.121H6zm4 10.032V14h.09c.313 0 .616-.062.909-.185.293-.123.552-.3.775-.53.223-.23.388-.48.493-.753v-.001c.1-.266.165-.543.198-.83v-.002c.028-.28.036-.567.024-.863-.012-.29-.018-.58-.018-.869 0-.203.04-.393.117-.572v-.001a1.502 1.502 0 01.765-.787 1.38 1.38 0 01.558-.115H14v-.984h-.09c-.196 0-.381-.04-.557-.121l-.001-.001a1.376 1.376 0 01-.455-.318l-.002-.002a1.415 1.415 0 01-.307-.465v-.002a1.405 1.405 0 01-.118-.566c0-.29.006-.58.018-.869a6.174 6.174 0 00-.024-.87v-.001a3.537 3.537 0 00-.197-.824v-.001a2.23 2.23 0 00-.494-.753 2.331 2.331 0 00-.775-.53 2.325 2.325 0 00-.91-.185H10v.984h.09c.2 0 .387.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.285 2.285 0 00.738.955 2.285 2.285 0 00-.738.955 2.689 2.689 0 00-.168.602c-.033.21-.051.423-.055.64a9.15 9.15 0 000 .666c.008.224.012.45.012.678a1.471 1.471 0 01-.877 1.354 1.33 1.33 0 01-.563.121H10z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsKebabVertical = function VsKebabVertical(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.444 13.832a1 1 0 101.111-1.663 1 1 0 00-1.11 1.662zM8 9a1 1 0 110-2 1 1 0 010 2zm0-5a1 1 0 110-2 1 1 0 010 2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsKey = function VsKey(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.351 1.091a4.528 4.528 0 013.44 3.16c.215.724.247 1.49.093 2.23a4.583 4.583 0 01-4.437 3.6c-.438 0-.874-.063-1.293-.19l-.8.938-.379.175H7v1.5l-.5.5H5v1.5l-.5.5h-3l-.5-.5v-2.307l.146-.353L6.12 6.87a4.464 4.464 0 01-.2-1.405 4.528 4.528 0 015.431-4.375zm1.318 7.2a3.568 3.568 0 001.239-2.005l.004.005A3.543 3.543 0 009.72 2.08a3.576 3.576 0 00-2.8 3.4c-.01.456.07.908.239 1.33l-.11.543L2 12.404v1.6h2v-1.5l.5-.5H6v-1.5l.5-.5h1.245l.876-1.016.561-.14a3.47 3.47 0 001.269.238 3.568 3.568 0 002.218-.795zm-.838-2.732a1 1 0 10-1.662-1.11 1 1 0 001.662 1.11z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLaw = function VsLaw(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.63 7L13 3h1V2H9V1H8v1H3v1h1L2.38 7H2v1h.15c.156.498.473.93.9 1.23a2.47 2.47 0 002.9 0A2.44 2.44 0 006.86 8H7V7h-.45L4.88 3H8v8H6l-.39.18-2 2.51.39.81h9l.39-.81-2-2.51L11 11H9V3h3.13l-1.67 4H10v1h.15a2.48 2.48 0 004.71 0H15V7h-.37zM5.22 8.51a1.52 1.52 0 01-.72.19 1.45 1.45 0 01-.71-.19A1.47 1.47 0 013.25 8h2.5a1.52 1.52 0 01-.53.51zM5.47 7h-2l1-2.4 1 2.4zm5.29 5L12 13.5H5L6.24 12h4.52zm1.78-7.38l1 2.4h-2l1-2.4zm.68 3.91a1.41 1.41 0 01-.72.19 1.35 1.35 0 01-.71-.19 1.55 1.55 0 01-.54-.53h2.5a1.37 1.37 0 01-.53.53z"/>'
	      }, props)
	  };
	  vs.VsLayersActive = function VsLayersActive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.185 1.083l-.558.004-5.909 4.037.004.828L7.63 9.915l.55.004 6.092-3.963.003-.836-6.09-4.037zm-5.293 4.45l5.021-3.43 5.176 3.43-5.176 3.368-5.021-3.368zm4.739 6.882L1.793 8.5h1.795l4.325 2.9 4.459-2.9h1.833l-.8.52a4.002 4.002 0 00-4.21 2.739l-1.013.66-.551-.004zm1.373.776l-1.09.71L3.587 11H1.793l5.838 3.915.55.004 1.02-.663a3.988 3.988 0 01-.197-1.065zM11.333 10.506a3 3 0 113.333 4.987 3 3 0 01-3.333-4.987zm1.698 3.817l1.79-2.387-.8-.6-1.48 1.974-.876-.7-.624.78 1.278 1.023.712-.09z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayersDot = function VsLayersDot(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.185 1.083l-.558.004-5.909 4.037.004.828L7.63 9.915l.55.004 6.092-3.963.003-.836-6.09-4.037zm-5.293 4.45l5.021-3.43 5.176 3.43-5.176 3.368-5.021-3.368zm4.739 6.882L1.793 8.5h1.795l4.325 2.9 4.459-2.9h1.833l-.8.52a4.002 4.002 0 00-4.21 2.739l-1.013.66-.551-.004zm1.373.776l-1.09.71L3.587 11H1.793l5.838 3.915.55.004 1.02-.663a3.988 3.988 0 01-.197-1.065z" clip-rule="evenodd"/><circle cx="13" cy="13" r="3"/>'
	      }, props)
	  };
	  vs.VsLayers = function VsLayers(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.627 1.087l.558-.004 6.091 4.037-.003.836L8.182 9.92l-.551-.004-5.91-3.963-.003-.828 5.91-4.037zm.286 1.016l-5.021 3.43 5.021 3.368 5.176-3.368-5.176-3.43zM1.793 8.5l5.838 3.915.55.004L14.206 8.5h-1.833l-4.459 2.9-4.325-2.9H1.793zm5.838 6.415L1.793 11h1.795l4.325 2.9 4.459-2.9h1.833l-6.023 3.92-.551-.005z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutActivitybarLeft = function VsLayoutActivitybarLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm12 13H4V2h10v12z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutActivitybarRight = function VsLayoutActivitybarRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h10v12H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutCentered = function VsLayoutCentered(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h4v12H2zm8 0V2h4v12h-4z"/>'
	      }, props)
	  };
	  vs.VsLayoutMenubar = function VsLayoutMenubar(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6 3H3v1h3V3zM3 5h3v1H3V5zM6 7H3v1h3V7z"/><path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h12v12H2z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanelCenter = function VsLayoutPanelCenter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h2v12H2zm3-4V2h6v8H5zm7-8h2v12h-2V2z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanelJustify = function VsLayoutPanelJustify(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 9V2h2v8H2zm3 0V2h6v8H5zm7 0V2h2v8h-2z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanelLeft = function VsLayoutPanelLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1 2l1-1h12l1 1v12l-1 1H2l-1-1V2zm1 0v8h8V2H2zm9 0v12h3V2h-3z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanelOff = function VsLayoutPanelOff(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 9V2h12v8H2zm0 1h12v3H2v-3z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanelRight = function VsLayoutPanelRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1 2l1-1h12l1 1v12l-1 1H2l-1-1V2zm1 0v12h3V2H2zm4 0v8h8V2H6z"/>'
	      }, props)
	  };
	  vs.VsLayoutPanel = function VsLayoutPanel(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 9V2h12v8H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutSidebarLeftOff = function VsLayoutSidebarLeftOff(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h4v12H2zm5 0V2h7v12H7z"/>'
	      }, props)
	  };
	  vs.VsLayoutSidebarLeft = function VsLayoutSidebarLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm12 13H7V2h7v12z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutSidebarRightOff = function VsLayoutSidebarRightOff(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h7v12H2zm8 0V2h4v12h-4z"/>'
	      }, props)
	  };
	  vs.VsLayoutSidebarRight = function VsLayoutSidebarRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 13V2h7v12H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayoutStatusbar = function VsLayoutStatusbar(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 1L1 2v12l1 1h12l1-1V2l-1-1H2zm0 12V2h12v11H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLayout = function VsLayout(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3 2L2 3v10l1 1h4l1-1V3L7 2H3zm0 11V3h4v10H3zM10 3l1-1h3l1 1v3l-1 1h-3l-1-1V3zm1 0v3h3V3h-3zM10 10l1-1h3l1 1v3l-1 1h-3l-1-1v-3zm1 0v3h3v-3h-3z"/>'
	      }, props)
	  };
	  vs.VsLibrary = function VsLibrary(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM6 3v10h1V3H6zm3.171.345l.299-.641 1.88-.684.64.299 3.762 10.336-.299.641-1.879.684-.64-.299L9.17 3.345zm1.11.128l3.42 9.396.94-.341-3.42-9.397-.94.342zM1 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM2 3v10h1V3H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLightbulbAutofix = function VsLightbulbAutofix(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M12 9a3 3 0 100 6 3 3 0 000-6zm1.31 5L12 13l-1.3 1 .5-1.53-1.2-.83h1.47L12 10l.54 1.64H14l-1.2.83.51 1.53z"/><path fill-rule="evenodd" d="M11.17 8.085A3.979 3.979 0 008.288 10.5H6.409v2.201c0 .081.028.15.09.212a.29.29 0 00.213.09h1.413c.089.348.223.678.396.982-.066.01-.134.015-.203.015H6.712a1.285 1.285 0 01-.922-.379 1.303 1.303 0 01-.38-.92v-1.6c0-.479-.092-.921-.274-1.329a3.556 3.556 0 00-.776-1.114 4.689 4.689 0 01-1.006-1.437A4.187 4.187 0 013 5.5a4.432 4.432 0 01.616-2.27c.197-.336.432-.64.705-.914a4.6 4.6 0 01.911-.702c.338-.196.7-.348 1.084-.454a4.45 4.45 0 011.2-.16 4.476 4.476 0 012.276.614 4.475 4.475 0 011.622 1.616 4.438 4.438 0 01.616 2.27c0 .617-.117 1.191-.353 1.721a4.537 4.537 0 01-.506.864z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLightbulb = function VsLightbulb(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.67 8.658a3.661 3.661 0 00-.781 1.114 3.28 3.28 0 00-.268 1.329v1.6a1.304 1.304 0 01-.794 1.197 1.282 1.282 0 01-.509.102H7.712a1.285 1.285 0 01-.922-.379 1.303 1.303 0 01-.38-.92v-1.6c0-.479-.092-.921-.274-1.329a3.556 3.556 0 00-.776-1.114 4.689 4.689 0 01-1.006-1.437A4.187 4.187 0 014 5.5a4.432 4.432 0 01.616-2.27c.197-.336.432-.64.705-.914a4.6 4.6 0 01.911-.702c.338-.196.7-.348 1.084-.454a4.45 4.45 0 011.2-.16 4.476 4.476 0 012.276.614 4.475 4.475 0 011.622 1.616 4.438 4.438 0 01.616 2.27c0 .617-.117 1.191-.353 1.721a4.69 4.69 0 01-1.006 1.437zM9.623 10.5H7.409v2.201c0 .081.028.15.09.212a.29.29 0 00.213.09h1.606a.289.289 0 00.213-.09.286.286 0 00.09-.212V10.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLinkExternal = function VsLinkExternal(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1.5 1H6v1H2v12h12v-4h1v4.5l-.5.5h-13l-.5-.5v-13l.5-.5z"/><path d="M15 1.5V8h-1V2.707L7.243 9.465l-.707-.708L13.293 2H8V1h6.5l.5.5z"/>'
	      }, props)
	  };
	  vs.VsLink = function VsLink(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.4 3h3.085a3.4 3.4 0 013.4 3.4v.205A3.4 3.4 0 017.485 10H7V9h.485A2.4 2.4 0 009.88 6.61V6.4A2.4 2.4 0 007.49 4H4.4A2.4 2.4 0 002 6.4v.205A2.394 2.394 0 004 8.96v1a3.4 3.4 0 01-3-3.35V6.4A3.405 3.405 0 014.4 3zM12 7.04v-1a3.4 3.4 0 013 3.36v.205A3.405 3.405 0 0111.605 13h-3.09A3.4 3.4 0 015.12 9.61V9.4A3.4 3.4 0 018.515 6H9v1h-.485A2.4 2.4 0 006.12 9.4v.205A2.4 2.4 0 008.515 12h3.09A2.4 2.4 0 0014 9.61V9.4a2.394 2.394 0 00-2-2.36z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsListFilter = function VsListFilter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6 12v-1h4v1H6zM4 7h8v1H4V7zm10-4v1H2V3h12z"/>'
	      }, props)
	  };
	  vs.VsListFlat = function VsListFlat(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 10V9h12v1H2zm0-4h12v1H2V6zm12-3v1H2V3h12zM2 12v1h12v-1H2z"/>'
	      }, props)
	  };
	  vs.VsListOrdered = function VsListOrdered(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.287 2.326L2.692 2h.677v3h-.708V2.792l-.374.281v-.747zM5 3h10v1H5V3zm0 4h10v1H5V7zm10 4H5v1h10v-1zM3.742 7.626l.029-.039.065-.09a.84.84 0 00.156-.507c0-.12-.02-.24-.057-.354a.848.848 0 00-.492-.529 1.123 1.123 0 00-.452-.082 1.094 1.094 0 00-.458.087.867.867 0 00-.479.522A1.038 1.038 0 002 6.957v.05h.81v-.05a.3.3 0 01.046-.157.174.174 0 01.057-.054.19.19 0 01.172 0 .188.188 0 01.056.06.24.24 0 01.031.081.445.445 0 01-.036.29 1.309 1.309 0 01-.12.182l-1 1.138-.012.013v.54h1.988v-.7h-.9l.65-.724zm-.037 3.817c.046.032.086.07.12.114a.841.841 0 01.167.55c0 .107-.017.213-.05.314a.792.792 0 01-.487.5 1.288 1.288 0 01-.48.079c-.115 0-.23-.016-.341-.049a.94.94 0 01-.258-.123.751.751 0 01-.182-.177 1.063 1.063 0 01-.116-.2A1.038 1.038 0 012 12.078v-.049h.814v.049c0 .027.003.055.009.082a.207.207 0 00.03.074.14.14 0 00.053.052.2.2 0 00.157.008.159.159 0 00.056-.039.22.22 0 00.042-.075.417.417 0 00.017-.126.483.483 0 00-.022-.163.2.2 0 00-.051-.08.138.138 0 00-.06-.029.537.537 0 00-.077-.007h-.161v-.645h.168a.241.241 0 00.069-.011.164.164 0 00.065-.034.175.175 0 00.048-.067.286.286 0 00.021-.121.28.28 0 00-.016-.1.166.166 0 00-.097-.099.2.2 0 00-.156.007.164.164 0 00-.055.053.344.344 0 00-.04.156v.049H2v-.049a.987.987 0 01.18-.544.8.8 0 01.179-.186.87.87 0 01.262-.133c.114-.036.234-.053.354-.051.116-.001.231.01.344.036.092.021.18.055.263.1a.757.757 0 01.32.318.73.73 0 01.09.347.81.81 0 01-.167.528.562.562 0 01-.12.114z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsListSelection = function VsListSelection(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1 12v-1h9v1H1zm0-5h14v1H1V7zm11-4v1H1V3h11z"/>'
	      }, props)
	  };
	  vs.VsListTree = function VsListTree(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 3v1H2V3h12zm-1 3v1H6V6h7zm0 3v1H5V9h8zm0 3v1H5v-1h8z"/><path d="M5 4h1v9H5z"/>'
	      }, props)
	  };
	  vs.VsListUnordered = function VsListUnordered(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 3H1v1h1V3zm0 3H1v1h1V6zM1 9h1v1H1V9zm1 3H1v1h1v-1zm2-9h11v1H4V3zm11 3H4v1h11V6zM4 9h11v1H4V9zm11 3H4v1h11v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLiveShare = function VsLiveShare(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M13.735 1.694L15.178 1l8.029 6.328v1.388l-8.029 6.072-1.443-.694v-2.776h-.59c-4.06-.02-6.71.104-10.61 5.163l-1.534-.493a8.23 8.23 0 01.271-2.255 11.026 11.026 0 013.92-6.793 11.339 11.339 0 017.502-2.547h1.04v-2.7zm1.804 7.917v2.776l5.676-4.281-5.648-4.545v2.664h-2.86A9.299 9.299 0 005.77 8.848a10.444 10.444 0 00-2.401 4.122c3.351-3.213 6.19-3.359 9.798-3.359h2.373zm-7.647 5.896a4.31 4.31 0 114.788 7.166 4.31 4.31 0 01-4.788-7.166zm.955 5.728a2.588 2.588 0 102.878-4.302 2.588 2.588 0 00-2.878 4.302z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLoading = function VsLoading(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.917 7A6.002 6.002 0 002.083 7H1.071a7.002 7.002 0 0113.858 0h-1.012z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLocation = function VsLocation(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.832 2.688A4.056 4.056 0 008.02 1.5h-.04a4.056 4.056 0 00-4 4c-.013.75.198 1.487.606 2.117L7.734 14h.533l3.147-6.383c.409-.63.62-1.367.606-2.117a4.056 4.056 0 00-1.188-2.812zM7.925 2.5l.082.01.074-.01a3.075 3.075 0 012.941 3.037 2.74 2.74 0 01-.467 1.568l-.02.034-.017.035L8 12.279l-2.517-5.1-.017-.039-.02-.034a2.74 2.74 0 01-.467-1.568A3.074 3.074 0 017.924 2.5zm.612 2.169a1 1 0 10-1.112 1.663 1 1 0 001.112-1.663zM6.87 3.837a2 2 0 112.22 3.326 2 2 0 01-2.22-3.326z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsLockSmall = function VsLockSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3 8l1-1h8l1 1v5l-1 1H4l-1-1V8zm1 0v5h8V8H4zM11 7V5a3 3 0 00-6 0v2h1V5a2 2 0 114 0v2h1z"/>'
	      }, props)
	  };
	  vs.VsLock = function VsLock(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13 7h-1V5a4 4 0 10-8 0v2H3L2 8v6l1 1h10l1-1V8l-1-1zM5 5a3 3 0 116 0v2H5V5zm8 9H3V8h10v6z"/>'
	      }, props)
	  };
	  vs.VsMagnet = function VsMagnet(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 1.5c-3.9 0-7 3.1-7 7v5l1 1h3l1-1v-5c0-1.1.9-2 2-2s2 .9 2 2v5l1 1h3l1-1v-5c0-3.9-3.1-7-7-7zm-3 12H2v-3h3v3zm9 0h-3v-3h3v3zm-3-4v-1c0-1.7-1.3-3-3-3-1.6 0-2.9 1.3-3 2.8v1.2H2v-1c0-3.3 2.7-6 6-6s6 2.7 6 6v1h-3z"/>'
	      }, props)
	  };
	  vs.VsMailRead = function VsMailRead(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.25 1.57h-.51L1 5.56v7.94l.5.5h13l.5-.5V5.56L8.25 1.57zM8 2.58l5.63 3.32-1.37 1.59H3.74L2.43 5.9 8 2.58zM14 13H2V6.92L3.11 8.3l.39.19h9l.39-.19L14 6.92V13z"/>'
	      }, props)
	  };
	  vs.VsMail = function VsMail(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 3.5l.5-.5h13l.5.5v9l-.5.5h-13l-.5-.5v-9zm1 1.035V12h12V4.536L8.31 8.9H7.7L2 4.535zM13.03 4H2.97L8 7.869 13.03 4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMapFilled = function VsMapFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 5.5V13l3.5-2.188v-7.5L2 5.5zM9.5 12.688v-7.5l-3-1.875v7.5l3 1.874zM10.5 12.688v-7.5L14 3v7.5l-3.5 2.188z"/>'
	      }, props)
	  };
	  vs.VsMap = function VsMap(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2.5 5.777v6.32l3-1.874V3.902l-3 1.875zm4-1.875v6.32l3 1.876V5.777l-3-1.875zM6 11.09l-3.735 2.334L1.5 13V5.5l.235-.424 4-2.5h.53L10 4.91l3.735-2.334L14.5 3v7.5l-.235.424-4 2.5h-.53L6 11.09zm4.5-5.313v6.32l3-1.874V3.902l-3 1.875z"/>'
	      }, props)
	  };
	  vs.VsMarkdown = function VsMarkdown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6.345 5h2.1v6.533H6.993l.055-5.31-1.774 5.31H4.072l-1.805-5.31c.04.644.06 5.31.06 5.31H1V5h2.156s1.528 4.493 1.577 4.807L6.345 5zm6.71 3.617v-3.5H11.11v3.5H9.166l2.917 2.916L15 8.617h-1.945z"/>'
	      }, props)
	  };
	  vs.VsMegaphone = function VsMegaphone(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 6.77l12.33-3.43.67.53v8.6l-.67.53-6.089-1.595a2.16 2.16 0 11-4.178-1.095L2 9.77l-.42-.53V7.3L2 6.77zm3.006 3.787a1.13 1.13 0 00-.04.242 1.17 1.17 0 002.288.347l-2.248-.589zM2.58 8.82L14 11.83V4.5L2.58 7.72v1.1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMention = function VsMention(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10.465 12.36a5.516 5.516 0 01-3.053.736 4.262 4.262 0 01-4.57-4.543 5.381 5.381 0 015.391-5.571c2.377 0 4.413 1.375 4.413 4.006 0 2.182-1.292 3.66-2.9 3.66-.676 0-1.1-.274-1.126-.917a2.012 2.012 0 01-1.756.913c-.969 0-1.629-.645-1.629-1.923 0-1.763 1.148-3.4 2.62-3.4a1.314 1.314 0 011.427.93l.211-.809h.9L9.6 8.646c-.226.916-.13 1.215.342 1.215.984 0 1.833-1.21 1.833-2.825 0-2.068-1.445-3.265-3.61-3.265-2.643 0-4.374 2.132-4.382 4.786a3.443 3.443 0 003.686 3.717c.973.04 1.94-.179 2.8-.634l.196.72zM6.217 8.639c0 .788.307 1.206.913 1.206.758 0 1.38-.6 1.683-1.831C9.136 6.746 8.85 6.1 7.94 6.1c-1.04 0-1.723 1.339-1.723 2.539z"/>'
	      }, props)
	  };
	  vs.VsMenu = function VsMenu(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M16 5H0V4h16v1zm0 8H0v-1h16v1zm0-4.008H0V8h16v.992z"/>'
	      }, props)
	  };
	  vs.VsMerge = function VsMerge(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.5 4.646L8.354 2.5h-.707L5.5 4.646l.707.707L7.3 4.261V5.28h-.02v.456l.025.001.006.319c.004.187.02.379.05.574.03.195.069.39.117.586.048.195.114.404.2.627.155.379.343.722.565 1.031.221.309.46.598.715.867.255.27.508.535.76.797.25.262.478.541.681.838.203.297.368.621.494.973.125.351.188.755.188 1.213v.884H12.5v-.884a5.991 5.991 0 00-.166-1.39 4.638 4.638 0 00-.427-1.1 5.875 5.875 0 00-.604-.897c-.222-.27-.453-.527-.693-.774-.24-.246-.471-.492-.693-.738a6.39 6.39 0 01-.604-.785 3.794 3.794 0 01-.433-.914 3.676 3.676 0 01-.16-1.13V5.28h-.001v-1l1.074 1.074.707-.708zM7.042 9.741a8.19 8.19 0 00.329-.369 6.06 6.06 0 01-.62-1.15L6.744 8.2a7.26 7.26 0 01-.095-.263c-.17.256-.359.498-.565.726-.222.246-.453.492-.693.738-.24.247-.47.504-.693.774-.221.27-.423.568-.604.896a4.643 4.643 0 00-.427 1.102 5.995 5.995 0 00-.166 1.389v.884h1.42v-.884c0-.457.062-.862.188-1.213.125-.352.29-.676.493-.973.203-.297.43-.576.682-.838.251-.262.504-.527.76-.797z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMilestone = function VsMilestone(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 1H7v2H1.5l-.5.5v4l.5.5H7v7h1V8h4.49l.34-.13 2.18-2v-.74l-2.18-2L12.5 3H8V1zm4.29 6H2V4h10.29l1.63 1.5L12.29 7zM5 5h5v1H5V5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMirror = function VsMirror(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.57 1l6.2 4 .23.38v9.2l-.76.42L8 11l-6.24 4-.76-.42v-9.2L1.23 5l6.2-4h1.14zm-.06 9.13L14 13.67V5.65l-5.49-3.5V5h-1V2.13L2 5.67v8l5.51-3.56v.02h1zm.9-4.78l.71-.7 2.47 2.48v.71l-2.46 2.46-.7-.7L11.02 8h-6L6.6 9.6l-.7.7-2.46-2.46v-.71l2.48-2.48.7.7L4.98 7h6.08L9.41 5.35z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMortarBoard = function VsMortarBoard(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 5.66L8.18 3h-.36L1 5.66V12h1V7l2.31.9a4.35 4.35 0 00-.79 2.48c-.01.11-.01.22 0 .33v.11l.28.4L7.78 13h.41l3.94-1.81.28-.4v-.44a4.39 4.39 0 00-.78-2.47L15 6.57v-.91zm-3.52 4.68v.07L8 12l-3.5-1.6a.13.13 0 010-.06 3.44 3.44 0 01.75-2.12l2.58 1h.36l2.56-1a3.4 3.4 0 01.73 2.12zM8 8.25L2.52 6.12 8 4l5.48 2.14L8 8.25z"/>'
	      }, props)
	  };
	  vs.VsMove = function VsMove(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.232 10.707L8.5 12.44V9h-1v3.44l-1.732-1.733-.707.707L7.646 14h.708l2.585-2.586-.707-.707zM5.061 3.586l.707.707L7.5 2.56V6h1V2.56l1.732 1.733.707-.707L8.354 1h-.708L5.061 3.586zm-.268 1.682L3.06 7H6.5v1H3.06l1.733 1.732-.707.707L1.5 7.854v-.708l2.586-2.585.707.707zM9.5 7h3.44l-1.733-1.732.707-.707L14.5 7.146v.708l-2.586 2.585-.707-.707L12.94 8H9.5V7z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMultipleWindows = function VsMultipleWindows(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 1.5l.5-.5h8l.5.5v7l-.5.5H12V8h2V4H7v1H6V1.5zM7 2v1h7V2H7zM1.5 7l-.5.5v7l.5.5h8l.5-.5v-7L9.5 7h-8zM2 9V8h7v1H2zm0 1h7v4H2v-4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsMute = function VsMute(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 5h2.79l3.86-3.83.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85 4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732-.707.707L12.5 9.207l-1.732 1.732-.707-.707L11.793 8.5 10.06 6.77l.707-.707 1.733 1.73 1.731-1.731z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNewFile = function VsNewFile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.5 1.1l3.4 3.5.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNewFolder = function VsNewFolder(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5H7v-1H1.99V6h4.49l.35-.15.86-.86H14v1.5l-.001.51h1.011V2.5L14.5 2zm-.51 2h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99zM13 16h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNewline = function VsNewline(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12 5.5v1.984a.5.5 0 01-.5.5H4.618l1.633-1.633-.707-.707-2.121 2.121L3 8.188v.568L5.544 11.3l.707-.707-1.61-1.609H11.5a1.5 1.5 0 001.5-1.5V5.5h-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNoNewline = function VsNoNewline(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.333 5.506a3 3 0 113.334 4.989 3 3 0 01-3.334-4.99zm2.677.777A1.986 1.986 0 002 8.009c.004.353.102.698.283 1.001L5.01 6.283zM2.99 9.717A1.986 1.986 0 006 7.991a1.988 1.988 0 00-.283-1.001L2.99 9.717zM14 5v1.984a.5.5 0 01-.5.5H9.367L11 5.851l-.707-.707-2.121 2.121-.423.423v.568l2.544 2.544.707-.707-1.61-1.609h4.11a1.5 1.5 0 001.5-1.5V5h-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNote = function VsNote(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v10l-.5.5h-13l-.5-.5v-10l.5-.5zM2 3v9h12V3H2zm2 2h8v1H4V5zm6 2H4v1h6V7zM4 9h4v1H4V9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsNotebookTemplate = function VsNotebookTemplate(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1 5H0V4h1v1zm0 2H0V6h1v1zm0 2H0V8h1v1zm0 2H0v-1h1v1zm0 2H0v-1h1v1zm0 1v1H0v-1h1zm0 1h1v1H1v-1zm2 0h1v1H3v-1zM1 1H0V0h1v1zm2 0H2V0h1v1zm1-1h1v1H4V0zm3 1H6V0h1v1zm2 0H8V0h1v1zm2 0h-1V0h1v1zm0 1V1h1v1h-1zm1 2h-1V3h1v1zM1 3H0V2h1v1z"/><path fill-rule="evenodd" d="M5 6l1-1h7l1 1v9l-1 1H6l-1-1V6zm1 0v9h7V6H6z" clip-rule="evenodd"/><path d="M15 7h1v2h-1V7zm0 3h1v2h-1v-2zm0 3h1v2h-1v-2zM7 8h5v1H7z"/>'
	      }, props)
	  };
	  vs.VsNotebook = function VsNotebook(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 2l1-1h9l1 1v12l-1 1H3l-1-1V2zm1 0v12h9V2H3zm1 2l1-1h5l1 1v1l-1 1H5L4 5V4zm1 0v1h5V4H5zm10 1h-1v2h1V5zm-1 3h1v2h-1V8zm1 3h-1v2h1v-2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsOctoface = function VsOctoface(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.863 5.673c.113-.28.48-1.392-.114-2.897 0 0-.919-.288-3.01 1.138-.875-.245-1.812-.28-2.739-.28-.928 0-1.864.035-2.739.28-2.091-1.435-3.01-1.138-3.01-1.138-.595 1.505-.227 2.617-.113 2.897C1.428 6.433 1 7.413 1 8.603c0 4.507 2.914 5.522 6.982 5.522 4.07 0 7.018-1.015 7.018-5.521 0-1.19-.429-2.17-1.137-2.931zM8 13.268c-2.888 0-5.232-.132-5.232-2.932 0-.665.332-1.295.892-1.811.936-.857 2.537-.402 4.34-.402 1.811 0 3.395-.455 4.34.402.569.516.893 1.138.893 1.811 0 2.791-2.346 2.931-5.233 2.931zM5.804 8.883c-.578 0-1.05.7-1.05 1.557 0 .858.472 1.566 1.05 1.566.577 0 1.05-.7 1.05-1.566 0-.866-.473-1.557-1.05-1.557zm4.392 0c-.577 0-1.05.691-1.05 1.557s.473 1.566 1.05 1.566c.578 0 1.05-.7 1.05-1.566 0-.866-.463-1.557-1.05-1.557z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsOpenPreview = function VsOpenPreview(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3 1h11l1 1v5.3a3.21 3.21 0 00-1-.3V2H9v10.88L7.88 14H3l-1-1V2l1-1zm0 12h5V2H3v11zm10.379-4.998a2.53 2.53 0 00-1.19.348h-.03a2.51 2.51 0 00-.799 3.53L9 14.23l.71.71 2.35-2.36c.325.22.7.358 1.09.4a2.47 2.47 0 001.14-.13 2.51 2.51 0 001-.63 2.46 2.46 0 00.58-1 2.63 2.63 0 00.07-1.15 2.53 2.53 0 00-1.35-1.81 2.53 2.53 0 00-1.211-.258zm.24 3.992a1.5 1.5 0 01-.979-.244 1.55 1.55 0 01-.56-.68 1.49 1.49 0 01-.08-.86 1.49 1.49 0 011.18-1.18 1.49 1.49 0 01.86.08c.276.117.512.311.68.56a1.5 1.5 0 01-1.1 2.324z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsOrganization = function VsOrganization(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.111 4.663A2 2 0 116.89 1.337a2 2 0 012.222 3.326zm-.555-2.494A1 1 0 107.444 3.83a1 1 0 001.112-1.66zm2.61.03a1.494 1.494 0 011.895.188 1.513 1.513 0 01-.487 2.46 1.492 1.492 0 01-1.635-.326 1.512 1.512 0 01.228-2.321zm.48 1.61a.499.499 0 10.705-.708.509.509 0 00-.351-.15.499.499 0 00-.5.503.51.51 0 00.146.356zM3.19 12.487H5v1.005H3.19a1.197 1.197 0 01-.842-.357 1.21 1.21 0 01-.348-.85v-1.81a.997.997 0 01-.71-.332A1.007 1.007 0 011 9.408V7.226c.003-.472.19-.923.52-1.258.329-.331.774-.52 1.24-.523H4.6a2.912 2.912 0 00-.55 1.006H2.76a.798.798 0 00-.54.232.777.777 0 00-.22.543v2.232h1v2.826a.202.202 0 00.05.151.24.24 0 00.14.05zm7.3-6.518a1.765 1.765 0 00-1.25-.523H6.76a1.765 1.765 0 00-1.24.523c-.33.335-.517.786-.52 1.258v3.178a1.06 1.06 0 00.29.734 1 1 0 00.71.332v2.323a1.202 1.202 0 00.35.855c.18.168.407.277.65.312h2a1.15 1.15 0 001-1.167V11.47a.997.997 0 00.71-.332 1.006 1.006 0 00.29-.734V7.226a1.8 1.8 0 00-.51-1.258zM10 10.454H9v3.34a.202.202 0 01-.06.14.17.17 0 01-.14.06H7.19a.21.21 0 01-.2-.2v-3.34H6V7.226c0-.203.079-.398.22-.543a.798.798 0 01.54-.232h2.48a.778.778 0 01.705.48.748.748 0 01.055.295v3.228zm2.81 3.037H11v-1.005h1.8a.24.24 0 00.14-.05.2.2 0 00.06-.152V9.458h1V7.226a.777.777 0 00-.22-.543.798.798 0 00-.54-.232h-1.29a2.91 2.91 0 00-.55-1.006h1.84a1.77 1.77 0 011.24.523c.33.335.517.786.52 1.258v2.182c0 .273-.103.535-.289.733-.186.199-.44.318-.711.333v1.81c0 .319-.125.624-.348.85a1.197 1.197 0 01-.842.357zM4 1.945a1.494 1.494 0 00-1.386.932A1.517 1.517 0 002.94 4.52 1.497 1.497 0 005.5 3.454c0-.4-.158-.784-.44-1.067A1.496 1.496 0 004 1.945zm0 2.012a.499.499 0 01-.5-.503.504.504 0 01.5-.503.509.509 0 01.5.503.504.504 0 01-.5.503z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsOutput = function VsOutput(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M19.5 0v1.5L21 3v19.5L19.5 24h-15L3 22.5V3l1.5-1.5V0H6v1.5h3V0h1.5v1.5h3V0H15v1.5h3V0h1.5zm-15 22.5h15V3h-15v19.5zM7.5 6h9v1.5h-9V6zm9 6h-9v1.5h9V12zm-9 6h9v1.5h-9V18z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPackage = function VsPackage(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.61 3l5.74 1.53L15 5v6.74l-.37.48-6.13 1.69-6.14-1.69-.36-.48V5l.61-.47L8.34 3h.27zm-.09 1l-4 1 .55.2 3.43.9 3-.81.95-.29-3.93-1zM3 11.36l5 1.37V7L3 5.66v5.7zM9 7v5.73l5-1.37V5.63l-2.02.553V8.75l-1 .26V6.457L9 7z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPaintcan = function VsPaintcan(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.54 11.811l-1.14-3.12v-.06l-4.91-4.91v-1.24a1.66 1.66 0 00-.11-.58 1.48 1.48 0 00-.83-.8 1.42 1.42 0 00-.58-.1 1.47 1.47 0 00-1.48 1.48v3.26l-3.06 3a1.52 1.52 0 000 2.12l3.63 3.63c.14.141.307.253.49.33a1.53 1.53 0 001.14 0 1.51 1.51 0 00.49-.33l4.93-4.92-.66 2.2a1.19 1.19 0 000 .46c.033.152.098.296.19.42.098.121.216.223.35.3.14.07.294.11.45.12a1 1 0 00.48-.09 1.14 1.14 0 00.39-.29.98.98 0 00.22-.44c.032-.145.035-.294.01-.44zm-8-9.33a.46.46 0 010-.2.52.52 0 01.12-.17.64.64 0 01.18-.1.5.5 0 01.21 0 .5.5 0 01.32.15.5.5 0 01.12.33v1.26l-1 1 .05-2.27zm1 11.35a.36.36 0 01-.16.11.47.47 0 01-.38 0 .361.361 0 01-.16-.11l-3.63-3.62a.5.5 0 010-.71l4.35-4.35v2.85a.74.74 0 00-.24.55.75.75 0 101.17-.55v-2.83l3.85 3.87-4.8 4.79z"/>'
	      }, props)
	  };
	  vs.VsPassFilled = function VsPassFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm-1.02-4.13h-.71L4 8.6l.71-.71 1.92 1.92 4.2-4.21.71.71-4.56 4.56z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPass = function VsPass(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6.27 10.87h.71l4.56-4.56-.71-.71-4.2 4.21-1.92-1.92L4 8.6l2.27 2.27z"/><path fill-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPersonAdd = function VsPersonAdd(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13 10h-1v2h-2v1h2v2h1v-2h2v-1h-2v-2zM8.556 2.169a1 1 0 10-1.112 1.663 1 1 0 001.112-1.663zm-1.667-.832A2 2 0 119.11 4.663a2 2 0 01-2.22-3.326zM6.77 5.49h2.46A1.77 1.77 0 0111 7.26V8h-1v-.74a.76.76 0 00-.77-.77H6.77a.76.76 0 00-.77.77V10h1v3.31a.2.2 0 00.2.2H8v1.02h-.8a1.2 1.2 0 01-1.2-1.2V11a1.06 1.06 0 01-1-1.1V7.26a1.77 1.77 0 011.77-1.77z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPerson = function VsPerson(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 2a1 1 0 110 2 1 1 0 010-2zm0-1a2 2 0 100 4 2 2 0 000-4zm1.23 4.49H6.77A1.77 1.77 0 005 7.26V9.9A1.06 1.06 0 006 11v2.33a1.2 1.2 0 001.2 1.2h1.6a1.2 1.2 0 001.2-1.24V11a1.06 1.06 0 001-1.1V7.26a1.77 1.77 0 00-1.77-1.77zM6 10V7.26a.76.76 0 01.77-.77h2.46a.76.76 0 01.77.77V10H9v3.31a.2.2 0 01-.2.2H7.2a.2.2 0 01-.2-.2V10H6z"/>'
	      }, props)
	  };
	  vs.VsPieChart = function VsPieChart(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10 6h3.9A5.006 5.006 0 0010 2.1V6zm0-4.917A6.005 6.005 0 0115 7H9V1c.34 0 .675.028 1 .083zM7 8l1 1h4.9A5.002 5.002 0 013 8a5.002 5.002 0 014-4.9V8zm1 6a6.002 6.002 0 006-6H8V2a6.002 6.002 0 000 12z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPin = function VsPin(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 5v7h-.278c-.406 0-.778-.086-1.117-.258A2.528 2.528 0 0111.73 11H8.87a3.463 3.463 0 01-.546.828 3.685 3.685 0 01-.735.633c-.27.177-.565.31-.882.398a3.875 3.875 0 01-.985.141h-.5V9H2l-1-.5L2 8h3.222V4h.5c.339 0 .664.047.977.14.312.094.607.227.883.4A3.404 3.404 0 018.87 6h2.859a2.56 2.56 0 01.875-.734c.338-.172.71-.26 1.117-.266H14zm-.778 1.086a1.222 1.222 0 00-.32.156 1.491 1.491 0 00-.43.461L12.285 7H8.183l-.117-.336a2.457 2.457 0 00-.711-1.047C7.027 5.331 6.427 5.09 6 5v7c.427-.088 1.027-.33 1.355-.617.328-.287.565-.636.71-1.047L8.184 10h4.102l.18.297c.057.094.122.177.195.25.073.073.153.143.242.21.088.069.195.12.32.157V6.086z"/>'
	      }, props)
	  };
	  vs.VsPinnedDirty = function VsPinnedDirty(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 2h7v.278c0 .406-.086.778-.258 1.117-.172.339-.42.63-.742.875v2.86c.307.145.583.328.828.546a3.7 3.7 0 01.54.598 4.92 4.92 0 00-.896.412l-.007.004-.03.018a2.456 2.456 0 00-1.099-.774L9 7.817V3.715l.297-.18c.094-.057.177-.122.25-.195a2.28 2.28 0 00.21-.242.968.968 0 00.157-.32H5.086c.042.125.094.232.156.32a1.494 1.494 0 00.461.43L6 3.715v4.102l-.336.117c-.411.146-.76.383-1.047.711C4.331 8.973 4.09 9.573 4 10h5.002a5.025 5.025 0 00-.481.778H8V14l-.5 1-.5-1v-3.222H3v-.5c0-.339.047-.664.14-.977.094-.312.227-.607.4-.883A3.404 3.404 0 015 7.13V4.27a2.561 2.561 0 01-.734-.875A2.505 2.505 0 014 2.278V2zm7.485 8.41a2.924 2.924 0 01.718-.302c.256-.072.522-.108.797-.108s.541.036.797.108a2.956 2.956 0 011.321.773 2.956 2.956 0 01.774 1.322c.072.256.108.522.108.797s-.036.541-.108.797a2.953 2.953 0 01-.774 1.324 3.013 3.013 0 01-1.321.774c-.256.07-.522.105-.797.105s-.541-.035-.797-.105a3.037 3.037 0 01-1.324-.774 3.037 3.037 0 01-.773-1.324A2.994 2.994 0 0110 13c0-.275.035-.541.105-.797a3.013 3.013 0 01.883-1.425c.154-.14.32-.262.497-.368z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPinned = function VsPinned(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4 2h7v.278c0 .406-.086.778-.258 1.117-.172.339-.42.63-.742.875v2.86c.307.145.583.328.828.546.245.219.456.464.633.735.177.27.31.565.398.882.089.318.136.646.141.985v.5H8V14l-.5 1-.5-1v-3.222H3v-.5c0-.339.047-.664.14-.977.094-.312.227-.607.4-.883A3.404 3.404 0 015 7.13V4.27a2.561 2.561 0 01-.734-.875A2.505 2.505 0 014 2.278V2zm1.086.778c.042.125.094.232.156.32a1.494 1.494 0 00.461.43L6 3.715v4.102l-.336.117c-.411.146-.76.383-1.047.711C4.331 8.973 4.09 9.573 4 10h7c-.088-.427-.33-1.027-.617-1.355a2.456 2.456 0 00-1.047-.71L9 7.816V3.715l.297-.18c.094-.057.177-.122.25-.195a2.28 2.28 0 00.21-.242.968.968 0 00.157-.32H5.086z"/>'
	      }, props)
	  };
	  vs.VsPlayCircle = function VsPlayCircle(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6 5l.777-.416 4.5 3v.832l-4.5 3L6 11V5zm1 .934v4.132L10.099 8 7 5.934z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPlay = function VsPlay(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3.78 2L3 2.41v12l.78.42 9-6V8l-9-6zM4 13.48V3.35l7.6 5.07L4 13.48z"/>'
	      }, props)
	  };
	  vs.VsPlug = function VsPlug(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7 1H6v3H4.5l-.5.5V8a4 4 0 003.5 3.969V15h1v-3.031A4 4 0 0012 8V4.5l-.5-.5H10V1H9v3H7V1zm3.121 9.121A3 3 0 015 8V5h6v3a3 3 0 01-.879 2.121z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPreserveCase = function VsPreserveCase(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.514 11h-1l-.816-2.16H3.433L2.664 11H1.66l2.954-7.702h.935L8.514 11zM6.403 8.03L5.194 4.748a3.144 3.144 0 01-.118-.516h-.021c-.036.219-.077.39-.124.516L3.733 8.03h2.67zM9.597 11V3.298h2.192c.666 0 1.194.163 1.584.489.39.325.586.75.586 1.273 0 .436-.119.816-.355 1.138a1.911 1.911 0 01-.977.688v.021c.519.061.934.258 1.246.591.311.33.467.76.467 1.29 0 .658-.236 1.191-.71 1.6-.472.408-1.068.612-1.788.612H9.597zm.903-6.886v2.487h.923c.495 0 .883-.118 1.166-.354.283-.24.424-.577.424-1.01 0-.749-.492-1.123-1.477-1.123H10.5zm0 3.298v2.772h1.224c.53 0 .94-.126 1.23-.376.294-.251.44-.595.44-1.032 0-.91-.619-1.364-1.858-1.364H10.5z"/>'
	      }, props)
	  };
	  vs.VsPreview = function VsPreview(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 2h12l1 1v10l-1 1H2l-1-1V3l1-1zm0 11h12V3H2v10zm11-9H3v3h10V4zm-1 2H4V5h8v1zm-3 6h4V8H9v4zm1-3h2v2h-2V9zM7 8H3v1h4V8zm-4 3h4v1H3v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPrimitiveSquare = function VsPrimitiveSquare(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.5 4l.5-.5h8l.5.5v8l-.5.5H4l-.5-.5V4zm1 .5v7h7v-7h-7z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsProject = function VsProject(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 14h12V2H2v12zM3 3h2v10H3V3zm6 0H7v6h2V3zm2 0h2v8h-2V3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsPulse = function VsPulse(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M11.8 9L10 3H9L7.158 9.64 5.99 4.69h-.97L3.85 9H1v.99h3.23l.49-.37.74-2.7L6.59 12h1.03l1.87-7.04 1.46 4.68.48.36H15V9h-3.2z"/>'
	      }, props)
	  };
	  vs.VsQuestion = function VsQuestion(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.5 1a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 12a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm1.55-8.42a1.84 1.84 0 00-.61-.42A2.25 2.25 0 007.53 4a2.16 2.16 0 00-.88.17c-.239.1-.45.254-.62.45a1.89 1.89 0 00-.38.62 3 3 0 00-.15.72h1.23a.84.84 0 01.506-.741.72.72 0 01.304-.049.86.86 0 01.27 0 .64.64 0 01.22.14.6.6 0 01.16.22.73.73 0 01.06.3c0 .173-.037.343-.11.5a2.4 2.4 0 01-.27.46l-.35.42c-.12.13-.24.27-.35.41a2.33 2.33 0 00-.27.45 1.18 1.18 0 00-.1.5v.66H8v-.49a.94.94 0 01.11-.42 3.09 3.09 0 01.28-.41l.36-.44a4.29 4.29 0 00.36-.48 2.59 2.59 0 00.28-.55 1.91 1.91 0 00.11-.64 2.18 2.18 0 00-.1-.67 1.52 1.52 0 00-.35-.55zM6.8 9.83h1.17V11H6.8V9.83z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsQuote = function VsQuote(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.16 3.5C4.73 5.06 3.55 6.67 3.55 9.36c.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.9 0-2.99-1.52-2.99-4.25 0-3.8 1.75-6.53 5.02-8.42L7.16 3.5zm7 0c-2.43 1.56-3.61 3.17-3.61 5.86.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.89 0-2.98-1.52-2.98-4.25 0-3.8 1.75-6.53 5.02-8.42l1.14 1.84h-.01z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRadioTower = function VsRadioTower(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.998 5.58a5.55 5.55 0 011.62-3.88l-.71-.7a6.45 6.45 0 000 9.16l.71-.7a5.55 5.55 0 01-1.62-3.88zm1.06 0a4.42 4.42 0 001.32 3.17l.71-.71a3.27 3.27 0 01-.76-1.12 3.45 3.45 0 010-2.67 3.22 3.22 0 01.76-1.13l-.71-.71a4.46 4.46 0 00-1.32 3.17zm7.65 3.21l-.71-.71c.33-.32.59-.704.76-1.13a3.449 3.449 0 000-2.67 3.22 3.22 0 00-.76-1.13l.71-.7a4.468 4.468 0 010 6.34zM13.068 1l-.71.71a5.43 5.43 0 010 7.74l.71.71a6.45 6.45 0 000-9.16zM9.993 5.43a1.5 1.5 0 01-.245.98 2 2 0 01-.27.23l3.44 7.73-.92.4-.77-1.73h-5.54l-.77 1.73-.92-.4 3.44-7.73a1.52 1.52 0 01-.33-1.63 1.55 1.55 0 01.56-.68 1.5 1.5 0 012.325 1.1zm-1.595-.34a.52.52 0 00-.25.14.52.52 0 00-.11.22.48.48 0 000 .29c.04.09.102.17.18.23a.54.54 0 00.28.08.51.51 0 00.5-.5.54.54 0 00-.08-.28.58.58 0 00-.23-.18.48.48 0 00-.29 0zm.23 2.05h-.27l-.87 1.94h2l-.86-1.94zm2.2 4.94l-.89-2h-2.88l-.89 2h4.66z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsReactions = function VsReactions(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12 7.5c0 .169-.01.336-.027.5h1.005A5.5 5.5 0 108 12.978v-1.005A4.5 4.5 0 1112 7.5zM5.5 7a1 1 0 100-2 1 1 0 000 2zm2 2.5c.712 0 1.355-.298 1.81-.776l.707.708A3.49 3.49 0 017.5 10.5a3.49 3.49 0 01-2.555-1.108l.707-.708A2.494 2.494 0 007.5 9.5zm2-2.5a1 1 0 100-2 1 1 0 000 2zm2.5 3h1v2h2v1h-2v2h-1v-2h-2v-1h2v-2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRecordKeys = function VsRecordKeys(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14 3H3a1 1 0 00-1 1v7a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1zm0 8H3V4h11v7zm-3-6h-1v1h1V5zm-1 2H9v1h1V7zm2-2h1v1h-1V5zm1 4h-1v1h1V9zM6 9h5v1H6V9zm7-2h-2v1h2V7zM8 5h1v1H8V5zm0 2H7v1h1V7zM4 9h1v1H4V9zm0-4h1v1H4V5zm3 0H6v1h1V5zM4 7h2v1H4V7z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRecordSmall = function VsRecordSmall(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 9a1 1 0 100-2 1 1 0 000 2z"/><path d="M12 8a4 4 0 11-8 0 4 4 0 018 0zm-1 0a3 3 0 10-6 0 3 3 0 006 0z"/>'
	      }, props)
	  };
	  vs.VsRecord = function VsRecord(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 10a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRedo = function VsRedo(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.5 2v3.5L12 6H8.5V5h2.521l-.941-.941a3.552 3.552 0 10-5.023 5.023l5.197 5.198-.72.72-5.198-5.198A4.57 4.57 0 0110.8 3.339l.7.7V2h1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsReferences = function VsReferences(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M11.105 4.561l-3.43 3.427-1.134-1.12 2.07-2.08h-4.8a2.4 2.4 0 100 4.8h.89v1.6h-.88a4 4 0 010-7.991h4.8L6.54 1.13 7.675 0l3.43 3.432v1.13zM16.62 24h-9.6l-.8-.8V10.412l.8-.8h9.6l.8.8V23.2l-.8.8zm-8.8-1.6h8V11.212h-8V22.4zm5.6-20.798h9.6l.8.8v12.786l-.8.8h-4v-1.6h3.2V3.2h-8v4.787h-1.6V2.401l.8-.8zm.8 11.186h-4.8v1.6h4.8v-1.6zm-4.8 3.2h4.8v1.6h-4.8v-1.6zm4.8 3.2h-4.8v1.6h4.8v-1.6zm1.6-14.4h4.8v1.6h-4.8v-1.6zm4.8 6.4h-1.6v1.6h1.6v-1.6zm-3.338-3.176v-.024h3.338v1.6h-1.762l-1.576-1.576z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRefresh = function VsRefresh(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.681 3H2V2h3.5l.5.5V6H5V4a5 5 0 104.53-.761l.302-.954A6 6 0 114.681 3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRegex = function VsRegex(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10.012 2h.976v3.113l2.56-1.557.486.885L11.47 6l2.564 1.559-.485.885-2.561-1.557V10h-.976V6.887l-2.56 1.557-.486-.885L9.53 6 6.966 4.441l.485-.885 2.561 1.557V2zM2 10h4v4H2v-4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRemoteExplorer = function VsRemoteExplorer(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M1.344 2.125h20.312l.782.781v8.599a7.825 7.825 0 00-1.563-.912V3.688H2.125V17.75h7.813a7.813 7.813 0 001.562 4.688H5.25v-1.563h4.688v-1.563H1.344l-.782-.78V2.905l.782-.781zM17.75 11.5a6.25 6.25 0 100 12.5 6.25 6.25 0 000-12.5zm0 10.938a4.688 4.688 0 110-9.377 4.688 4.688 0 010 9.377zm2.603-3.132L18.2 17.153 20.353 15l.647.646-1.506 1.507L21 18.659l-.647.647zM15 17.246l1.506 1.507L15 20.259l.647.647 2.153-2.153-2.153-2.153-.647.646z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRemote = function VsRemote(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.904 9.57L8.928 5.596l3.976-3.976-.619-.62L8 5.286v.619l4.285 4.285.62-.618zM3 5.62l4.072 4.07L3 13.763l.619.618L8 10v-.619L3.619 5 3 5.619z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRemove = function VsRemove(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 8H1V7h14v1z"/>'
	      }, props)
	  };
	  vs.VsReplaceAll = function VsReplaceAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.6 2.677c.147-.31.356-.465.626-.465.248 0 .44.118.573.353.134.236.201.557.201.966 0 .443-.078.798-.235 1.067-.156.268-.365.402-.627.402-.237 0-.416-.125-.537-.374h-.008v.31H11V1h.593v1.677h.008zm-.016 1.1a.78.78 0 00.107.426c.071.113.163.169.274.169.136 0 .24-.072.314-.216.075-.145.113-.35.113-.615 0-.22-.035-.39-.104-.514-.067-.124-.164-.187-.29-.187-.12 0-.219.062-.297.185a.886.886 0 00-.117.48v.272zM4.12 7.695L2 5.568l.662-.662 1.006 1v-1.51A1.39 1.39 0 015.055 3H7.4v.905H5.055a.49.49 0 00-.468.493l.007 1.5.949-.944.656.656-2.08 2.085zM9.356 4.93H10V3.22C10 2.408 9.685 2 9.056 2c-.135 0-.285.024-.45.073a1.444 1.444 0 00-.388.167v.665c.237-.203.487-.304.75-.304.261 0 .392.156.392.469l-.6.103c-.506.086-.76.406-.76.961 0 .263.061.473.183.631A.61.61 0 008.69 5c.29 0 .509-.16.657-.48h.009v.41zm.004-1.355v.193a.75.75 0 01-.12.436.368.368 0 01-.313.17.276.276 0 01-.22-.095.38.38 0 01-.08-.248c0-.222.11-.351.332-.389l.4-.067zM7 12.93h-.644v-.41h-.009c-.148.32-.367.48-.657.48a.61.61 0 01-.507-.235c-.122-.158-.183-.368-.183-.63 0-.556.254-.876.76-.962l.6-.103c0-.313-.13-.47-.392-.47-.263 0-.513.102-.75.305v-.665c.095-.063.224-.119.388-.167.165-.049.315-.073.45-.073.63 0 .944.407.944 1.22v1.71zm-.64-1.162v-.193l-.4.068c-.222.037-.333.166-.333.388 0 .1.027.183.08.248a.276.276 0 00.22.095.368.368 0 00.312-.17c.08-.116.12-.26.12-.436zM9.262 13c.321 0 .568-.058.738-.173v-.71a.9.9 0 01-.552.207.619.619 0 01-.5-.215c-.12-.145-.181-.345-.181-.598 0-.26.063-.464.189-.612a.644.644 0 01.516-.223c.194 0 .37.069.528.207v-.749c-.129-.09-.338-.134-.626-.134-.417 0-.751.14-1.001.422-.249.28-.373.662-.373 1.148 0 .42.116.764.349 1.03.232.267.537.4.913.4zM2 9l1-1h9l1 1v5l-1 1H3l-1-1V9zm1 0v5h9V9H3zm3-2l1-1h7l1 1v5l-1 1V7H6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsReplace = function VsReplace(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.221 3.739l2.261 2.269L7.7 3.784l-.7-.7-1.012 1.007-.008-1.6a.523.523 0 01.5-.526H8V1H6.48A1.482 1.482 0 005 2.489V4.1L3.927 3.033l-.706.706zm6.67 1.794h.01c.183.311.451.467.806.467.393 0 .706-.168.94-.503.236-.335.353-.78.353-1.333 0-.511-.1-.913-.301-1.207-.201-.295-.488-.442-.86-.442-.405 0-.718.194-.938.581h-.01V1H9v4.919h.89v-.386zm-.015-1.061v-.34c0-.248.058-.448.175-.601a.54.54 0 01.445-.23.49.49 0 01.436.233c.104.154.155.368.155.643 0 .33-.056.587-.169.768a.524.524 0 01-.47.27.495.495 0 01-.411-.211.853.853 0 01-.16-.532zM9 12.769c-.256.154-.625.231-1.108.231-.563 0-1.02-.178-1.369-.533-.349-.355-.523-.813-.523-1.374 0-.648.186-1.158.56-1.53.374-.376.875-.563 1.5-.563.433 0 .746.06.94.179v.998a1.26 1.26 0 00-.792-.276c-.325 0-.583.1-.774.298-.19.196-.283.468-.283.816 0 .338.09.603.272.797.182.191.431.287.749.287.282 0 .558-.092.828-.276v.946zM4 7L3 8v6l1 1h7l1-1V8l-1-1H4zm0 1h7v6H4V8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsReply = function VsReply(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6.306 2.146l-4.02 4.02v.708l4.02 4.02.708-.707L3.807 6.98H5.69c2.813 0 4.605.605 5.705 1.729 1.102 1.125 1.615 2.877 1.615 5.421v.35h1v-.35c0-2.646-.527-4.72-1.9-6.121C10.735 6.605 8.617 5.98 5.69 5.98H3.887l3.127-3.126-.708-.708z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRepoClone = function VsRepoClone(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13 10H4V2h4V1H3.74a1.9 1.9 0 00-.67.13 1.66 1.66 0 00-.57.41 1.73 1.73 0 00-.37.59 1.68 1.68 0 00-.13.62v9.5a1.75 1.75 0 001.07 1.62 1.9 1.9 0 00.67.13H4v-1h-.26a.72.72 0 01-.29-.06.78.78 0 01-.4-.4.93.93 0 010-.29v-.5a.93.93 0 010-.29.78.78 0 01.4-.4.72.72 0 01.29-.06H13v2H9v1h4.5l.5-.5V9h-1v1zM6 3H5v1h1V3zM5 5h1v1H5V5zm0 2h1v1H5V7zm.28 8H5v-3h3v3h-.28L6.5 13.49 5.28 15zM10 1h4.5l.5.5v6l-.5.5H12v1h-1V8h-1a1 1 0 01-1-1V2a1 1 0 011-1zm.5 6h.5V6h-.5a.5.5 0 000 1zM12 7h2V6h-2v1zm-1-2h3V2h-3v3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRepoForcePush = function VsRepoForcePush(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.74 1h9.76l.5.5v12l-.5.5H10v-1h3v-2h-3v-1h3V2H4v8h3v1H3.74a.74.74 0 00-.74.75v.5a.74.74 0 00.74.75H7v1H3.74A1.74 1.74 0 012 12.25v-9.5A1.74 1.74 0 013.74 1zm1.6 4.83l.71.7L8 4.58v1.45L5.38 8.65l.71.7 1.92-1.92V15h1V7.328l2.03 2.022.7-.7L9 5.9V4.538l2 1.992.7-.7L8.88 3h-.71L5.34 5.83z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRepoForked = function VsRepoForked(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 4a2 2 0 10-2.47 1.94V7a.48.48 0 01-.27.44L8.49 8.88l-2.76-1.4A.49.49 0 015.46 7V5.94a2 2 0 10-1 0V7a1.51 1.51 0 00.82 1.34L8 9.74v1.32a2 2 0 101 0V9.74l2.7-1.36A1.49 1.49 0 0012.52 7V5.92A2 2 0 0014 4zM4 4a1 1 0 112 0 1 1 0 01-2 0zm5.47 9a1 1 0 11-2 0 1 1 0 012 0zM12 5a1 1 0 110-2 1 1 0 010 2z"/>'
	      }, props)
	  };
	  vs.VsRepoPull = function VsRepoPull(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13 1.5V3h-1V2H3v8h10v3.5l-.5.5H8v-1h4v-2H2.735a.72.72 0 00-.285.06.74.74 0 00-.4.4.93.93 0 00-.05.29v.5a.93.93 0 00.05.29.74.74 0 00.4.4c.091.04.19.06.29.06H3v1h-.26a1.9 1.9 0 01-.67-.13 1.77 1.77 0 01-.94-.95 1.7 1.7 0 01-.13-.67v-9.5a1.7 1.7 0 01.13-.62 1.77 1.77 0 01.94-1A1.9 1.9 0 012.74 1h9.76l.5.5zM2 10.17V2.748v7.422zM5 3H4v1h1V3zm0 2H4v1h1V5zM4 7h1v1H4V7zm8.07-3.61l-.7.71 1.92 1.92H7v1h6.39l-2.02 2.03.7.7 2.83-2.82v-.71l-2.83-2.83zM5.5 13.49L4.28 15H4v-3h3v3h-.28L5.5 13.49z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRepoPush = function VsRepoPush(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.5 1H3.74A1.74 1.74 0 002 2.75v9.5A1.74 1.74 0 003.74 14H7v-1H3.74a.74.74 0 01-.74-.75v-.5a.74.74 0 01.74-.75H7v-1H4V2h9v8h-3v1h3v2h-3v1h3.5l.5-.5v-12l-.5-.5zM3 2.73a.75.75 0 000 .02v7.42-7.44zM6 3H5v1h1V3zm-.62 5.65l.71.7 1.92-1.92V15h1V7.328l2.03 2.022.7-.7-2.82-2.83h-.71L5.38 8.65zM5 5h1v1H5V5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRepo = function VsRepo(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14 10V1.5l-.5-.5H3.74a1.9 1.9 0 00-.67.13 1.77 1.77 0 00-.94 1 1.7 1.7 0 00-.13.62v9.5a1.7 1.7 0 00.13.67c.177.427.515.768.94.95a1.9 1.9 0 00.67.13H4v-1h-.26a.72.72 0 01-.29-.06.74.74 0 01-.4-.4.93.93 0 01-.05-.29v-.5a.93.93 0 01.05-.29.74.74 0 01.4-.4.72.72 0 01.286-.06H13v2H9v1h4.5l.5-.5V10zM4 10V2h9v8H4zm1-7h1v1H5V3zm0 2h1v1H5V5zm1 2H5v1h1V7zm.5 6.49L5.28 15H5v-3h3v3h-.28L6.5 13.49z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsReport = function VsReport(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 1h13l.5.5v10l-.5.5H7.707l-2.853 2.854L4 14.5V12H1.5l-.5-.5v-10l.5-.5zm6 10H14V2H2v9h2.5l.5.5v1.793l2.146-2.147L7.5 11zm0-8h1v5h-1V3zm0 7h1V9h-1v1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRequestChanges = function VsRequestChanges(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 1h-13l-.5.5v10l.5.5H4v2.5l.854.354L7.707 12H14.5l.5-.5v-10l-.5-.5zM14 11H7.5l-.354.146L5 13.293V11.5l-.5-.5H2V2h12v9zm-4-1H6V8.979h4V10zM7.5 3h1v2h2v1h-2v2h-1V6h-2V5h2V3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRocket = function VsRocket(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.491 1c-3.598.004-6.654 1.983-8.835 4H1.5l-.5.5v3l.147.354.991.991.001.009 4 4 .009.001.999.999L7.5 15h3l.5-.5v-4.154c2.019-2.178 3.996-5.233 3.992-8.846l-.501-.5zM2 6h2.643a23.828 23.828 0 00-2.225 2.71L2 8.294V6zm5.7 8l-.42-.423a23.59 23.59 0 002.715-2.216V14H7.7zm-1.143-1.144L3.136 9.437C4.128 8 8.379 2.355 13.978 2.016c-.326 5.612-5.987 9.853-7.421 10.84zM4 15v-1H2v-2H1v3h3zm6.748-7.667a1.5 1.5 0 10-2.496-1.666 1.5 1.5 0 002.495 1.666z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRootFolderOpened = function VsRootFolderOpened(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 6.257V2.5l.5-.5h5l.35.15.86.85h5.79l.5.5V6h1.13l.48.63-2.63 7-.48.37H8.743a5.48 5.48 0 00.657-1h2.73l2.37-6H8.743a5.534 5.534 0 00-.72-.724l.127-.126L8.5 6H13V4H7.5l-.35-.15L6.29 3H2l.01 2.594c-.361.184-.7.407-1.01.663z" clip-rule="evenodd"/><path d="M6 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path fill-rule="evenodd" d="M8 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4.5 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRootFolder = function VsRootFolder(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.71 3h6.79l.51.5v10l-.5.5H8.743a5.48 5.48 0 00.657-1h4.59v-1.51l.01-4v-1.5H7.69l-.017.017a5.494 5.494 0 00-.881-.508l.348-.349.35-.15h6.5l.01-.99H7.5l-.36-.15-.85-.85H2V5.6a5.45 5.45 0 00-.99.649V2.5l.5-.5h5l.35.15.85.85z" clip-rule="evenodd"/><path d="M6 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path fill-rule="evenodd" d="M8 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4.5 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRss = function VsRss(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5 13H3v-2c1.11 0 2 .89 2 2zM3 3v1a9 9 0 019 9h1C13 7.48 8.52 3 3 3zm0 4v1c2.75 0 5 2.25 5 5h1c0-3.31-2.69-6-6-6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRuby = function VsRuby(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 7.19l6.64 6.64h.72L15 7.19v-.72l-3.32-3.32-.36-.15H4.68l-.36.15L1 6.47v.72zm7 5.56L2.08 6.83 4.89 4h6.22l2.81 2.83L8 12.75zm0-7.73h2.69l1.81 1.81-4.5 4.4V5.02z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRunAbove = function VsRunAbove(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1.77 1.01L1 1.42v12l.78.42 9-6v-.83l-9.01-6zM2 12.49V2.36l7.6 5.07L2 12.49zM12.15 8h.71l2.5 2.5-.71.71L13 9.56V15h-1V9.55l-1.65 1.65-.7-.7 2.5-2.5z"/>'
	      }, props)
	  };
	  vs.VsRunAll = function VsRunAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2.78 2L2 2.41v12l.78.42 9-6V8l-9-6zM3 13.48V3.35l7.6 5.07L3 13.48z"/><path fill-rule="evenodd" d="M6 14.683l8.78-5.853V8L6 2.147V3.35l7.6 5.07L6 13.48v1.203z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsRunBelow = function VsRunBelow(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M1.8 1.01l-.78.41v12l.78.42 9-6v-.83l-9-6zm.22 11.48V2.36l7.6 5.07-7.6 5.06zM12.85 15h-.71l-2.5-2.5.71-.71L12 13.44V8h1v5.45l1.65-1.65.71.71L12.85 15z"/>'
	      }, props)
	  };
	  vs.VsRunErrors = function VsRunErrors(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5 2.41L5.78 2l9 6v.83L9 12.683v-1.2l4.6-3.063L6 3.35V7H5V2.41z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.872 7.808c-.85-.053-1.705.159-2.403.641-.753.485-1.233 1.184-1.499 2.03-.269.81-.213 1.72.106 2.518a3.774 3.774 0 001.658 1.873c.756.432 1.616.537 2.467.378.861-.162 1.61-.645 2.143-1.285l.005-.006c.529-.687.852-1.489.852-2.352a3.882 3.882 0 00-1.066-2.72l-.006-.005c-.585-.585-1.388-1.018-2.257-1.072zM2.951 9.183c.512-.373 1.172-.517 1.792-.47h.001c.656.048 1.22.328 1.697.804.516.516.803 1.274.803 2.038v.014c.047.649-.183 1.26-.566 1.789-.426.518-.993.85-1.61.991-.61.141-1.266.047-1.83-.282-.572-.333-1-.808-1.288-1.43-.28-.607-.282-1.265-.091-1.885v-.004a2.865 2.865 0 011.092-1.565zm1.554 1.83L3.292 9.748l-.638.637 1.22 1.27-1.22 1.27.638.637L4.505 12.3l1.213 1.264.638-.637-1.219-1.27 1.219-1.27-.638-.637-1.213 1.263z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSaveAll = function VsSaveAll(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.85 2.65l-1.5-1.5L13 1H4.48l-.5.5V4H1.5l-.5.5v10l.5.5h10l.5-.5V12h2.5l.5-.5V3l-.15-.35zM11 14H2V5h1v3.07h6V5h.79L11 6.21V14zM6 7V5h2v2H6zm8 4h-2V6l-.15-.35-1.5-1.5L10 4H5V2h7.81l1.21 1.21L14 11z"/>'
	      }, props)
	  };
	  vs.VsSaveAs = function VsSaveAs(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.04 1.33L12.71 3l.29.71v.33h-.5l-.5.5v-.83l-1.67-1.67H10v4H4v-4H2v10h3l-.5 1H2l-1-1v-10l1-1h8.33l.71.29zM7 5h2V2H7v3zm6.5 0L15 6.5l-.02.69-5.5 5.5-.13.12-.37.37-.1.09-3 1.5-.67-.67 1.5-3 .09-.1.37-.37.12-.13 5.5-5.5h.71zm-6.22 7.24l-.52 1 1.04-.48-.52-.52zm.69-1.03l.79.79 5.15-5.15-.79-.79-5.15 5.15z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSave = function VsSave(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.353 1.146l1.5 1.5L15 3v11.5l-.5.5h-13l-.5-.5v-13l.5-.5H13l.353.146zM2 2v12h12V3.208L12.793 2H11v4H4V2H2zm6 0v3h2V2H8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsScreenFull = function VsScreenFull(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3 12h10V4H3v8zm2-6h6v4H5V6zM2 6H1V2.5l.5-.5H5v1H2v3zm13-3.5V6h-1V3h-3V2h3.5l.5.5zM14 10h1v3.5l-.5.5H11v-1h3v-3zM2 13h3v1H1.5l-.5-.5V10h1v3z"/>'
	      }, props)
	  };
	  vs.VsScreenNormal = function VsScreenNormal(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3.5 4H1V3h2V1h1v2.5l-.5.5zM13 3V1h-1v2.5l.5.5H15V3h-2zm-1 9.5V15h1v-2h2v-1h-2.5l-.5.5zM1 12v1h2v2h1v-2.5l-.5-.5H1zm11-1.5l-.5.5h-7l-.5-.5v-5l.5-.5h7l.5.5v5zM10 7H6v2h4V7z"/>'
	      }, props)
	  };
	  vs.VsSearchStop = function VsSearchStop(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.738 3.318a4.5 4.5 0 00-.877 5.123A4.48 4.48 0 006.1 10a4.62 4.62 0 00-.1 1v.17c-.16-.11-.32-.22-.47-.34L1.75 14.5 1 13.84l3.8-3.69a5.5 5.5 0 119.62-3.65c0 .268-.02.535-.06.8a5.232 5.232 0 00-.94-.68V6.5a4.5 4.5 0 00-7.682-3.182zm3.04 4.356a4 4 0 114.444 6.652 4 4 0 01-4.444-6.652zm.1 5.447A3 3 0 0011 14a3 3 0 001.74-.55L8.55 9.26A3 3 0 008 11a3 3 0 00.879 2.121zm.382-4.57l4.19 4.189A3 3 0 0014 11a3 3 0 00-3-3 3 3 0 00-1.74.55z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSearch = function VsSearch(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M15.25 0a8.25 8.25 0 00-6.18 13.72L1 22.88l1.12 1 8.05-9.12A8.251 8.251 0 1015.25.01V0zm0 15a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z"/>'
	      }, props)
	  };
	  vs.VsServerEnvironment = function VsServerEnvironment(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6 3h4v1H6V3zm0 6h4v1H6V9zm0 2h4v1H6v-1zm9.14 5H.86l1.25-5H4V2a.95.95 0 01.078-.383c.052-.12.123-.226.211-.32a.922.922 0 01.32-.219A1.01 1.01 0 015 1h6a.95.95 0 01.383.078c.12.052.226.123.32.211a.922.922 0 01.219.32c.052.125.078.256.078.391v9h1.89l1.25 5zM5 13h6V2H5v11zm8.86 2l-.75-3H12v2H4v-2H2.89l-.75 3h11.72z"/>'
	      }, props)
	  };
	  vs.VsServerProcess = function VsServerProcess(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5V9h-1V6H2v7h7v1H1.5l-.5-.5v-11l.5-.5zM2 5h12V3H2v2zm5 7v-1.094a1.633 1.633 0 01-.469-.265l-.945.539-.5-.86.937-.547a1.57 1.57 0 010-.547l-.937-.546.5-.86.945.54c.151-.12.308-.209.469-.266V7h1v1.094a1.48 1.48 0 01.469.265l.945-.539.5.86-.937.547a1.57 1.57 0 010 .546l.937.547-.5.86-.945-.54a1.807 1.807 0 01-.469.266V12H7zm-.25-2.5c0 .208.073.385.219.531a.723.723 0 00.531.219.723.723 0 00.531-.219.723.723 0 00.219-.531.723.723 0 00-.219-.531.723.723 0 00-.531-.219.723.723 0 00-.531.219.723.723 0 00-.219.531zm5.334 5.5v-1.094a1.634 1.634 0 01-.469-.265l-.945.539-.5-.86.938-.547a1.572 1.572 0 010-.547l-.938-.546.5-.86.945.54c.151-.12.308-.209.47-.266V10h1v1.094a1.486 1.486 0 01.468.265l.945-.539.5.86-.937.547a1.562 1.562 0 010 .546l.937.547-.5.86-.945-.54a1.806 1.806 0 01-.469.266V15h-1zm-.25-2.5c0 .208.073.385.219.531a.723.723 0 00.531.219.723.723 0 00.531-.219.723.723 0 00.22-.531.723.723 0 00-.22-.531.723.723 0 00-.53-.219.723.723 0 00-.532.219.723.723 0 00-.219.531z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsServer = function VsServer(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.5 5L2 4.5v-3l.5-.5h11l.5.5v3l-.5.5h-11zM10 2H9v1H8V2H7v1H6V2H5v1H4V2H3v2h10V2h-2v1h-1V2zm-7.5 8L2 9.5v-3l.5-.5h11l.5.5v3l-.5.5h-11zM6 7H5v1H4V7H3v2h10V7h-2v1h-1V7H9v1H8V7H7v1H6V7zm7.5 8l.5-.5v-3l-.5-.5h-11l-.5.5v3l.5.5h11zM3 14v-2h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h2v2H3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSettingsGear = function VsSettingsGear(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M19.85 8.75l4.15.83v4.84l-4.15.83 2.35 3.52-3.43 3.43-3.52-2.35-.83 4.15H9.58l-.83-4.15-3.52 2.35-3.43-3.43 2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23 5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15 3.52-2.35 3.43 3.43-2.35 3.52zm-1.57 5.07l4-.81v-2l-4-.81-.54-1.3 2.29-3.43-1.43-1.43-3.43 2.29-1.3-.54-.81-4h-2l-.81 4-1.3.54-3.43-2.29-1.43 1.43L6.38 8.9l-.54 1.3-4 .81v2l4 .81.54 1.3-2.29 3.43 1.43 1.43 3.43-2.29 1.3.54.81 4h2l.81-4 1.3-.54 3.43 2.29 1.43-1.43-2.29-3.43.54-1.3zm-8.186-4.672A3.43 3.43 0 0112 8.57 3.44 3.44 0 0115.43 12a3.43 3.43 0 11-5.336-2.852zm.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0013.71 12a1.71 1.71 0 10-2.66 1.422z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSettings = function VsSettings(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.5 2h-1v5h1V2zm6.1 5H6.4L6 6.45v-1L6.4 5h3.2l.4.5v1l-.4.5zm-5 3H1.4L1 9.5v-1l.4-.5h3.2l.4.5v1l-.4.5zm3.9-8h-1v2h1V2zm-1 6h1v6h-1V8zm-4 3h-1v3h1v-3zm7.9 0h3.19l.4-.5v-.95l-.4-.5H11.4l-.4.5v.95l.4.5zm2.1-9h-1v6h1V2zm-1 10h1v2h-1v-2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsShield = function VsShield(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8.246 14.713a27.792 27.792 0 01-1.505-.953c-.501-.34-.983-.707-1.444-1.1-.458-.395-.888-.82-1.288-1.274-.4-.455-.753-.95-1.05-1.478a7.8 7.8 0 01-.7-1.69A7.041 7.041 0 012 6.3V3.1l.5-.5c.333 0 .656-.011.97-.036.296-.023.591-.066.882-.128.284-.062.562-.148.832-.256.284-.118.557-.261.816-.427a4.83 4.83 0 011.184-.565 4.8 4.8 0 012-.142 4.018 4.018 0 011.237.383c.199.097.392.204.58.322.26.167.535.31.821.428.27.109.547.194.831.256.291.062.587.106.884.129.311.024.634.035.967.035l.5.5v3.2a7.043 7.043 0 01-.256 1.919 7.804 7.804 0 01-.7 1.69 8.751 8.751 0 01-1.05 1.478c-.4.452-.829.877-1.286 1.27a15.94 15.94 0 01-1.448 1.1 28.71 28.71 0 01-1.51.956h-.508zM3 3.59V6.3c-.004.555.07 1.11.22 1.645a6.7 6.7 0 00.61 1.473c.263.467.575.905.93 1.308.37.417.766.81 1.188 1.174.432.368.883.712 1.352 1.03.4.267.8.523 1.2.769.4-.242.8-.498 1.2-.768.47-.319.923-.663 1.355-1.031.421-.364.817-.756 1.186-1.172a7.8 7.8 0 00.93-1.308c.261-.465.466-.96.61-1.473.15-.537.223-1.09.22-1.647V3.59c-.159 0-.313-.012-.465-.023l-.079-.006a7.95 7.95 0 01-1.018-.147 6.112 6.112 0 01-1.976-.814 5.166 5.166 0 00-.482-.27 3.123 3.123 0 00-.943-.29 3.686 3.686 0 00-1.558.106c-.332.108-.649.26-.94.452-.312.2-.64.372-.983.513a6.4 6.4 0 01-1 .307c-.335.07-.675.12-1.017.146-.174.01-.355.02-.54.026zm6.065 4.3a1.5 1.5 0 10-1.13 0L7.5 10.5h2l-.435-2.61z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSignIn = function VsSignIn(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.02 3.77l.01-.01.99.99V2.5l-.5-.5h-9l-.51.5v.493L2 3v10.29l.36.46 5 1.72L8 15v-1h3.52l.5-.5v-2.25l-1 1V13H8V4.71l-.33-.46L4.036 3h6.984v.77zM7 14.28l-4-1.34V3.72l4 1.34v9.22zm3.09-6.75h4.97v1h-4.93l1.59 1.6-.71.7-2.47-2.46v-.71l2.49-2.48.7.7-1.64 1.65z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSignOut = function VsSignOut(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.02 3.77v1.56l1-.99V2.5l-.5-.5h-9l-.5.5v.486L2 3v10.29l.36.46 5 1.72L8 15v-1h3.52l.5-.5v-1.81l-1-1V13H8V4.71l-.33-.46L4.036 3h6.984v.77zM7 14.28l-4-1.34V3.72l4 1.34v9.22zm6.52-5.8H8.55v-1h4.93l-1.6-1.6.71-.7 2.47 2.46v.71l-2.49 2.48-.7-.7 1.65-1.65z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSmiley = function VsSmiley(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4.111 2.18a7 7 0 117.778 11.64A7 7 0 014.11 2.18zm.556 10.809a6 6 0 106.666-9.978 6 6 0 00-6.666 9.978zM6.5 7a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0zM8 11a3 3 0 01-2.65-1.58l-.87.48a4 4 0 007.12-.16l-.9-.43A3 3 0 018 11z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSortPrecedence = function VsSortPrecedence(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7 2L6 3v3h1V3h7v2.453l.207-.16.793.793V3l-1-1H7zm1 2h2v2H8V4zM5 9H3v2h2V9zM2 7L1 8v5l1 1h7l1-1V8L9 7H2zm0 6V8h7v5H2zm6-3H6v2h2v-2zm5-6h-1v3.864l-1.182-1.182-.707.707 2.035 2.036h.708l2.035-2.036-.707-.707L13 7.864V4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSourceControl = function VsSourceControl(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path d="M21.007 8.222A3.738 3.738 0 0015.045 5.2a3.737 3.737 0 001.156 6.583 2.988 2.988 0 01-2.668 1.67h-2.99a4.456 4.456 0 00-2.989 1.165V7.4a3.737 3.737 0 10-1.494 0v9.117a3.776 3.776 0 101.816.099 2.99 2.99 0 012.668-1.667h2.99a4.484 4.484 0 004.223-3.039 3.736 3.736 0 003.25-3.687zM4.565 3.738a2.242 2.242 0 114.484 0 2.242 2.242 0 01-4.484 0zm4.484 16.441a2.242 2.242 0 11-4.484 0 2.242 2.242 0 014.484 0zm8.221-9.715a2.242 2.242 0 110-4.485 2.242 2.242 0 010 4.485z"/>'
	      }, props)
	  };
	  vs.VsSplitHorizontal = function VsSplitHorizontal(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zM8 13H3V2h5v11zm6 0H9V2h5v11z"/>'
	      }, props)
	  };
	  vs.VsSplitVertical = function VsSplitVertical(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zm0 12H3V8h11v5zm0-6H3V2h11v5z"/>'
	      }, props)
	  };
	  vs.VsSquirrel = function VsSquirrel(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.558 2.642a3.698 3.698 0 00-.123-.01A1.47 1.47 0 003.999 1.52v1.307a4.898 4.898 0 00-2.993 3.587v.39c.459.836 1.906 1.13 2.154 1.18.027.006.04.009.035.009-2.419.32-2.19 2.249-2.19 2.249a1 1 0 001 .93c.272-.019.538-.08.79-.18h2.06a3 3 0 00-.36 1h-.32a2.55 2.55 0 00-2.17 2.528.42.42 0 00.39.48h6.677a3.76 3.76 0 003.929-4.158 3.649 3.649 0 00-.75-2.09l-.11-.14c-.43-.55-.68-.909-.55-1.289.13-.38.365-.4.365-.4s.185-.03.455.09c.22.128.46.22.71.27a1.58 1.58 0 001.736-.905c.095-.208.143-.435.143-.664.006-.718-.33-1.455-.725-2.088a4.998 4.998 0 00-1.554-1.57 3.998 3.998 0 00-2.639-.4 3.049 3.049 0 00-1.67.89 3.56 3.56 0 00-.779 1.359 4.358 4.358 0 00-.636-.747v-.159A1.47 1.47 0 005.558 1.52v1.122zm5.304 8.739c.111.741.22 1.821-.867 2.442-.296.103-.608.16-.923.167H3.215a1 1 0 01.92-1h1.279v-.499a1.79 1.79 0 011.653-1.825l-.626-.887c-.236.067-.463.153-.577.233H2.655a.754.754 0 00-.264.07c-.138.055-.274.109-.396.03-.2-.13.11-1.12 1.01-1.12h1c.49 0 .57-.54.57-.54l.28-1.129a3.389 3.389 0 01-2.85-.93 3.389 3.389 0 013.14-2.658l.083.002c.26.008.435.014.776.168.93.42 2.149 2.469 2.149 2.469l.06.09h.17v-.07c-.06-.443-.02-1.464.116-1.89.137-.424.367-.814.673-1.14a2.349 2.349 0 011.3-.659 2.639 2.639 0 011.86.29c.46.284.85.67 1.139 1.127.289.457.476.836.535 1.374-.001.02 0 .047.002.081.007.143.02.39-.128.547-.127.135-.448.23-.67.18a1.57 1.57 0 01-.45-.18 1.33 1.33 0 00-1.139-.13 1.42 1.42 0 00-.94 1 2.318 2.318 0 00.64 2.238l.11.14c.347.434.546.966.57 1.52a2.999 2.999 0 01-.306 1.425 2.708 2.708 0 00-.464-1.304l-.37.368zM4.24 5a.5.5 0 100 1 .5.5 0 000-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsStarEmpty = function VsStarEmpty(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.595 6.252L8 1 6.405 6.252H1l4.373 3.4L3.75 15 8 11.695 12.25 15l-1.623-5.348L15 6.252H9.595zm-7.247.47H6.72L8 2.507 6.72 6.722H2.348zm3.537 2.75l-1.307 4.305 1.307-4.305zm7.767-2.75H9.28h4.372zm-8.75.9h2.366L8 5.214l.732 2.41h2.367l-1.915 1.49.731 2.409L8 10.032l-1.915 1.49.731-2.41-1.915-1.49z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsStarFull = function VsStarFull(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M9.595 6.252L8 1 6.405 6.252H1l4.373 3.4L3.75 15 8 11.695 12.25 15l-1.623-5.348L15 6.252H9.595z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsStarHalf = function VsStarHalf(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6.405 6.252L8 1l1.595 5.252H15l-4.373 3.4L12.25 15 8 11.695 3.75 15l1.623-5.348L1 6.252h5.405zM8 10.032l1.915 1.49-.731-2.41 1.915-1.49H8.732L8 5.214v4.82zm0-7.525zm5.652 4.215H9.28h4.372z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsStopCircle = function VsStopCircle(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M6 6h4v4H6z"/><path fill-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolArray = function VsSymbolArray(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2l-.5.5v11l.5.5H4v-1H2V3h2V2H1.5zm13 12l.5-.5v-11l-.5-.5H12v1h2v10h-2v1h2.5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolBoolean = function VsSymbolBoolean(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1 3.5l.5-.5h13l.5.5v9l-.5.5h-13l-.5-.5v-9zM14 4H8v3.493h-.5l-3.574-.005 2.09-2.09-.707-.707-2.955 2.955v.708l2.955 2.955.707-.707-2.114-2.114 3.996.005H8v-.986l3.907.005-2.114-2.114.707-.707 2.956 2.955v.708L10.5 11.309l-.707-.707 2.09-2.09L8 8.507V12h6V4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolClass = function VsSymbolClass(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M11.34 9.71h.71l2.67-2.67v-.71L13.38 5h-.7l-1.82 1.81h-5V5.56l1.86-1.85V3l-2-2H5L1 5v.71l2 2h.71l1.14-1.15v5.79l.5.5H10v.52l1.33 1.34h.71l2.67-2.67v-.71L13.37 10h-.7l-1.86 1.85h-5v-4H10v.48l1.34 1.38zm1.69-3.65l.63.63-2 2-.63-.63 2-2zm0 5l.63.63-2 2-.63-.63 2-2zM3.35 6.65l-1.29-1.3 3.29-3.29 1.3 1.29-3.3 3.3z"/>'
	      }, props)
	  };
	  vs.VsSymbolColor = function VsSymbolColor(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 1.003a7 7 0 00-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 012.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 100-14l-.04.03zm0 13h-.52a.58.58 0 01-.36-.14.56.56 0 01-.15-.3 1.24 1.24 0 01.35-1.08 2.87 2.87 0 000-4 2.87 2.87 0 00-4.06 0 1 1 0 01-.9.34.41.41 0 01-.22-.12.42.42 0 01-.1-.29v-.37a6 6 0 116 6l-.04-.04zM9 3.997a1 1 0 11-2 0 1 1 0 012 0zm3 7.007a1 1 0 11-2 0 1 1 0 012 0zm-7-5a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM13 8a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolConstant = function VsSymbolConstant(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 6h8v1H4V6zm8 3H4v1h8V9z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M1 4l1-1h12l1 1v8l-1 1H2l-1-1V4zm1 0v8h12V4H2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolEnumMember = function VsSymbolEnumMember(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7 3l1-1h6l1 1v5l-1 1h-4V8h4V3H8v3H7V3zm2 6V8L8 7H2L1 8v5l1 1h6l1-1V9zM8 8v5H2V8h6zm1.414-1L9 6.586V6h4v1H9.414zM9 4h4v1H9V4zm-2 6H3v1h4v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolEnum = function VsSymbolEnum(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14 2H8L7 3v3h1V3h6v5h-4v1h4l1-1V3l-1-1zM9 6h4v1H9.41L9 6.59V6zM7 7H2L1 8v5l1 1h6l1-1V8L8 7H7zm1 6H2V8h6v5zM3 9h4v1H3V9zm0 2h4v1H3v-1zm6-7h4v1H9V4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolEvent = function VsSymbolEvent(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.414 1.56L8.312 1h3.294l.818 1.575L10.236 6h1.781l.72 1.695L5.618 15l-1.602-1.163L6.119 10H4.898L4 8.56l3.414-7zM7.78 9L4.9 14.305 12.018 7H8.312l3.294-5H8.312L4.898 9H7.78z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolField = function VsSymbolField(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.45 4.5l-5-2.5h-.9l-7 3.5-.55.89v4.5l.55.9 5 2.5h.9l7-3.5.55-.9v-4.5l-.55-.89zm-8 8.64l-4.5-2.25V7.17l4.5 2v3.97zm.5-4.8L2.29 6.23l6.66-3.34 4.67 2.34-6.67 3.11zm7 1.55l-6.5 3.25V9.21l6.5-3v3.68z"/>'
	      }, props)
	  };
	  vs.VsSymbolFile = function VsSymbolFile(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.85 4.44l-3.28-3.3-.35-.14H2.5l-.5.5v13l.5.5h11l.5-.5V4.8l-.15-.36zM13 5h-3V2l3 3zM3 14V2h6v3.5l.5.5H13v8H3z"/>'
	      }, props)
	  };
	  vs.VsSymbolInterface = function VsSymbolInterface(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M11.496 4a3.49 3.49 0 00-3.46 3h-3.1a2 2 0 100 1h3.1a3.5 3.5 0 103.46-4zm0 6a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>'
	      }, props)
	  };
	  vs.VsSymbolKey = function VsSymbolKey(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.223 10.933c.326.192.699.29 1.077.282a2.159 2.159 0 001.754-.842 3.291 3.291 0 00.654-2.113 2.886 2.886 0 00-.576-1.877 1.99 1.99 0 00-1.634-.733 2.294 2.294 0 00-1.523.567V3.475h-.991V11.1h.995v-.344c.076.066.158.125.244.177zM7.85 6.7c.186-.079.388-.113.59-.1a1.08 1.08 0 01.896.428c.257.363.382.802.357 1.245a2.485 2.485 0 01-.4 1.484 1.133 1.133 0 01-.96.508 1.224 1.224 0 01-.976-.417A1.522 1.522 0 016.975 8.8v-.6a1.722 1.722 0 01.393-1.145c.13-.154.296-.276.482-.355zM3.289 5.675a3.03 3.03 0 00-.937.162 2.59 2.59 0 00-.8.4l-.1.077v1.2l.423-.359a2.1 2.1 0 011.366-.572.758.758 0 01.661.282c.15.232.23.503.231.779L2.9 7.825a2.6 2.6 0 00-1.378.575 1.65 1.65 0 00-.022 2.336 1.737 1.737 0 001.253.454 1.96 1.96 0 001.107-.332c.102-.068.197-.145.286-.229v.444h.941V7.715a2.193 2.193 0 00-.469-1.5 1.687 1.687 0 00-1.329-.54zm.857 3.041c.02.418-.12.829-.391 1.148a1.221 1.221 0 01-.955.422.832.832 0 01-.608-.2.833.833 0 010-1.091c.281-.174.6-.277.93-.3l1.02-.148.004.169zm8.313 2.317c.307.13.64.193.973.182.495.012.983-.114 1.41-.365l.123-.075.013-.007V9.615l-.446.32c-.316.224-.696.34-1.084.329A1.3 1.3 0 0112.4 9.8a1.975 1.975 0 01-.4-1.312 2.01 2.01 0 01.453-1.381A1.432 1.432 0 0113.6 6.6a1.8 1.8 0 01.971.279l.43.265V5.97l-.17-.073a2.9 2.9 0 00-1.17-.247 2.52 2.52 0 00-1.929.817 2.9 2.9 0 00-.747 2.049c-.028.707.21 1.4.67 1.939.222.249.497.446.804.578z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolKeyword = function VsSymbolKeyword(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 4h-5V3h5v1zm-1 3h-2v1h2V7zm-4 0H1v1h9V7zm2 6H1v1h11v-1zm-5-3H1v1h6v-1zm8 0h-5v1h5v-1zM8 2v3H1V2h7zM7 3H2v1h5V3z"/>'
	      }, props)
	  };
	  vs.VsSymbolMethod = function VsSymbolMethod(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.51 4l-5-3h-1l-5 3-.49.86v6l.49.85 5 3h1l5-3 .49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84 4.74 2.84-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/>'
	      }, props)
	  };
	  vs.VsSymbolMisc = function VsSymbolMisc(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 2h8v4c.341.035.677.112 1 .23V1H3v8.48l1-1.75V2zm2.14 8L5 8 4 9.75 3.29 11 1 15h8l-2.29-4-.57-1zm-3.42 4l1.72-3L5 10l.56 1 1.72 3H2.72zm6.836-6.41a3.5 3.5 0 113.888 5.82 3.5 3.5 0 01-3.888-5.82zm.555 4.989a2.5 2.5 0 102.778-4.157 2.5 2.5 0 00-2.778 4.157z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolNamespace = function VsSymbolNamespace(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M6 2.984V2h-.09c-.313 0-.616.062-.909.185a2.33 2.33 0 00-.775.53 2.23 2.23 0 00-.493.753v.001a3.542 3.542 0 00-.198.83v.002a6.08 6.08 0 00-.024.863c.012.29.018.58.018.869 0 .203-.04.393-.117.572v.001a1.504 1.504 0 01-.765.787 1.376 1.376 0 01-.558.115H2v.984h.09c.195 0 .38.04.556.121l.001.001c.178.078.329.184.455.318l.002.002c.13.13.233.285.307.465l.001.002c.078.18.117.368.117.566 0 .29-.006.58-.018.869-.012.296-.004.585.024.87v.001c.033.283.099.558.197.824v.001c.106.273.271.524.494.753.223.23.482.407.775.53.293.123.596.185.91.185H6v-.984h-.09c-.199 0-.387-.038-.562-.115a1.613 1.613 0 01-.457-.32 1.659 1.659 0 01-.309-.467c-.074-.18-.11-.37-.11-.573 0-.228.003-.453.011-.672.008-.228.008-.45 0-.665a4.639 4.639 0 00-.055-.64 2.682 2.682 0 00-.168-.609A2.284 2.284 0 003.522 8a2.284 2.284 0 00.738-.955c.08-.192.135-.393.168-.602.033-.21.051-.423.055-.64.008-.22.008-.442 0-.666-.008-.224-.012-.45-.012-.678a1.47 1.47 0 01.877-1.354 1.33 1.33 0 01.563-.121H6zm4 10.032V14h.09c.313 0 .616-.062.909-.185.293-.123.552-.3.775-.53.223-.23.388-.48.493-.753v-.001c.1-.266.165-.543.198-.83v-.002c.028-.28.036-.567.024-.863-.012-.29-.018-.58-.018-.869 0-.203.04-.393.117-.572v-.001a1.504 1.504 0 01.765-.787c.176-.077.362-.115.558-.115H14v-.984h-.09c-.195 0-.38-.04-.556-.121l-.001-.001a1.376 1.376 0 01-.455-.318l-.002-.002a1.414 1.414 0 01-.307-.465l-.001-.002a1.405 1.405 0 01-.117-.566c0-.29.006-.58.018-.869a6.19 6.19 0 00-.024-.87v-.001a3.542 3.542 0 00-.197-.824v-.001a2.23 2.23 0 00-.494-.753 2.33 2.33 0 00-.775-.53 2.325 2.325 0 00-.91-.185H10v.984h.09c.2 0 .386.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.282 2.282 0 00.738.955 2.282 2.282 0 00-.738.955 2.7 2.7 0 00-.168.602c-.033.21-.051.423-.055.64-.008.22-.008.442 0 .666.008.224.012.45.012.678a1.47 1.47 0 01-.42 1.035 1.466 1.466 0 01-.457.319 1.33 1.33 0 01-.563.121H10z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolNumeric = function VsSymbolNumeric(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11 1v4h4v1h-4v4h4v1h-4v4h-1v-4H6v4H5v-4H1v-1h4V6H1V5h4V1h1v4h4V1h1zM6 6v4h4V6H6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolOperator = function VsSymbolOperator(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.873 1.1c.335.136.602.398.745.73.072.17.109.352.107.537a1.34 1.34 0 01-.61 1.135 1.359 1.359 0 01-.753.223A1.355 1.355 0 011 2.362a1.355 1.355 0 01.83-1.256A1.37 1.37 0 012.873 1.1zm-.298 1.765a.551.551 0 00.332-.5.548.548 0 10-.332.5zM6.43 1.109L1.11 6.43l.686.687 5.32-5.32-.686-.687zM11.5 9h1v2.5H15v1h-2.5V15h-1v-2.5H9v-1h2.5V9zm-5.732.525l.707.707L4.707 12l1.768 1.768-.707.707L4 12.707l-1.768 1.768-.707-.707L3.293 12l-1.768-1.768.707-.707L4 11.293l1.768-1.768zm1.35-4.195a1.353 1.353 0 00-1.256-.83 1.355 1.355 0 00-1.256.83 1.362 1.362 0 001.257 1.895A1.358 1.358 0 007.118 5.33zm-.753.745a.553.553 0 01-.289.29.547.547 0 01-.599-.117.529.529 0 01-.117-.173.544.544 0 01.716-.715.565.565 0 01.173.116.549.549 0 01.116.599zM14 3h-4v1h4V3z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolParameter = function VsSymbolParameter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11 6h-1v-.5a.5.5 0 00-.5-.5H8.479v5.5a.5.5 0 00.5.5h.5v1h-3v-1h.5a.5.5 0 00.5-.5V5H6.5a.5.5 0 00-.5.5V6H5V4h6v2zm2.914 2.048l-1.462-1.462.707-.707 1.816 1.816v.707l-1.768 1.767-.707-.707 1.414-1.414zM3.548 9.462L2.086 8 3.5 6.586l-.707-.707-1.768 1.767v.708l1.816 1.815.707-.707z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolProperty = function VsSymbolProperty(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2.807 14.975a1.75 1.75 0 01-1.255-.556 1.684 1.684 0 01-.544-1.1A1.72 1.72 0 011.36 12.1c1.208-1.27 3.587-3.65 5.318-5.345a4.257 4.257 0 01.048-3.078 4.095 4.095 0 011.665-1.969 4.259 4.259 0 014.04-.36l.617.268-2.866 2.951 1.255 1.259 2.944-2.877.267.619a4.295 4.295 0 01.04 3.311 4.198 4.198 0 01-.923 1.392 4.27 4.27 0 01-.743.581 4.217 4.217 0 01-3.812.446c-1.098 1.112-3.84 3.872-5.32 5.254a1.63 1.63 0 01-1.084.423zm7.938-13.047a3.32 3.32 0 00-1.849.557c-.213.13-.412.284-.591.458a3.321 3.321 0 00-.657 3.733l.135.297-.233.227c-1.738 1.697-4.269 4.22-5.485 5.504a.805.805 0 00.132 1.05.911.911 0 00.298.22c.1.044.209.069.319.072a.694.694 0 00.45-.181c1.573-1.469 4.612-4.539 5.504-5.44l.23-.232.294.135a3.286 3.286 0 003.225-.254 3.33 3.33 0 00.591-.464 3.28 3.28 0 00.964-2.358c0-.215-.021-.43-.064-.642L11.43 7.125 8.879 4.578l2.515-2.59a3.286 3.286 0 00-.65-.06z"/>'
	      }, props)
	  };
	  vs.VsSymbolRuler = function VsSymbolRuler(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M4 1L3 2v12l1 1h8l1-1V2l-1-1H4zm0 2V2h8v12H4v-1h2v-1H4v-2h4V9H4V7h2V6H4V4h4V3H4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolSnippet = function VsSymbolSnippet(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.5 1l-.5.5V13h1V2h11v11h1V1.5l-.5-.5h-12zM2 15v-1h1v1H2zm3-1H4v1h1v-1zm1 0h1v1H6v-1zm3 0H8v1h1v-1zm1 0h1v1h-1v-1zm5 1v-1h-1v1h1zm-3-1h1v1h-1v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolString = function VsSymbolString(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 2L1 3v9l1 1h12l1-1V3l-1-1H2zm0 10V3h12v9H2zm3.356-3.07H6V7.22C6 6.408 5.685 6 5.056 6c-.135 0-.285.024-.45.073a1.444 1.444 0 00-.388.167v.665c.237-.203.487-.304.75-.304.261 0 .392.156.392.469l-.6.103c-.506.086-.76.406-.76.961 0 .263.061.473.183.631A.61.61 0 004.69 9c.29 0 .509-.16.657-.48h.009v.41zm.004-1.355v.193a.75.75 0 01-.12.436.368.368 0 01-.313.17.276.276 0 01-.22-.095.38.38 0 01-.08-.248c0-.222.11-.351.332-.389l.4-.067zM7.6 8.626h-.007v.31H7V5h.593v1.677h.008c.146-.31.355-.465.625-.465.248 0 .44.118.573.353.134.236.201.557.201.966 0 .443-.078.798-.235 1.067C8.61 8.866 8.4 9 8.138 9c-.237 0-.416-.125-.537-.374zm-.016-1.121v.272a.78.78 0 00.107.426c.071.113.163.169.274.169.135 0 .24-.072.314-.216.075-.145.113-.35.113-.615 0-.22-.035-.39-.104-.514-.067-.124-.164-.187-.29-.187-.12 0-.219.062-.298.185a.887.887 0 00-.116.48zM11.262 9c.321 0 .567-.058.738-.173v-.71a.9.9 0 01-.552.207.619.619 0 01-.5-.215c-.12-.145-.181-.345-.181-.598 0-.26.063-.464.189-.612a.644.644 0 01.516-.223c.194 0 .37.069.528.207v-.749c-.129-.09-.338-.134-.626-.134-.417 0-.751.14-1.001.422-.249.28-.373.662-.373 1.148 0 .42.116.764.349 1.03.232.267.537.4.913.4z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolStructure = function VsSymbolStructure(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 2L1 3v3l1 1h12l1-1V3l-1-1H2zm0 1h12v3H2V3zm-1 7l1-1h3l1 1v3l-1 1H2l-1-1v-3zm2 0H2v3h3v-3H3zm7 0l1-1h3l1 1v3l-1 1h-3l-1-1v-3zm2 0h-1v3h3v-3h-2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSymbolVariable = function VsSymbolVariable(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2 5h2V4H1.5l-.5.5v8l.5.5H4v-1H2V5zm12.5-1H12v1h2v7h-2v1h2.5l.5-.5v-8l-.5-.5zm-2.74 2.57L12 7v2.51l-.3.45-4.5 2h-.46l-2.5-1.5-.24-.43v-2.5l.3-.46 4.5-2h.46l2.5 1.5zM5 9.71l1.5.9V9.28L5 8.38v1.33zm.58-2.15l1.45.87 3.39-1.5-1.45-.87-3.39 1.5zm1.95 3.17l3.5-1.56v-1.4l-3.5 1.55v1.41z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsSyncIgnored = function VsSyncIgnored(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5.468 3.687l-.757-.706a6 6 0 019.285 4.799L15.19 6.6l.75.76-2.09 2.07-.76-.01L11 7.31l.76-.76 1.236 1.25a5 5 0 00-7.528-4.113zm4.55 8.889l.784.73a6 6 0 01-8.796-5.04L.78 9.5 0 8.73l2.09-2.07.76.01 2.09 2.12-.76.76-1.167-1.18a5 5 0 007.005 4.206z" clip-rule="evenodd"/><path d="M1.123 2.949l.682-.732L13.72 13.328l-.682.732z"/>'
	      }, props)
	  };
	  vs.VsSync = function VsSync(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.006 8.267L.78 9.5 0 8.73l2.09-2.07.76.01 2.09 2.12-.76.76-1.167-1.18a5 5 0 009.4 1.983l.813.597a6 6 0 01-11.22-2.683zm10.99-.466L11.76 6.55l-.76.76 2.09 2.11.76.01 2.09-2.07-.75-.76-1.194 1.18a6 6 0 00-11.11-2.92l.81.594a5 5 0 019.3 2.346z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTable = function VsTable(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.5 2h-12l-.5.5v11l.5.5h12l.5-.5v-11l-.5-.5zM2 3h11v1H2V3zm7 4H6V5h3v2zm0 1v2H6V8h3zM2 5h3v2H2V5zm0 3h3v2H2V8zm0 5v-2h3v2H2zm4 0v-2h3v2H6zm7 0h-3v-2h3v2zm0-3h-3V8h3v2zm-3-3V5h3v2h-3z"/>'
	      }, props)
	  };
	  vs.VsTag = function VsTag(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.2 2H8.017l-.353.146L1 8.81v.707L6.183 14.7h.707l2.215-2.215A4.48 4.48 0 0015.65 9c.027-.166.044-.332.051-.5a4.505 4.505 0 00-2-3.74V2.5l-.5-.5zm-.5 2.259A4.504 4.504 0 0011.2 4a.5.5 0 100 1 3.5 3.5 0 011.5.338v2.138L8.775 11.4a.506.506 0 00-.217.217l-2.022 2.022-4.475-4.476L8.224 3H12.7v1.259zm1 1.792a3.5 3.5 0 011 2.449 3.438 3.438 0 01-.051.5 3.487 3.487 0 01-4.793 2.735l3.698-3.698.146-.354V6.051z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTarget = function VsTarget(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8 9a1 1 0 100-2 1 1 0 000 2z"/><path d="M12 8a4 4 0 11-8 0 4 4 0 018 0zm-4 3a3 3 0 100-6 3 3 0 000 6z"/><path d="M15 8A7 7 0 111 8a7 7 0 0114 0zm-7 6A6 6 0 108 2a6 6 0 000 12z"/>'
	      }, props)
	  };
	  vs.VsTasklist = function VsTasklist(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.57 6.699l5.693-4.936L8.585 1 3.273 5.596l-1.51-1.832L1 4.442l1.85 2.214.72.043zM15 5H6.824l2.307-2H15v2zM6 7h9v2H6V7zm9 4H6v2h9v-2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTelescope = function VsTelescope(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M11.24 1l.59.24 2.11 4.93-.23.59-3.29 1.41-.59-.24-.17-.41L6.1 9l-.58-.19-.16-.38L2.8 9.49l-.58-.24-.72-1.67.28-.59 2.5-1.06-.18-.41.24-.58L7.9 3.41 7.72 3 8 2.42 11.24 1zM2.5 7.64l.35.85 2.22-.91-.37-.85-2.2.91zm2.74-2.12l1.11 2.45 3-1.28-1.11-2.44-3 1.27zM8.79 3l1.86 4.11 2.29-1.01L11.18 2 8.72 3h.07zM8.5 9.1l3.02 4.9h-1.17l-1.88-3.03v4h-1V9.82L5.58 14h-1.1l1.7-3.9 2.32-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTerminalBash = function VsTerminalBash(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.655 3.56L8.918.75a1.785 1.785 0 00-1.82 0L2.363 3.56a1.889 1.889 0 00-.921 1.628v5.624a1.889 1.889 0 00.913 1.627l4.736 2.812a1.785 1.785 0 001.82 0l4.736-2.812a1.888 1.888 0 00.913-1.627V5.188a1.889 1.889 0 00-.904-1.627zm-3.669 8.781v.404a.149.149 0 01-.07.124l-.239.137c-.038.02-.07 0-.07-.053v-.396a.78.78 0 01-.545.053.073.073 0 01-.027-.09l.086-.365a.153.153 0 01.071-.096.048.048 0 01.038 0 .662.662 0 00.497-.063.662.662 0 00.37-.567c0-.206-.112-.292-.384-.293-.344 0-.661-.066-.67-.574A1.47 1.47 0 019.6 9.437V9.03a.147.147 0 01.07-.126l.231-.147c.038-.02.07 0 .07.054v.409a.754.754 0 01.453-.055.073.073 0 01.03.095l-.081.362a.156.156 0 01-.065.09.055.055 0 01-.035 0 .6.6 0 00-.436.072.549.549 0 00-.331.486c0 .185.098.242.425.248.438 0 .627.199.632.639a1.568 1.568 0 01-.576 1.185zm2.481-.68a.094.094 0 01-.036.092l-1.198.727a.034.034 0 01-.04.003.035.035 0 01-.016-.037v-.31a.086.086 0 01.055-.076l1.179-.706a.035.035 0 01.056.035v.273zm.827-6.914L8.812 7.515c-.559.331-.97.693-.97 1.367v5.52c0 .404.165.662.413.741a1.465 1.465 0 01-.248.025c-.264 0-.522-.072-.748-.207L2.522 12.15a1.558 1.558 0 01-.75-1.338V5.188a1.558 1.558 0 01.75-1.34l4.738-2.81a1.46 1.46 0 011.489 0l4.736 2.812a1.548 1.548 0 01.728 1.083c-.154-.334-.508-.427-.92-.185h.002z"/>'
	      }, props)
	  };
	  vs.VsTerminalCmd = function VsTerminalCmd(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10.875 7l2.008 5h-.711l-2.008-5h.711zm-5.125.594c-.276 0-.526.041-.75.125a1.542 1.542 0 00-.578.375c-.162.166-.287.37-.375.61a2.364 2.364 0 00-.133.827c0 .287.04.547.117.781.078.235.196.433.352.594.156.162.346.29.57.383.224.094.48.138.766.133a2.63 2.63 0 00.992-.195l.125.484a1.998 1.998 0 01-.492.148 4.381 4.381 0 01-.75.07 2.61 2.61 0 01-.914-.156 2.207 2.207 0 01-.742-.453 1.878 1.878 0 01-.485-.742 3.204 3.204 0 01-.18-1.023c0-.365.06-.698.18-1 .12-.302.287-.563.5-.782.214-.218.471-.388.774-.507a2.69 2.69 0 011-.18c.296 0 .536.023.718.07.183.047.315.094.399.14l-.149.493a1.85 1.85 0 00-.406-.14 2.386 2.386 0 00-.539-.055zM8 8h1v1H8V8zm0 2h1v1H8v-1z"/><path d="M15.5 1H.5l-.5.5v13l.5.5h15l.5-.5v-13l-.5-.5zM15 14H1V5h14v9zm0-10H1V2h14v2z"/>'
	      }, props)
	  };
	  vs.VsTerminalDebian = function VsTerminalDebian(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.084.029a1.276 1.276 0 00-.355.05L6.622.065a9.46 9.46 0 01.514-.048c.075-.005.15-.01.224-.017a1.67 1.67 0 01-.276.029zm4.127 7.646c.094-.238.172-.436.16-.762l-.133.282c.135-.41.123-.847.112-1.262-.005-.187-.01-.37-.002-.543l-.054-.015c-.048-1.411-1.268-2.911-2.354-3.419-.936-.432-2.376-.506-3.042-.18a.657.657 0 01.212-.085c.107-.031.197-.058.135-.093-.6.06-.778.171-.973.294a1.92 1.92 0 01-.635.273c-.11.106.051.063.181.029.129-.035.226-.06-.004.076a1.7 1.7 0 01-.303.05c-.26.025-.492.048-.96.532.026.041.11-.009.168-.044.072-.043.106-.063-.054.137C3.07 2.871 1.78 4.31 1.507 4.787l.143.025c-.1.25-.213.461-.313.649-.136.254-.249.464-.273.667a16.97 16.97 0 01-.062.635C.907 7.619.79 8.679 1.12 9.06l-.04.406.052.11c.036.079.071.157.12.23l-.093.008c.22.692.338.704.473.717.137.013.291.028.585.757-.084-.028-.17-.06-.293-.226-.015.127.18.508.41.806l-.097.112a.89.89 0 00.27.311c.023.019.045.036.066.055-.372-.203.1.428.371.79.078.104.14.186.159.218l.073-.132c-.01.19.136.433.41.772l.229-.009c.094.186.438.522.647.538l-.139.181c.254.08.321.135.397.195.08.064.17.136.502.253l-.13-.23c.108.095.192.186.273.272.162.176.31.335.62.481.352.123.536.152.74.184.168.026.35.055.649.14a33.82 33.82 0 00-.217-.005c-.506-.012-1.056-.025-1.443-.163-3.016-.817-5.776-4.356-5.574-8-.02-.311-.01-.655 0-.961.012-.422.022-.776-.049-.882l.032-.105c.166-.54.365-1.191.742-1.957L.861 3.92v-.002.001c.012.012.106.107.275-.18.04-.09.079-.182.117-.276.08-.19.16-.383.264-.56l.08-.02c.054-.315.533-.744.93-1.1.19-.171.362-.326.46-.443l.02.138C3.541.977 4.414.611 5.074.334c.152-.063.291-.122.414-.176-.107.118.067.082.311.032.15-.03.325-.067.478-.076-.04.023-.082.044-.122.065-.085.045-.17.088-.25.145.26-.062.373-.044.499-.024.109.018.227.036.456.006-.174.025-.384.094-.35.12.245.029.398-.002.537-.03.174-.034.327-.065.61.03L7.625.275c.235.085.409.137.564.183.313.094.55.165 1.067.439a.58.58 0 00.23-.037c.112-.035.218-.069.477.037.014.025.022.046.03.066.03.08.054.143.456.383.056-.022-.097-.162-.22-.274l-.003-.004c1.01.54 2.108 1.692 2.443 2.924-.188-.347-.162-.171-.134.015.018.124.037.253-.006.235.14.377.255.766.325 1.168l-.023-.085c-.102-.368-.3-1.081-.626-1.555-.012.137-.092.122-.165.108-.105-.019-.196-.036-.058.393.081.119.096.074.109.034.015-.047.027-.086.147.164.002.133.034.266.07.414.022.094.046.195.065.306-.034-.006-.07-.07-.106-.13-.045-.076-.087-.147-.117-.101.076.358.201.545.25.572-.009.02-.021.02-.034.021-.027.002-.056.003-.059.167.022.428.102.39.166.361.02-.009.037-.017.051-.01a1.724 1.724 0 01-.083.245c-.086.221-.188.48-.106.816a2.356 2.356 0 00-.106-.295 5.896 5.896 0 01-.046-.117c-.018.151-.01.256-.003.355.013.166.023.312-.094.62.135-.442.12-.841-.007-.649.03.343-.12.642-.254.908-.111.222-.211.42-.184.602l-.161-.222c-.238.344-.22.417-.202.489.015.06.03.12-.105.339.051-.09.041-.112.031-.133-.01-.024-.021-.046.053-.158-.05.003-.17.12-.316.265-.123.121-.265.261-.402.368-1.172.94-2.571 1.062-3.926.556.006-.031-.006-.066-.097-.128-1.148-.88-1.827-1.628-1.591-3.36.068-.051.117-.193.175-.362.09-.263.203-.59.448-.745.245-.541.979-1.04 1.764-1.052.8-.044 1.476.427 1.816.872-.618-.576-1.63-.751-2.493-.324-.882.396-1.405 1.368-1.329 2.336.01-.016.021-.023.03-.03.02-.015.037-.027.048-.108-.027 1.88 2.026 3.258 3.504 2.563l.018.039c.397-.109.497-.205.633-.335.07-.067.148-.142.28-.233a.441.441 0 01-.075.085c-.068.067-.143.14-.05.142.166-.043.634-.465.947-.746l.133-.119c.062-.134.051-.177.04-.221-.012-.052-.025-.104.076-.3l.229-.114c.03-.088.062-.168.092-.243zM6.612 10.06a.018.018 0 00-.005.016.114.114 0 00.005-.016zm-.005.016c.008.069.269.268.465.369.516.19 1.1.198 1.559.181-.993.415-2.889-.422-3.509-1.532.057.012.168.14.303.297.204.234.462.532.678.605-.213-.17-.377-.387-.53-.61.288.33.637.6 1.019.779a.102.102 0 01.01-.077l.005-.012zM6.752.219a6.612 6.612 0 01-.075-.013c.472.014.437.045.283.08.018-.029-.09-.047-.208-.067zM9.63 6.732c.032-.477-.094-.326-.136-.144.019.01.036.059.052.107.028.08.054.158.084.037zm-.211.664a1.68 1.68 0 01-.314.703c.006-.061-.038-.074-.083-.086-.092-.026-.183-.052.176-.504a1.113 1.113 0 01-.126.242c-.112.184-.21.344.126.133l.033-.06a1.43 1.43 0 00.188-.428zm-1.34 1.247c-.347-.053-.662-.186-.397-.19.221.02.44.02.656-.033a3.544 3.544 0 01-.26.223zM6.958.285l-.1.02.094-.008.006-.012zM4.79 8.818l-.038.186c.047.064.092.13.136.195.12.175.237.348.4.483a4.73 4.73 0 00-.214-.368c-.08-.13-.169-.272-.285-.496zm.226-.319c.052.108.104.213.185.302l.082.24-.038-.063c-.1-.166-.2-.333-.252-.524l.023.045zm7.474-1.282l-.039.098a4.717 4.717 0 01-.462 1.474c.261-.49.43-1.028.501-1.572zM.436 3.426zm.002.022c.008.037.043.028.075.02.06-.015.114-.03-.004.236-.074.052-.119.087-.144.106l-.027.02a.05.05 0 01.008-.017.597.597 0 00.092-.365zM.118 4.76a2.92 2.92 0 01-.106.436.588.588 0 00-.005-.154c-.013-.105-.025-.197.135-.402a4.009 4.009 0 00-.023.12z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTerminalLinux = function VsTerminalLinux(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.281 11.156a.84.84 0 01.375.297c.084.125.143.276.18.453.02.104.044.2.07.29a1.772 1.772 0 00.219.476c.047.073.11.153.188.242.067.073.127.167.18.281a.793.793 0 01.077.328.49.49 0 01-.093.305.944.944 0 01-.235.219c-.12.083-.245.156-.375.219-.13.062-.26.127-.39.195a3.624 3.624 0 00-.555.328c-.156.115-.313.26-.469.438a2.815 2.815 0 01-.625.523 1.471 1.471 0 01-.383.172c-.13.036-.26.06-.39.07-.302 0-.552-.052-.75-.156-.198-.104-.37-.294-.516-.57-.042-.079-.083-.128-.125-.149a.774.774 0 00-.203-.055L8.67 15c-.26-.02-.525-.031-.796-.031a4.28 4.28 0 00-.672.054c-.229.037-.456.081-.68.133-.046.01-.093.05-.14.117a1.7 1.7 0 01-.196.227 1.106 1.106 0 01-.335.219 1.475 1.475 0 01-.555.101c-.172 0-.357-.018-.555-.054a1.82 1.82 0 01-.531-.18 3.578 3.578 0 00-.953-.328c-.313-.057-.643-.11-.992-.156a3.392 3.392 0 01-.344-.063.774.774 0 01-.29-.133.705.705 0 01-.194-.219.78.78 0 01-.079-.351c0-.162.021-.318.063-.469.042-.15.065-.31.07-.476 0-.115-.008-.227-.023-.336a3.53 3.53 0 01-.032-.352c0-.265.063-.46.188-.586.125-.125.307-.224.547-.297a.99.99 0 00.297-.148 2.27 2.27 0 00.234-.203 1.86 1.86 0 00.203-.242c.063-.089.133-.178.211-.266a.114.114 0 00.024-.07c0-.063-.003-.123-.008-.18l-.016-.188c0-.354.055-.71.164-1.07.11-.36.253-.71.43-1.055a9.08 9.08 0 01.594-.992c.218-.317.435-.612.648-.883a4.35 4.35 0 00.68-1.203c.15-.416.229-.87.234-1.36 0-.207-.01-.413-.031-.616a6.122 6.122 0 01-.031-.625c0-.417.047-.792.14-1.125.094-.334.24-.62.438-.86s.456-.419.773-.539C7.474.075 7.854.01 8.296 0c.527 0 .946.104 1.259.313.312.208.552.481.718.82.167.338.274.716.32 1.133.048.416.074.838.079 1.265v.133c0 .214.002.404.008.57a2.527 2.527 0 00.226.977c.073.161.182.336.328.523.25.329.506.66.766.993.26.333.497.677.71 1.03.214.355.389.725.524 1.11.136.386.206.802.211 1.25a3.3 3.3 0 01-.164 1.04zm-6.554-8.14c.072 0 .132.018.18.054a.357.357 0 01.109.149.85.85 0 01.054.187c.01.063.016.128.016.196a.282.282 0 01-.024.125.27.27 0 01-.07.086l-.094.078a.796.796 0 00-.093.093.428.428 0 01-.149.141 2.129 2.129 0 00-.18.117 1.31 1.31 0 00-.156.133.264.264 0 00-.07.195c0 .047.023.086.07.117a.704.704 0 01.266.305c.052.12.11.237.172.352.062.114.143.21.242.289.099.078.253.117.46.117h.048c.208-.01.406-.065.594-.164.187-.099.375-.203.562-.313a.633.633 0 01.102-.046.37.37 0 00.101-.055l.57-.445a.926.926 0 00.024-.102 2.75 2.75 0 00.016-.11.236.236 0 00-.04-.14.4.4 0 00-.093-.094.34.34 0 00-.133-.054.909.909 0 01-.14-.04 1.083 1.083 0 01-.352-.14 1.457 1.457 0 00-.344-.156c-.02-.006-.036-.021-.047-.047a.983.983 0 01-.031-.094.23.23 0 01-.008-.102.126.126 0 00-.008-.078c0-.062.005-.127.016-.195a.551.551 0 01.07-.195.417.417 0 01.125-.14.411.411 0 01.203-.056c.162 0 .279.06.352.18.073.12.112.25.117.39a.397.397 0 01-.039.18.379.379 0 00-.04.172c0 .042.014.07.04.086a.26.26 0 00.102.031c.12 0 .197-.028.234-.085a.533.533 0 00.062-.258c0-.12-.01-.253-.03-.399a1.32 1.32 0 00-.126-.406.969.969 0 00-.242-.313.574.574 0 00-.383-.124c-.27 0-.466.067-.586.203-.12.135-.182.338-.187.609 0 .078.005.156.015.234.01.079.016.157.016.235 0 .026-.003.039-.008.039a.218.218 0 01-.047-.016 4.263 4.263 0 01-.093-.039.774.774 0 00-.118-.039.514.514 0 00-.203-.008 1.007 1.007 0 01-.125.008c-.073 0-.11-.013-.11-.039 0-.078-.004-.177-.015-.297-.01-.12-.036-.24-.078-.36a.995.995 0 00-.156-.296c-.063-.078-.156-.12-.281-.125a.323.323 0 00-.227.086.905.905 0 00-.164.203.64.64 0 00-.086.266 5.4 5.4 0 01-.031.25 1.459 1.459 0 00.07.406c.026.083.055.156.086.219.031.062.068.093.11.093.025 0 .06-.018.101-.054.042-.037.063-.07.063-.102 0-.016-.008-.026-.024-.031a.147.147 0 00-.047-.008c-.036 0-.068-.018-.094-.055a.468.468 0 01-.062-.125 5.144 5.144 0 01-.047-.148.564.564 0 01.055-.398c.047-.084.133-.128.258-.133zM5.023 15.18c.125 0 .248-.01.368-.032a.97.97 0 00.336-.125.614.614 0 00.234-.242.943.943 0 00.094-.375.816.816 0 00-.047-.273.963.963 0 00-.133-.25 2.763 2.763 0 00-.203-.281 2.763 2.763 0 01-.203-.282 62.93 62.93 0 01-.29-.43c-.093-.14-.187-.288-.28-.445a8.124 8.124 0 01-.235-.406 2.646 2.646 0 00-.266-.398 1.203 1.203 0 00-.218-.211.469.469 0 00-.29-.094.436.436 0 00-.296.11 2.26 2.26 0 00-.258.265 3.241 3.241 0 01-.297.305c-.11.099-.25.177-.422.234a.744.744 0 00-.312.172c-.073.073-.11.185-.11.336 0 .104.008.208.024.312.015.104.026.209.031.313 0 .14-.02.273-.063.398a1.157 1.157 0 00-.062.367c0 .141.05.24.148.297.1.058.211.097.336.117.157.027.305.047.446.063.14.016.278.04.414.07.135.032.27.065.406.102.135.036.279.094.43.172.03.015.078.034.14.054l.211.07c.078.027.151.048.219.063a.741.741 0 00.148.024zm2.86-.938c.146 0 .302-.015.469-.047a3.54 3.54 0 00.976-.336 2.59 2.59 0 00.406-.257.222.222 0 00.032-.047.305.305 0 00.023-.063v-.008c.031-.114.057-.24.078-.375a8.63 8.63 0 00.055-.414 8.98 8.98 0 01.055-.414c.02-.135.039-.268.054-.398.021-.14.047-.276.078-.406.032-.13.073-.253.125-.368a1.03 1.03 0 01.211-.304 1.54 1.54 0 01.344-.25v-.016l-.008-.023a.29.29 0 01.047-.149 1.4 1.4 0 01.117-.164.582.582 0 01.149-.133.946.946 0 01.164-.078 9.837 9.837 0 00-.102-.375 4.938 4.938 0 01-.094-.375 7.126 7.126 0 00-.093-.476 2.954 2.954 0 00-.11-.36 1.317 1.317 0 00-.18-.32c-.077-.104-.174-.23-.288-.375a1.189 1.189 0 01-.118-.156.555.555 0 01-.046-.196 2.206 2.206 0 00-.047-.203 9.48 9.48 0 00-.242-.75 2.91 2.91 0 00-.172-.383 3.87 3.87 0 00-.172-.289c-.052-.078-.107-.117-.164-.117-.125 0-.274.05-.446.149-.171.099-.354.208-.546.328-.193.12-.38.232-.563.336-.182.104-.346.153-.492.148a.7.7 0 01-.43-.148 2.236 2.236 0 01-.36-.344c-.109-.13-.2-.242-.273-.336-.073-.094-.127-.146-.164-.156-.041 0-.065.031-.07.093a2.56 2.56 0 00-.008.211v.133c0 .032-.005.052-.016.063-.057.12-.12.237-.187.351-.068.115-.135.232-.203.352a1.611 1.611 0 00-.219.758c0 .078.005.156.016.234.01.078.036.154.078.227l-.016.03a1.31 1.31 0 01-.133.157 1.072 1.072 0 00-.132.164 2.796 2.796 0 00-.407.93c-.078.333-.12.672-.125 1.015 0 .089.006.178.016.266.01.089.016.177.016.266a.526.526 0 01-.008.086.525.525 0 00-.008.086.75.75 0 01.313.109c.12.068.25.154.39.258.14.104.274.224.399.36.125.135.244.267.359.398.115.13.198.26.25.39.052.13.086.237.101.32a.444.444 0 01-.125.329.955.955 0 01-.312.203c.089.156.198.289.328.398.13.11.271.198.422.266.151.068.315.117.492.148.177.032.35.047.516.047zm3.133 1.11c.109 0 .216-.016.32-.047a1.65 1.65 0 00.445-.203c.136-.089.26-.198.375-.329a3.07 3.07 0 01.977-.75l.258-.117a2.18 2.18 0 00.257-.133.962.962 0 00.165-.132.256.256 0 00.078-.188.295.295 0 00-.024-.117.58.58 0 00-.07-.117 5.136 5.136 0 01-.203-.305 1.978 1.978 0 01-.149-.297l-.125-.312a2.558 2.558 0 01-.11-.352.28.28 0 00-.054-.101.53.53 0 00-.46-.235.533.533 0 00-.266.07l-.266.149a7.335 7.335 0 01-.281.148.656.656 0 01-.297.07.411.411 0 01-.258-.077.636.636 0 01-.172-.211 2.218 2.218 0 01-.117-.258l-.094-.258a1.26 1.26 0 01-.14.188.666.666 0 00-.125.203c-.068.156-.11.33-.125.523-.026.302-.06.596-.102.883a4.7 4.7 0 01-.21.86 1.914 1.914 0 00-.063.273 2.88 2.88 0 00-.032.289c0 .255.079.466.235.633.156.166.367.25.633.25z"/>'
	      }, props)
	  };
	  vs.VsTerminalPowershell = function VsTerminalPowershell(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.5 1.007l12.999.17.43.501-1.82 12.872-.57.489-13-.17-.43-.502L1.93 1.495l.57-.488zM1.18 13.885l11.998.157 1.68-11.882L2.86 2.003 1.18 13.885zm5.791-3.49l-.14.991 5 .066.14-.99-5-.066zm1.71-2.457l-3.663-2.93-.692.796 2.636 2.112L3.739 9.95l.465.812L8.68 7.938z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTerminalTmux = function VsTerminalTmux(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M13.5 1h-12l-.5.5v13l.5.5h12l.5-.5v-13l-.5-.5zM7 7.5V13H2V2h5v5.5zm6 5.5H8V8h5v5zm0-6H8V2h5v5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTerminalUbuntu = function VsTerminalUbuntu(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3.26 8A1.37 1.37 0 11.52 8a1.37 1.37 0 012.74 0zm7.79 6.66a1.37 1.37 0 102.374-1.37 1.37 1.37 0 00-2.374 1.37zm2.37-11.95a1.37 1.37 0 10-2.37-1.373 1.37 1.37 0 002.37 1.373zM8.79 4.1a3.9 3.9 0 013.89 3.55h2a5.93 5.93 0 00-1.73-3.8 1.91 1.91 0 01-1.66-.12 2.001 2.001 0 01-.94-1.38 6 6 0 00-1.54-.2 5.83 5.83 0 00-2.61.61l1 1.73a3.94 3.94 0 011.59-.39zM4.88 8a3.93 3.93 0 011.66-3.2l-1-1.7A5.93 5.93 0 003.1 6.5a1.92 1.92 0 010 3 5.93 5.93 0 002.42 3.4l1-1.7A3.93 3.93 0 014.88 8zm3.91 3.91a4 4 0 01-1.65-.37l-1 1.73c.81.403 1.704.612 2.61.61.52 0 1.038-.067 1.54-.2a2 2 0 01.94-1.38 1.911 1.911 0 011.66-.12 5.93 5.93 0 001.73-3.8h-2a3.91 3.91 0 01-3.83 3.53z"/>'
	      }, props)
	  };
	  vs.VsTerminal = function VsTerminal(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 24 24"},
	        c: '<path fill-rule="evenodd" d="M3 1.5L1.5 3v18L3 22.5h18l1.5-1.5V3L21 1.5H3zM3 21V3h18v18H3zm5.656-4.01l1.038 1.061 5.26-5.243v-.912l-5.26-5.26-1.035 1.06 4.59 4.702-4.593 4.592z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTextSize = function VsTextSize(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M3.36 7L1 13h1.34l.51-1.47h2.26L5.64 13H7L4.65 7H3.36zm-.15 3.53l.78-2.14.78 2.14H3.21zM11.82 4h-1.6L7 13h1.56l.75-2.29h3.36l.77 2.29H15l-3.18-9zM9.67 9.5l1.18-3.59c.059-.185.1-.376.12-.57.027.192.064.382.11.57l1.25 3.59H9.67z"/>'
	      }, props)
	  };
	  vs.VsThreeBars = function VsThreeBars(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsThumbsdown = function VsThumbsdown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5.46 14.11a1.46 1.46 0 01-.81-.25 1.38 1.38 0 01-.45-1.69L5.17 10H2.38a1.36 1.36 0 01-1.16-.61 1.35 1.35 0 01-.09-1.32C1.8 6.62 3 4 3.4 2.9A1.38 1.38 0 014.69 2h8.93A1.4 1.4 0 0115 3.4v3.51a1.38 1.38 0 01-1.38 1.38h-1.38L6.4 13.75a1.41 1.41 0 01-.94.36zM4.69 3a.39.39 0 00-.36.25C3.93 4.34 2.86 6.7 2 8.49a.39.39 0 000 .36.37.37 0 00.38.15h3.3l.52.68v.46l-1.09 2.44a.37.37 0 00.13.46.38.38 0 00.48 0l6.06-5.59.47-.13h1.37a.38.38 0 00.38-.41V3.4a.4.4 0 00-.38-.4H4.69z"/>'
	      }, props)
	  };
	  vs.VsThumbsup = function VsThumbsup(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10.54 2c.289.001.57.088.81.25a1.38 1.38 0 01.45 1.69l-.97 2.17h2.79a1.36 1.36 0 011.16.61 1.35 1.35 0 01.09 1.32c-.67 1.45-1.87 4.07-2.27 5.17a1.38 1.38 0 01-1.29.9H2.38A1.4 1.4 0 011 12.71V9.2a1.38 1.38 0 011.38-1.38h1.38L9.6 2.36a1.41 1.41 0 01.94-.36zm.77 11.11a.39.39 0 00.36-.25c.4-1.09 1.47-3.45 2.33-5.24a.39.39 0 000-.36.37.37 0 00-.38-.15h-3.3l-.52-.68v-.46l1.09-2.44a.37.37 0 00-.13-.46.38.38 0 00-.48 0L4.22 8.66l-.47.13H2.38A.38.38 0 002 9.2v3.51a.4.4 0 00.38.4h8.93z"/>'
	      }, props)
	  };
	  vs.VsTools = function VsTools(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.773 3.485l-.78-.184-2.108 2.096-1.194-1.216 2.056-2.157-.18-.792a4.42 4.42 0 00-1.347-.228 3.64 3.64 0 00-1.457.28 3.824 3.824 0 00-1.186.84 3.736 3.736 0 00-.875 1.265 3.938 3.938 0 000 2.966 335.341 335.341 0 00-6.173 6.234c-.21.275-.31.618-.284.963a1.403 1.403 0 00.464.967c.124.135.272.247.437.328.17.075.353.118.538.127.316-.006.619-.126.854-.337 1.548-1.457 4.514-4.45 6.199-6.204.457.194.948.294 1.444.293a3.736 3.736 0 002.677-1.133 3.885 3.885 0 001.111-2.73 4.211 4.211 0 00-.196-1.378zM2.933 13.928a.31.31 0 01-.135.07.437.437 0 01-.149 0 .346.346 0 01-.144-.057.336.336 0 01-.114-.11c-.14-.143-.271-.415-.14-.568 1.37-1.457 4.191-4.305 5.955-6.046.1.132.21.258.328.376.118.123.245.237.38.341-1.706 1.75-4.488 4.564-5.98 5.994zm11.118-9.065c.002.765-.296 1.5-.832 2.048a2.861 2.861 0 01-4.007 0 2.992 2.992 0 01-.635-3.137A2.748 2.748 0 0110.14 2.18a2.76 2.76 0 011.072-.214h.254L9.649 3.839v.696l1.895 1.886h.66l1.847-1.816v.258zM3.24 6.688h1.531l.705.717.678-.674-.665-.678V6.01l.057-1.649-.22-.437-2.86-1.882-.591.066-.831.849-.066.599 1.838 2.918.424.215zm-.945-3.632L4.609 4.58 4.57 5.703H3.494L2.002 3.341l.293-.285zm7.105 6.96l.674-.673 3.106 3.185a1.479 1.479 0 010 2.039 1.404 1.404 0 01-1.549.315 1.31 1.31 0 01-.437-.315l-3.142-3.203.679-.678 3.132 3.194a.402.402 0 00.153.105.477.477 0 00.359 0 .403.403 0 00.153-.105.436.436 0 00.1-.153.525.525 0 00.036-.184.547.547 0 00-.035-.184.436.436 0 00-.1-.153L9.4 10.016z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTrash = function VsTrash(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 011-1h3a1 1 0 011 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsTriangleDown = function VsTriangleDown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M2 5.56L2.413 5h11.194l.393.54L8.373 11h-.827L2 5.56z"/>'
	      }, props)
	  };
	  vs.VsTriangleLeft = function VsTriangleLeft(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M10.44 2l.56.413v11.194l-.54.393L5 8.373v-.827L10.44 2z"/>'
	      }, props)
	  };
	  vs.VsTriangleRight = function VsTriangleRight(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5.56 14L5 13.587V2.393L5.54 2 11 7.627v.827L5.56 14z"/>'
	      }, props)
	  };
	  vs.VsTriangleUp = function VsTriangleUp(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14 10.44l-.413.56H2.393L2 10.46 7.627 5h.827L14 10.44z"/>'
	      }, props)
	  };
	  vs.VsTwitter = function VsTwitter(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M15 3.784a5.63 5.63 0 01-.65.803 6.058 6.058 0 01-.786.68 5.442 5.442 0 01.014.377c0 .574-.061 1.141-.184 1.702a8.467 8.467 0 01-.534 1.627 8.444 8.444 0 01-1.264 2.04 7.768 7.768 0 01-1.72 1.521 7.835 7.835 0 01-2.095.95 8.524 8.524 0 01-2.379.329 8.178 8.178 0 01-2.293-.325A7.921 7.921 0 011 12.52a5.762 5.762 0 004.252-1.19 2.842 2.842 0 01-2.273-1.19 2.878 2.878 0 01-.407-.8c.091.014.181.026.27.035a2.797 2.797 0 001.022-.089 2.808 2.808 0 01-.926-.362 2.942 2.942 0 01-.728-.633 2.839 2.839 0 01-.65-1.822v-.033c.402.227.837.348 1.306.362a2.943 2.943 0 01-.936-1.04 2.955 2.955 0 01-.253-.649 2.945 2.945 0 01.007-1.453c.063-.243.161-.474.294-.693.364.451.77.856 1.216 1.213a8.215 8.215 0 003.008 1.525 7.965 7.965 0 001.695.263 2.15 2.15 0 01-.058-.325 3.265 3.265 0 01-.017-.331c0-.397.075-.77.226-1.118a2.892 2.892 0 011.528-1.528 2.79 2.79 0 011.117-.225 2.846 2.846 0 012.099.909 5.7 5.7 0 001.818-.698 2.815 2.815 0 01-1.258 1.586A5.704 5.704 0 0015 3.785z"/>'
	      }, props)
	  };
	  vs.VsTypeHierarchySub = function VsTypeHierarchySub(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.5 11h-1.729L8.438 6H9.5l.5-.5v-4L9.5 1h-4l-.5.5v4l.5.5h1.062l-3.333 5H1.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5h-.068L7.5 6.4l3.068 4.6H10.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zM6 5V2h3v3H6zm-2 7v2H2v-2h2zm9 2h-2v-2h2v2z"/>'
	      }, props)
	  };
	  vs.VsTypeHierarchySuper = function VsTypeHierarchySuper(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.5 1h-3l-.5.5v3l.5.5h.068L7.5 9.6 4.432 5H4.5l.5-.5v-3L4.5 1h-3l-.5.5v3l.5.5h1.729l3.333 5H5.5l-.5.5v4l.5.5h4l.5-.5v-4l-.5-.5H8.438l3.333-5H13.5l.5-.5v-3l-.5-.5zM2 4V2h2v2H2zm7 7v3H6v-3h3zm4-7h-2V2h2v2z"/>'
	      }, props)
	  };
	  vs.VsTypeHierarchy = function VsTypeHierarchy(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M13.5 12h-1.793L10 10.293V6.5L9.5 6H8V4h.5l.5-.5v-2L8.5 1h-2l-.5.5v2l.5.5H7v2H5.5l-.5.5v3.793L3.293 12H1.5l-.5.5v2l.5.5h2l.5-.5v-1.793L5.707 11h3.586L11 12.707V14.5l.5.5h2l.5-.5v-2l-.5-.5zM7 2h1v1H7V2zM6 7h3v3H6V7zm-3 7H2v-1h1v1zm10 0h-1v-1h1v1z"/>'
	      }, props)
	  };
	  vs.VsUnfold = function VsUnfold(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.53 6.51v-4l-1 1-.71-.71L7.65 1h.71l1.84 1.83-.71.7-1-1v3.98h-.96zm0 2.98v4l-1-1-.71.71L7.65 15h.71l1.84-1.83-.71-.7-1 1V9.49h-.96zM13.73 4L14 5.02l-3.68 2.93L14 10.98 13.73 12h-4.2v-1h3L9.55 8.57H6.54L3.45 11h3.08v1H2.27L2 10.98l3.68-2.92L2 5.02 2.27 4h4.26v1H3.45l3 2.42h3.01L12.53 5h-3V4h4.2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsUngroupByRefType = function VsUngroupByRefType(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M2.9 1L5 3.1l-.8.7L3 2.6V7H2V2.5L.8 3.8l-.7-.7L2.2 1h.7zM3 13.4V9H2v4.4L.8 12.2l-.7.7L2.2 15h.7L5 12.9l-.7-.7L3 13.4zM8.5 7h-2L6 6.5v-2l.5-.5h2l.5.5v2l-.5.5zM7 6h1V5H7v1zm7.5 1h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM12 6h2V4h-2v2zm-3.5 6h-2l-.5-.5v-2l.5-.5h2l.5.5v2l-.5.5zM7 11h1v-1H7v1zm7.5 2h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM12 12h2v-2h-2v2zm-1-2H9v1h2v-1zm0-5H9v1h2V5z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsUnlock = function VsUnlock(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M5 7V5a3 3 0 015.83-1h1.044A4.002 4.002 0 004 5v2H3L2 8v6l1 1h10l1-1V8l-1-1H5zm6 1h2v6H3V8h8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsUnmute = function VsUnmute(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 4.83h2.79L8.15 1l.85.35v13l-.85.33-3.86-3.85H1.5l-.5-.5v-5l.5-.5zM4.85 10L8 13.14V2.56L4.85 5.68l-.35.15H2v4h2.5l.35.17zM15 7.83a6.97 6.97 0 01-1.578 4.428l-.712-.71A5.975 5.975 0 0014 7.83c0-1.4-.48-2.689-1.284-3.71l.712-.71A6.971 6.971 0 0115 7.83zm-2 0a4.978 4.978 0 01-1.002 3.004l-.716-.716A3.982 3.982 0 0012 7.83a3.98 3.98 0 00-.713-2.28l.716-.716c.626.835.997 1.872.997 2.996zm-2 0c0 .574-.16 1.11-.44 1.566l-.739-.738a1.993 1.993 0 00.005-1.647l.739-.739c.276.454.435.988.435 1.558z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsUnverified = function VsUnverified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.67 14.72h.71L10.1 13h2.4l.5-.5v-2.42l1.74-1.72v-.71l-1.71-1.72V3.49l-.5-.49H10.1L8.38 1.29h-.71L6 3H3.53L3 3.5v2.43L1.31 7.65v.71L3 10.08v2.42l.53.5H6l1.67 1.72zM6.16 12H4V9.87l-.12-.35L2.37 8l1.48-1.51.15-.35V4h2.16l.36-.14L8 2.35l1.54 1.51.35.14H12v2.14l.17.35L13.69 8l-1.55 1.52-.14.35V12H9.89l-.38.15L8 13.66l-1.48-1.52-.36-.14zm1.443-5.859a.962.962 0 00-.128.291c-.03.109-.05.215-.062.317l-.005.043h-.895l.003-.051c.018-.326.089-.615.212-.864.052-.108.117-.214.193-.318.081-.106.18-.2.294-.28.119-.084.255-.15.409-.2A1.71 1.71 0 018.165 5c.28 0 .523.046.726.14.2.089.366.21.494.363.127.152.22.326.279.52.058.194.087.394.087.599 0 .191-.032.371-.098.54-.064.164-.143.32-.238.466-.094.143-.197.28-.31.41-.11.129-.211.252-.304.372a2.47 2.47 0 00-.23.34.653.653 0 00-.088.318v.48h-.888v-.539c0-.168.031-.323.094-.464a2.15 2.15 0 01.24-.401c.096-.127.2-.25.308-.368a4.74 4.74 0 00.299-.356c.093-.12.17-.246.228-.377a.984.984 0 00.09-.421 1.04 1.04 0 00-.047-.318v-.001a.638.638 0 00-.13-.243.558.558 0 00-.216-.158H8.46a.689.689 0 00-.294-.059.643.643 0 00-.339.083.742.742 0 00-.223.215zM8.5 11h-.888v-.888H8.5V11z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsVariableGroup = function VsVariableGroup(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M5.387 11.523a.402.402 0 01.593-.367c.058.031.11.065.157.102.047.036.088.07.125.101a.177.177 0 00.117.047c.052 0 .12-.04.203-.117.083-.078.175-.182.273-.313.1-.13.201-.268.305-.414.104-.146.2-.294.29-.445l.226-.39c.062-.11.107-.199.133-.266a15.33 15.33 0 00-.133-.524 15.384 15.384 0 01-.133-.523 3.72 3.72 0 00-.133-.422 1.04 1.04 0 00-.187-.313.656.656 0 00-.266-.187 1.374 1.374 0 00-.375-.07 1.628 1.628 0 00-.328.031v-.195L7.69 7a2.345 2.345 0 01.461.734c.052.13.097.263.133.399.037.135.076.283.117.445.078-.115.175-.26.29-.438a4.49 4.49 0 01.398-.523c.15-.172.31-.315.476-.43A1.02 1.02 0 0110.089 7c.13 0 .247.034.351.101.105.068.157.175.157.32 0 .282-.141.423-.422.423a.608.608 0 01-.29-.07.608.608 0 00-.288-.071c-.1 0-.203.05-.313.148a2.3 2.3 0 00-.312.352 9.5 9.5 0 00-.485.734l.446 1.852a1.56 1.56 0 00.093.344.669.669 0 00.094.171.184.184 0 00.125.079.37.37 0 00.211-.086 2.14 2.14 0 00.43-.47c.052-.077.093-.15.125-.218l.187.094a2.025 2.025 0 01-.219.367 3.775 3.775 0 01-.351.422 3.38 3.38 0 01-.406.36c-.141.104-.269.153-.383.148a.397.397 0 01-.281-.102 1.491 1.491 0 01-.204-.234 1.599 1.599 0 01-.132-.36 8.263 8.263 0 01-.118-.507 34.16 34.16 0 01-.101-.532 2.212 2.212 0 00-.11-.414l-.203.375a4.489 4.489 0 01-.28.453c-.11.157-.222.316-.337.477a2.46 2.46 0 01-.375.422c-.135.12-.265.221-.39.305A.66.66 0 015.91 12a.539.539 0 01-.36-.133.454.454 0 01-.163-.344zm6.11.477c.28-.36.496-.748.648-1.164a3.87 3.87 0 00.226-1.32c0-.47-.075-.912-.226-1.329A4.57 4.57 0 0011.495 7h.734a3.77 3.77 0 01.922 2.515c0 .474-.073.917-.218 1.329-.146.411-.38.796-.704 1.156h-.734zM3.77 12a3.373 3.373 0 01-.704-1.149 3.97 3.97 0 01-.218-1.336c0-.953.307-1.791.922-2.515h.726a4.132 4.132 0 00-.64 1.18 4.205 4.205 0 00-.227 1.335A3.929 3.929 0 004.496 12H3.77z"/><path d="M15.5 1H.5l-.5.5v13l.5.5h15l.5-.5v-13l-.5-.5zM15 14H1V5h14v9zm0-10H1V2h14v2z"/>'
	      }, props)
	  };
	  vs.VsVerifiedFilled = function VsVerifiedFilled(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.38 14.72h-.71L6 13H3.53L3 12.5v-2.42L1.31 8.36v-.71L3 5.93V3.5l.53-.5H6l1.67-1.71h.71L10.1 3h2.43l.5.49v2.44l1.71 1.72v.71L13 10.08v2.42l-.5.5h-2.4l-1.72 1.72zm-1.65-4.24h.71l3.77-3.77L10.5 6 7.09 9.42 5.71 8.04 5 8.75l1.73 1.73z"/>'
	      }, props)
	  };
	  vs.VsVerified = function VsVerified(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.67 14.72h.71L10.1 13h2.4l.5-.5v-2.42l1.74-1.72v-.71l-1.71-1.72V3.49l-.5-.49H10.1L8.38 1.29h-.71L6 3H3.53L3 3.5v2.43L1.31 7.65v.71L3 10.08v2.42l.53.5H6l1.67 1.72zM6.16 12H4V9.87l-.12-.35L2.37 8l1.48-1.51.15-.35V4h2.16l.36-.14L8 2.35l1.54 1.51.35.14H12v2.14l.17.35L13.69 8l-1.55 1.52-.14.35V12H9.89l-.38.15L8 13.66l-1.48-1.52-.36-.14zm.57-1.52h.71l3.77-3.77L10.5 6 7.09 9.42 5.71 8.04 5 8.75l1.73 1.73z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsVersions = function VsVersions(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M8 3L7 4v8l1 1h6l1-1V4l-1-1H8zm6 9H8V4h6v8zM5 9V5h1V4H4.5l-.5.5v7l.5.5H6v-1H5V9zM2 8V6h1V5H1.5l-.5.5v5l.5.5H3v-1H2V8z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsVmActive = function VsVmActive(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v5.503a5.006 5.006 0 00-1-.583V3H2v9h5a5 5 0 001 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.778 8.674a4 4 0 114.444 6.652 4 4 0 01-4.444-6.652zm2.13 4.99l2.387-3.182-.8-.6-2.077 2.769-1.301-1.041-.625.78 1.704 1.364.713-.09z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsVmConnect = function VsVmConnect(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v5.503a5.006 5.006 0 00-1-.583V3H2v9h5a5 5 0 001 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z" clip-rule="evenodd"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0 7a3 3 0 110-6.001A3 3 0 0112 15z"/><path fill-rule="evenodd" d="M12.133 11.435l1.436 1.436.431-.431-1.004-1.005L14 10.431l-.431-.43-1.436 1.434zm-1.129 1.067L10 11.498l.431-.431 1.436 1.435-1.436 1.436-.431-.431 1.004-1.005z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsVmOutline = function VsVmOutline(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v5.503a5.006 5.006 0 00-1-.583V3H2v9h5a5 5 0 001 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z" clip-rule="evenodd"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0 7a3 3 0 110-6.001A3 3 0 0112 15z"/>'
	      }, props)
	  };
	  vs.VsVmRunning = function VsVmRunning(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M1.5 2h13l.5.5v5.503a5.006 5.006 0 00-1-.583V3H2v9h5a5 5 0 001 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z" clip-rule="evenodd"/><path d="M12 8c.367 0 .721.047 1.063.14.34.094.658.23.953.407.294.177.563.385.808.625.245.24.455.509.63.808a4.03 4.03 0 01.405 3.082c-.093.342-.229.66-.406.954a4.382 4.382 0 01-.625.808c-.24.245-.509.455-.808.63a4.029 4.029 0 01-3.082.405 3.784 3.784 0 01-.954-.406 4.382 4.382 0 01-.808-.625 3.808 3.808 0 01-.63-.808 4.027 4.027 0 01-.405-3.082c.093-.342.229-.66.406-.954.177-.294.385-.563.625-.808.24-.245.509-.455.808-.63A4.028 4.028 0 0112 8zm2 3.988L11 10v4l3-2.012z"/>'
	      }, props)
	  };
	  vs.VsVm = function VsVm(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M14.5 2h-13l-.5.5v10l.5.5H7v1H4v1h8v-1H9v-1h5.5l.5-.5v-10l-.5-.5zM14 12H2V3h12v9z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWand = function VsWand(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M4.38 5h1V4h1V3h-1V2h-1v1h-1v1h1v1zm8 4h-1v1h-1v1h1v1h1v-1h1v-1h-1V9zM14 2V1h-1v1h-1v1h1v1h1V3h1V2h-1zm-2.947 2.442a1.49 1.49 0 00-2.12 0l-7.49 7.49a1.49 1.49 0 000 2.12c.59.59 1.54.59 2.12 0l7.49-7.49c.58-.58.58-1.53 0-2.12zm-8.2 8.9c-.2.2-.51.2-.71 0-.2-.2-.2-.51 0-.71l6.46-6.46.71.71-6.46 6.46zm7.49-7.49l-.32.32-.71-.71.32-.32c.2-.2.51-.2.71 0 .19.2.19.52 0 .71z"/>'
	      }, props)
	  };
	  vs.VsWarning = function VsWarning(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.7L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWatch = function VsWatch(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M7.5 9h2V8H8V5.5H7v3l.5.5z"/><path fill-rule="evenodd" d="M5.5 3.669A4.998 4.998 0 003 8a4.998 4.998 0 002.5 4.331V14.5l.5.5h4l.5-.5v-2.169A4.998 4.998 0 0013 8a4.998 4.998 0 00-2.5-4.331V1.5L10 1H6l-.5.5v2.169zM12 8a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWhitespace = function VsWhitespace(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M12 2V1H6.5a3.5 3.5 0 000 7H8v5H7v1h5v-1h-1V2h1zM8 7H6.5a2.5 2.5 0 110-5H8v5zm2 6H9V2h1v11z"/>'
	      }, props)
	  };
	  vs.VsWholeWord = function VsWholeWord(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M0 11h1v2h14v-2h1v3H0v-3z" clip-rule="evenodd"/><path d="M6.84 11h-.88v-.86h-.022c-.383.66-.947.989-1.692.989-.548 0-.977-.145-1.289-.435-.308-.29-.462-.675-.462-1.155 0-1.028.605-1.626 1.816-1.794l1.649-.23c0-.935-.378-1.403-1.134-1.403-.662 0-1.26.226-1.794.677v-.902c.541-.344 1.164-.516 1.87-.516 1.292 0 1.938.684 1.938 2.052V11zm-.88-2.782L4.633 8.4c-.408.058-.716.16-.924.307-.208.143-.311.399-.311.768 0 .268.095.488.284.66.194.168.45.253.768.253a1.41 1.41 0 001.08-.457c.286-.308.43-.696.43-1.165v-.548zM9.348 10.205h-.022V11h-.88V2.857h.88v3.61h.021c.434-.73 1.068-1.096 1.902-1.096.705 0 1.257.247 1.654.741.401.49.602 1.15.602 1.977 0 .92-.224 1.658-.672 2.213-.447.551-1.06.827-1.837.827-.726 0-1.276-.308-1.649-.924zm-.022-2.218v.768c0 .455.147.841.44 1.16.298.315.674.473 1.128.473.534 0 .951-.204 1.252-.613.304-.408.456-.975.456-1.702 0-.613-.141-1.092-.424-1.44-.283-.347-.666-.52-1.15-.52-.511 0-.923.178-1.235.536-.311.355-.467.8-.467 1.338z"/>'
	      }, props)
	  };
	  vs.VsWindow = function VsWindow(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M14.5 2h-13l-.5.5v11l.5.5h13l.5-.5v-11l-.5-.5zM14 13H2V6h12v7zm0-8H2V3h12v2z"/>'
	      }, props)
	  };
	  vs.VsWordWrap = function VsWordWrap(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M3.868 3.449a1.21 1.21 0 00-.473-.329c-.274-.111-.623-.15-1.055-.076a3.5 3.5 0 00-.71.208c-.082.035-.16.077-.235.125l-.043.03v1.056l.168-.139c.15-.124.326-.225.527-.303.196-.074.4-.113.604-.113.188 0 .33.051.431.157.087.095.137.248.147.456l-.962.144c-.219.03-.41.086-.57.166a1.245 1.245 0 00-.398.311c-.103.125-.181.27-.229.426-.097.33-.093.68.011 1.008a1.096 1.096 0 00.638.67c.155.063.328.093.528.093a1.25 1.25 0 00.978-.441v.345h1.007V4.65c0-.255-.03-.484-.089-.681a1.423 1.423 0 00-.275-.52zm-.636 1.896v.236c0 .119-.018.231-.055.341a.745.745 0 01-.377.447.694.694 0 01-.512.027.454.454 0 01-.156-.094.389.389 0 01-.094-.139.474.474 0 01-.035-.186c0-.077.01-.147.024-.212a.33.33 0 01.078-.141.436.436 0 01.161-.109 1.3 1.3 0 01.305-.073l.661-.097zm5.051-1.067a2.253 2.253 0 00-.244-.656 1.354 1.354 0 00-.436-.459 1.165 1.165 0 00-.642-.173 1.136 1.136 0 00-.69.223 1.33 1.33 0 00-.264.266V1H5.09v6.224h.918v-.281c.123.152.287.266.472.328.098.032.208.047.33.047.255 0 .483-.06.677-.177.192-.115.355-.278.486-.486a2.29 2.29 0 00.293-.718 3.87 3.87 0 00.096-.886 3.714 3.714 0 00-.078-.773zm-.86.758c0 .232-.02.439-.06.613-.036.172-.09.315-.159.424a.639.639 0 01-.233.237.582.582 0 01-.565.014.683.683 0 01-.21-.183.925.925 0 01-.142-.283A1.187 1.187 0 016 5.5v-.517c0-.164.02-.314.06-.447.036-.132.087-.242.156-.336a.668.668 0 01.228-.208.584.584 0 01.29-.071.554.554 0 01.496.279c.063.099.108.214.143.354.031.143.05.306.05.482zM2.407 9.9a.913.913 0 01.316-.239c.218-.1.547-.105.766-.018.104.042.204.1.32.184l.33.26V8.945l-.097-.062a1.932 1.932 0 00-.905-.215c-.308 0-.593.057-.846.168-.25.11-.467.27-.647.475-.18.21-.318.453-.403.717-.09.272-.137.57-.137.895 0 .289.043.561.13.808.086.249.211.471.373.652.161.185.361.333.597.441.232.104.493.155.778.155.233 0 .434-.028.613-.084.165-.05.322-.123.466-.217l.078-.061v-.889l-.2.095a.4.4 0 01-.076.026c-.05.017-.099.035-.128.049-.036.023-.227.09-.227.09-.06.024-.14.043-.218.059a.977.977 0 01-.599-.057.827.827 0 01-.306-.225 1.088 1.088 0 01-.205-.376 1.728 1.728 0 01-.076-.529c0-.21.028-.399.083-.56.054-.158.13-.294.22-.4zM14 6h-4V5h4.5l.5.5v6l-.5.5H7.879l2.07 2.071-.706.707-2.89-2.889v-.707l2.89-2.89L9.95 9l-2 2H14V6z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWorkspaceTrusted = function VsWorkspaceTrusted(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.069 0c.262 0 .52.017.76.057a4.1 4.1 0 01.697.154c.228.069.451.155.674.263.217.103.44.229.663.366.377.24.748.434 1.126.589a7.537 7.537 0 002.331.525c.406.029.823.046 1.257.046v4c0 .76-.097 1.48-.291 2.166a8.996 8.996 0 01-.789 1.943 10.312 10.312 0 01-1.188 1.725 15.091 15.091 0 01-1.492 1.532 17.57 17.57 0 01-1.703 1.325c-.594.412-1.194.795-1.794 1.143l-.24.143-.24-.143a27.093 27.093 0 01-1.806-1.143 15.58 15.58 0 01-1.703-1.325 15.082 15.082 0 01-1.491-1.532 10.947 10.947 0 01-1.194-1.725 9.753 9.753 0 01-.789-1.943A7.897 7.897 0 01.571 6V2c.435 0 .852-.017 1.258-.046a8.16 8.16 0 001.188-.171c.383-.086.766-.2 1.143-.354A6.563 6.563 0 005.28.846C5.72.56 6.166.349 6.606.21A4.79 4.79 0 018.069 0zm6.502 2.983a9.566 9.566 0 01-2.234-.377 7.96 7.96 0 01-2.046-.943A4.263 4.263 0 009.23 1.16 3.885 3.885 0 008.074.994a3.99 3.99 0 00-1.165.166 3.946 3.946 0 00-1.058.503A7.926 7.926 0 013.8 2.61c-.709.206-1.451.332-2.229.378v3.017c0 .663.086 1.297.258 1.908a8.58 8.58 0 00.72 1.743 9.604 9.604 0 001.08 1.572c.417.491.862.948 1.342 1.382.48.435.983.835 1.509 1.206.531.372 1.063.709 1.594 1.017a22.397 22.397 0 001.589-1.017 15.389 15.389 0 001.514-1.206c.48-.434.926-.891 1.343-1.382a9.596 9.596 0 001.08-1.572 8.258 8.258 0 00.709-1.743 6.814 6.814 0 00.262-1.908V2.983z"/><path fill-rule="evenodd" d="M11.797 4.709l-.44-.378-.406.035-4.36 5.148-1.485-2.12-.4-.068-.463.331-.069.4 1.909 2.726.217.12.457.028.234-.102 4.835-5.715-.029-.405z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWorkspaceUnknown = function VsWorkspaceUnknown(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.067 0c.263 0 .52.017.76.057a4.1 4.1 0 01.697.154c.229.069.452.155.675.263.217.103.44.229.662.366a7.2 7.2 0 001.126.589 7.534 7.534 0 002.332.525c.405.029.822.046 1.257.046v4c0 .76-.097 1.48-.292 2.166a8.996 8.996 0 01-.788 1.943 10.306 10.306 0 01-1.189 1.725 15.082 15.082 0 01-1.491 1.532 17.57 17.57 0 01-1.703 1.325c-.594.412-1.194.795-1.794 1.143l-.24.143-.24-.143a27.088 27.088 0 01-1.806-1.143 15.579 15.579 0 01-1.703-1.325 15.08 15.08 0 01-1.491-1.532 10.948 10.948 0 01-1.195-1.725 9.753 9.753 0 01-.788-1.943A7.897 7.897 0 01.57 6V2c.434 0 .851-.017 1.257-.046a8.16 8.16 0 001.189-.171c.383-.086.765-.2 1.143-.354a6.563 6.563 0 001.12-.583C5.719.56 6.164.349 6.604.21A4.79 4.79 0 018.067 0zm6.503 2.983a9.567 9.567 0 01-2.234-.377 7.96 7.96 0 01-2.046-.943 4.264 4.264 0 00-1.063-.503A3.885 3.885 0 008.073.994a3.99 3.99 0 00-1.166.166 3.946 3.946 0 00-1.057.503 7.927 7.927 0 01-2.051.948c-.709.206-1.452.332-2.229.378v3.017c0 .663.086 1.297.257 1.908a8.58 8.58 0 00.72 1.743 9.604 9.604 0 001.08 1.572c.417.491.863.948 1.343 1.382.48.435.983.835 1.509 1.206.531.372 1.062.709 1.594 1.017a22.4 22.4 0 001.588-1.017 15.384 15.384 0 001.515-1.206c.48-.434.925-.891 1.343-1.382a9.609 9.609 0 001.08-1.572 8.269 8.269 0 00.708-1.743 6.814 6.814 0 00.263-1.908V2.983z"/><path fill-rule="evenodd" d="M9.433 4.72c.171.171.314.377.411.606.103.228.155.48.149.754a1.6 1.6 0 01-.114.64 2.24 2.24 0 01-.292.48 2.787 2.787 0 01-.354.383 4.52 4.52 0 00-.337.32 1.421 1.421 0 00-.24.32.7.7 0 00-.086.348v.36l-.131.138h-.715l-.143-.143V8.57c0-.24.04-.45.12-.634.075-.177.166-.343.28-.486a3.42 3.42 0 01.366-.382c.12-.109.229-.212.332-.32.097-.103.182-.212.245-.326a.707.707 0 00.086-.354.966.966 0 00-.074-.36.972.972 0 00-.2-.298.94.94 0 00-1.32 0 .88.88 0 00-.2.298.829.829 0 00-.075.36L7 6.21h-.715l-.131-.137c0-.263.046-.514.148-.748.103-.229.24-.435.412-.606.177-.177.383-.32.611-.417a1.883 1.883 0 011.503 0c.229.103.434.24.606.417zM7.57 9.646l.143-.143h.714l.143.143v.714l-.143.143h-.714l-.143-.143v-.714z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsWorkspaceUntrusted = function VsWorkspaceUntrusted(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path d="M8.067 0c.263 0 .52.017.76.057a4.1 4.1 0 01.697.154c.229.069.452.155.675.263.217.103.44.229.662.366a7.2 7.2 0 001.126.589 7.534 7.534 0 002.332.525c.405.029.822.046 1.257.046v4c0 .76-.097 1.48-.292 2.166a8.996 8.996 0 01-.788 1.943 10.306 10.306 0 01-1.189 1.725 15.082 15.082 0 01-1.491 1.532 17.57 17.57 0 01-1.703 1.325c-.594.412-1.194.795-1.794 1.143l-.24.143-.24-.143a27.088 27.088 0 01-1.806-1.143 15.579 15.579 0 01-1.703-1.325 15.08 15.08 0 01-1.491-1.532 10.948 10.948 0 01-1.195-1.725 9.753 9.753 0 01-.788-1.943A7.897 7.897 0 01.57 6V2c.434 0 .851-.017 1.257-.046a8.16 8.16 0 001.189-.171c.383-.086.765-.2 1.143-.354a6.563 6.563 0 001.12-.583C5.719.56 6.164.349 6.604.21A4.79 4.79 0 018.067 0zm6.503 2.983a9.567 9.567 0 01-2.234-.377 7.96 7.96 0 01-2.046-.943 4.264 4.264 0 00-1.063-.503A3.885 3.885 0 008.073.994a3.99 3.99 0 00-1.166.166 3.946 3.946 0 00-1.057.503 7.927 7.927 0 01-2.051.948c-.709.206-1.452.332-2.229.378v3.017c0 .663.086 1.297.257 1.908a8.58 8.58 0 00.72 1.743 9.604 9.604 0 001.08 1.572c.417.491.863.948 1.343 1.382.48.435.983.835 1.509 1.206.531.372 1.062.709 1.594 1.017a22.4 22.4 0 001.588-1.017 15.384 15.384 0 001.515-1.206c.48-.434.925-.891 1.343-1.382a9.609 9.609 0 001.08-1.572 8.269 8.269 0 00.708-1.743 6.814 6.814 0 00.263-1.908V2.983z"/><path d="M10.787 5.446l-.4-.406h-.206L8.2 7.023 6.216 5.04h-.2l-.406.406v.2l1.983 1.983L5.61 9.61v.206l.406.4h.2l1.983-1.983 1.982 1.983h.206l.4-.4V9.61L8.804 7.63l1.983-1.983v-.2z"/>'
	      }, props)
	  };
	  vs.VsZoomIn = function VsZoomIn(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.027 6.149a5.52 5.52 0 01-1.27 3.908l4.26 4.26-.7.71-4.26-4.27a5.52 5.52 0 111.97-4.608zm-5.45 4.888a4.51 4.51 0 003.18-1.32l-.04.02a4.51 4.51 0 001.36-3.2 4.5 4.5 0 10-4.5 4.5zm2.44-4v-1h-2v-2h-1v2h-2v1h2v2h1v-2h2z" clip-rule="evenodd"/>'
	      }, props)
	  };
	  vs.VsZoomOut = function VsZoomOut(props) {
	      return IconTemplate({
	        a: {"fill":"currentColor","viewBox":"0 0 16 16"},
	        c: '<path fill-rule="evenodd" d="M12.027 6.149a5.52 5.52 0 01-1.27 3.908l4.26 4.26-.7.71-4.26-4.27a5.52 5.52 0 111.97-4.608zm-5.45 4.888a4.51 4.51 0 003.18-1.32l-.04.02a4.51 4.51 0 001.36-3.2 4.5 4.5 0 10-4.5 4.5zm-2.54-4.98h5v1h-5v-1z" clip-rule="evenodd"/>'
	      }, props)
	  };
	return vs;
}

var vsExports = requireVs();

const FETCH_EVENT = "$FETCH";

function getRouteMatches$1(routes, path, method) {
  const segments = path.split("/").filter(Boolean);
  routeLoop:
    for (const route of routes) {
      const matchSegments = route.matchSegments;
      if (segments.length < matchSegments.length || !route.wildcard && segments.length > matchSegments.length) {
        continue;
      }
      for (let index = 0; index < matchSegments.length; index++) {
        const match = matchSegments[index];
        if (!match) {
          continue;
        }
        if (segments[index] !== match) {
          continue routeLoop;
        }
      }
      const handler = route[method];
      if (handler === "skip" || handler === void 0) {
        return;
      }
      const params = {};
      for (const { type, name, index } of route.params) {
        if (type === ":") {
          params[name] = segments[index];
        } else {
          params[name] = segments.slice(index).join("/");
        }
      }
      return { handler, params };
    }
}

let apiRoutes$1;
const registerApiRoutes = (routes) => {
  apiRoutes$1 = routes;
};
async function internalFetch(route, init) {
  if (route.startsWith("http")) {
    return await fetch(route, init);
  }
  let url = new URL(route, "http://internal");
  const request = new Request(url.href, init);
  const handler = getRouteMatches$1(apiRoutes$1, url.pathname, request.method.toUpperCase());
  if (!handler) {
    throw new Error(`No handler found for ${request.method} ${request.url}`);
  }
  let apiEvent = Object.freeze({
    request,
    params: handler.params,
    clientAddress: "127.0.0.1",
    env: {},
    locals: {},
    $type: FETCH_EVENT,
    fetch: internalFetch
  });
  const response = await handler.handler(apiEvent);
  return response;
}

const XSolidStartLocationHeader = "x-solidstart-location";
const LocationHeader = "Location";
const ContentTypeHeader = "content-type";
const XSolidStartResponseTypeHeader = "x-solidstart-response-type";
const XSolidStartContentTypeHeader = "x-solidstart-content-type";
const XSolidStartOrigin = "x-solidstart-origin";
const JSONResponseType = "application/json";
function redirect(url, init = 302) {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  if (url === "") {
    url = "/";
  }
  let headers = new Headers(responseInit.headers);
  headers.set(LocationHeader, url);
  const response = new Response(null, {
    ...responseInit,
    headers
  });
  return response;
}
const redirectStatusCodes = /* @__PURE__ */ new Set([204, 301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return response && response instanceof Response && redirectStatusCodes.has(response.status);
}
class ResponseError extends Error {
  status;
  headers;
  name = "ResponseError";
  ok;
  statusText;
  redirected;
  url;
  constructor(response) {
    let message = JSON.stringify({
      $type: "response",
      status: response.status,
      message: response.statusText,
      headers: [...response.headers.entries()]
    });
    super(message);
    this.status = response.status;
    this.headers = new Map([...response.headers.entries()]);
    this.url = response.url;
    this.ok = response.ok;
    this.statusText = response.statusText;
    this.redirected = response.redirected;
    this.bodyUsed = false;
    this.type = response.type;
    this.response = () => response;
  }
  response;
  type;
  clone() {
    return this.response();
  }
  get body() {
    return this.response().body;
  }
  bodyUsed;
  async arrayBuffer() {
    return await this.response().arrayBuffer();
  }
  async blob() {
    return await this.response().blob();
  }
  async formData() {
    return await this.response().formData();
  }
  async text() {
    return await this.response().text();
  }
  async json() {
    return await this.response().json();
  }
}

const api = [
  {
    GET: "skip",
    path: "/*404"
  },
  {
    GET: "skip",
    path: "/"
  }
];
function expandOptionals$1(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match)
    return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals$1(suffix).reduce(
    (results, expansion) => [...results, ...prefixes.map((p) => p + expansion)],
    []
  );
}
function routeToMatchRoute(route) {
  const segments = route.path.split("/").filter(Boolean);
  const params = [];
  const matchSegments = [];
  let score = route.path.endsWith("/") ? 4 : 0;
  let wildcard = false;
  for (const [index, segment] of segments.entries()) {
    if (segment[0] === ":") {
      const name = segment.slice(1);
      score += 3;
      params.push({
        type: ":",
        name,
        index
      });
      matchSegments.push(null);
    } else if (segment[0] === "*") {
      params.push({
        type: "*",
        name: segment.slice(1),
        index
      });
      wildcard = true;
    } else {
      score += 4;
      matchSegments.push(segment);
    }
  }
  return {
    ...route,
    score,
    params,
    matchSegments,
    wildcard
  };
}
const allRoutes = api.flatMap((route) => {
  const paths = expandOptionals$1(route.path);
  return paths.map((path) => ({ ...route, path }));
}).map(routeToMatchRoute).sort((a, b) => b.score - a.score);
registerApiRoutes(allRoutes);
function getApiHandler(url, method) {
  return getRouteMatches$1(allRoutes, url.pathname, method.toUpperCase());
}

const apiRoutes = ({ forward }) => {
  return async (event) => {
    let apiHandler = getApiHandler(new URL(event.request.url), event.request.method);
    if (apiHandler) {
      let apiEvent = Object.freeze({
        request: event.request,
        clientAddress: event.clientAddress,
        locals: event.locals,
        params: apiHandler.params,
        env: event.env,
        $type: FETCH_EVENT,
        fetch: internalFetch
      });
      try {
        return await apiHandler.handler(apiEvent);
      } catch (error) {
        if (error instanceof Response) {
          return error;
        }
        return new Response(JSON.stringify(error), {
          status: 500
        });
      }
    }
    return await forward(event);
  };
};
function normalizeIntegration(integration) {
    if (!integration) {
        return {
            signal: createSignal({ value: "" })
        };
    }
    else if (Array.isArray(integration)) {
        return {
            signal: integration
        };
    }
    return integration;
}
function staticIntegration(obj) {
    return {
        signal: [() => obj, next => Object.assign(obj, next)]
    };
}

function createBeforeLeave() {
    let listeners = new Set();
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    let ignore = false;
    function confirm(to, options) {
        if (ignore)
            return !(ignore = false);
        const e = {
            to,
            options,
            defaultPrevented: false,
            preventDefault: () => (e.defaultPrevented = true)
        };
        for (const l of listeners)
            l.listener({
                ...e,
                from: l.location,
                retry: (force) => {
                    force && (ignore = true);
                    l.navigate(to, options);
                }
            });
        return !e.defaultPrevented;
    }
    return {
        subscribe,
        confirm
    };
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
function normalizePath(path, omitSlash = false) {
    const s = path.replace(trimPathRegex, "$1");
    return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}
function resolvePath(base, path, from) {
    if (hasSchemeRegex.test(path)) {
        return undefined;
    }
    const basePath = normalizePath(base);
    const fromPath = from && normalizePath(from);
    let result = "";
    if (!fromPath || path.startsWith("/")) {
        result = basePath;
    }
    else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
        result = basePath + fromPath;
    }
    else {
        result = fromPath;
    }
    return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
    if (value == null) {
        throw new Error(message);
    }
    return value;
}
function joinPaths(from, to) {
    return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
    const params = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}
function createMatcher(path, partial, matchFilters) {
    const [pattern, splat] = path.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    const len = segments.length;
    return (location) => {
        const locSegments = location.split("/").filter(Boolean);
        const lenDiff = locSegments.length - len;
        if (lenDiff < 0 || (lenDiff > 0 && splat === undefined && !partial)) {
            return null;
        }
        const match = {
            path: len ? "" : "/",
            params: {}
        };
        const matchFilter = (s) => matchFilters === undefined ? undefined : matchFilters[s];
        for (let i = 0; i < len; i++) {
            const segment = segments[i];
            const locSegment = locSegments[i];
            const dynamic = segment[0] === ":";
            const key = dynamic ? segment.slice(1) : segment;
            if (dynamic && matchSegment(locSegment, matchFilter(key))) {
                match.params[key] = locSegment;
            }
            else if (dynamic || !matchSegment(locSegment, segment)) {
                return null;
            }
            match.path += `/${locSegment}`;
        }
        if (splat) {
            const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
            if (matchSegment(remainder, matchFilter(splat))) {
                match.params[splat] = remainder;
            }
            else {
                return null;
            }
        }
        return match;
    };
}
function matchSegment(input, filter) {
    const isEqual = (s) => s.localeCompare(input, undefined, { sensitivity: "base" }) === 0;
    if (filter === undefined) {
        return true;
    }
    else if (typeof filter === "string") {
        return isEqual(filter);
    }
    else if (typeof filter === "function") {
        return filter(input);
    }
    else if (Array.isArray(filter)) {
        return filter.some(isEqual);
    }
    else if (filter instanceof RegExp) {
        return filter.test(input);
    }
    return false;
}
function scoreRoute(route) {
    const [pattern, splat] = route.pattern.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
    const map = new Map();
    const owner = getOwner();
    return new Proxy({}, {
        get(_, property) {
            if (!map.has(property)) {
                runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
            }
            return map.get(property)();
        },
        getOwnPropertyDescriptor() {
            return {
                enumerable: true,
                configurable: true
            };
        },
        ownKeys() {
            return Reflect.ownKeys(fn());
        }
    });
}
function expandOptionals(pattern) {
    let match = /(\/?\:[^\/]+)\?/.exec(pattern);
    if (!match)
        return [pattern];
    let prefix = pattern.slice(0, match.index);
    let suffix = pattern.slice(match.index + match[0].length);
    const prefixes = [prefix, (prefix += match[1])];
    // This section handles adjacent optional params. We don't actually want all permuations since
    // that will lead to equivalent routes which have the same number of params. For example
    // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
    // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
    // ensure predictability where earlier params have precidence.
    while ((match = /^(\/\:[^\/]+)\?/.exec(suffix))) {
        prefixes.push((prefix += match[1]));
        suffix = suffix.slice(match[0].length);
    }
    return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map(p => p + expansion)], []);
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
let TempRoute;
const useRoute = () => TempRoute || useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = (path) => {
    const route = useRoute();
    return createMemo(() => route.resolvePath(path()));
};
const useHref = (to) => {
    const router = useRouter();
    return createMemo(() => {
        const to_ = to();
        return to_ !== undefined ? router.renderPath(to_) : to_;
    });
};
const useLocation$1 = () => useRouter().location;
function createRoutes(routeDef, base = "", fallback) {
    const { component, data, children } = routeDef;
    const isLeaf = !children || (Array.isArray(children) && !children.length);
    const shared = {
        key: routeDef,
        element: component
            ? () => createComponent(component, {})
            : () => {
                const { element } = routeDef;
                return element === undefined && fallback
                    ? createComponent(fallback, {})
                    : element;
            },
        preload: routeDef.component
            ? component.preload
            : routeDef.preload,
        data
    };
    return asArray(routeDef.path).reduce((acc, path) => {
        for (const originalPath of expandOptionals(path)) {
            const path = joinPaths(base, originalPath);
            const pattern = isLeaf ? path : path.split("/*", 1)[0];
            acc.push({
                ...shared,
                originalPath,
                pattern,
                matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
            });
        }
        return acc;
    }, []);
}
function createBranch(routes, index = 0) {
    return {
        routes,
        score: scoreRoute(routes[routes.length - 1]) * 10000 - index,
        matcher(location) {
            const matches = [];
            for (let i = routes.length - 1; i >= 0; i--) {
                const route = routes[i];
                const match = route.matcher(location);
                if (!match) {
                    return null;
                }
                matches.unshift({
                    ...match,
                    route
                });
            }
            return matches;
        }
    };
}
function asArray(value) {
    return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
    const routeDefs = asArray(routeDef);
    for (let i = 0, len = routeDefs.length; i < len; i++) {
        const def = routeDefs[i];
        if (def && typeof def === "object" && def.hasOwnProperty("path")) {
            const routes = createRoutes(def, base, fallback);
            for (const route of routes) {
                stack.push(route);
                const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
                if (def.children && !isEmptyArray) {
                    createBranches(def.children, route.pattern, fallback, stack, branches);
                }
                else {
                    const branch = createBranch([...stack], branches.length);
                    branches.push(branch);
                }
                stack.pop();
            }
        }
    }
    // Stack will be empty on final return
    return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
    for (let i = 0, len = branches.length; i < len; i++) {
        const match = branches[i].matcher(location);
        if (match) {
            return match;
        }
    }
    return [];
}
function createLocation(path, state) {
    const origin = new URL("http://sar");
    const url = createMemo(prev => {
        const path_ = path();
        try {
            return new URL(path_, origin);
        }
        catch (err) {
            console.error(`Invalid path ${path_}`);
            return prev;
        }
    }, origin);
    const pathname = createMemo(() => url().pathname);
    const search = createMemo(() => url().search, true);
    const hash = createMemo(() => url().hash);
    const key = createMemo(() => "");
    return {
        get pathname() {
            return pathname();
        },
        get search() {
            return search();
        },
        get hash() {
            return hash();
        },
        get state() {
            return state();
        },
        get key() {
            return key();
        },
        query: createMemoObject(on(search, () => extractSearchParams(url())))
    };
}
function createRouterContext(integration, base = "", data, out) {
    const { signal: [source, setSource], utils = {} } = normalizeIntegration(integration);
    const parsePath = utils.parsePath || (p => p);
    const renderPath = utils.renderPath || (p => p);
    const beforeLeave = utils.beforeLeave || createBeforeLeave();
    const basePath = resolvePath("", base);
    const output = out
        ? Object.assign(out, {
            matches: [],
            url: undefined
        })
        : undefined;
    if (basePath === undefined) {
        throw new Error(`${basePath} is not a valid base path`);
    }
    else if (basePath && !source().value) {
        setSource({ value: basePath, replace: true, scroll: false });
    }
    const [isRouting, setIsRouting] = createSignal(false);
    const start = async (callback) => {
        setIsRouting(true);
        try {
            await startTransition(callback);
        }
        finally {
            setIsRouting(false);
        }
    };
    const [reference, setReference] = createSignal(source().value);
    const [state, setState] = createSignal(source().state);
    const location = createLocation(reference, state);
    const referrers = [];
    const baseRoute = {
        pattern: basePath,
        params: {},
        path: () => basePath,
        outlet: () => null,
        resolvePath(to) {
            return resolvePath(basePath, to);
        }
    };
    if (data) {
        try {
            TempRoute = baseRoute;
            baseRoute.data = data({
                data: undefined,
                params: {},
                location,
                navigate: navigatorFactory(baseRoute)
            });
        }
        finally {
            TempRoute = undefined;
        }
    }
    function navigateFromRoute(route, to, options) {
        // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
        untrack(() => {
            if (typeof to === "number") {
                if (!to) ;
                else if (utils.go) {
                    beforeLeave.confirm(to, options) && utils.go(to);
                }
                else {
                    console.warn("Router integration does not support relative routing");
                }
                return;
            }
            const { replace, resolve, scroll, state: nextState } = {
                replace: false,
                resolve: true,
                scroll: true,
                ...options
            };
            const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);
            if (resolvedTo === undefined) {
                throw new Error(`Path '${to}' is not a routable path`);
            }
            else if (referrers.length >= MAX_REDIRECTS) {
                throw new Error("Too many redirects");
            }
            const current = reference();
            if (resolvedTo !== current || nextState !== state()) {
                {
                    if (output) {
                        output.url = resolvedTo;
                    }
                    setSource({ value: resolvedTo, replace, scroll, state: nextState });
                }
            }
        });
    }
    function navigatorFactory(route) {
        // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
        route = route || useContext(RouteContextObj) || baseRoute;
        return (to, options) => navigateFromRoute(route, to, options);
    }
    createRenderEffect(() => {
        const { value, state } = source();
        // Untrack this whole block so `start` doesn't cause Solid's Listener to be preserved
        untrack(() => {
            if (value !== reference()) {
                start(() => {
                    setReference(value);
                    setState(state);
                });
            }
        });
    });
    return {
        base: baseRoute,
        out: output,
        location,
        isRouting,
        renderPath,
        parsePath,
        navigatorFactory,
        beforeLeave
    };
}
function createRouteContext(router, parent, child, match, params) {
    const { base, location, navigatorFactory } = router;
    const { pattern, element: outlet, preload, data } = match().route;
    const path = createMemo(() => match().path);
    preload && preload();
    const route = {
        parent,
        pattern,
        get child() {
            return child();
        },
        path,
        params,
        data: parent.data,
        outlet,
        resolvePath(to) {
            return resolvePath(base.path(), to, path());
        }
    };
    if (data) {
        try {
            TempRoute = route;
            route.data = data({ data: parent.data, params, location, navigate: navigatorFactory(route) });
        }
        finally {
            TempRoute = undefined;
        }
    }
    return route;
}

const Router = props => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (staticIntegration({
    value: url || ""
  }) );
  const routerState = createRouterContext(integration, base, data, out);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return props.children;
    }
  });
};
const Routes$1 = props => {
  const router = useRouter();
  const parentRoute = useRoute();
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), joinPaths(parentRoute.pattern, props.base || ""), Outlet));
  const matches = createMemo(() => getRouteMatches(branches(), router.location.pathname));
  const params = createMemoObject(() => {
    const m = matches();
    const params = {};
    for (let i = 0; i < m.length; i++) {
      Object.assign(params, m[i].params);
    }
    return params;
  });
  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i], params);
        });
      }
    }
    disposers.splice(nextMatches.length).forEach(dispose => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createComponent(Show, {
    get when() {
      return routeStates() && root;
    },
    children: route => createComponent(RouteContextObj.Provider, {
      value: route,
      get children() {
        return route.outlet();
      }
    })
  });
};
const Outlet = () => {
  const route = useRoute();
  return createComponent(Show, {
    get when() {
      return route.child;
    },
    children: child => createComponent(RouteContextObj.Provider, {
      value: child,
      get children() {
        return child.outlet();
      }
    })
  });
};
function A$1(props) {
  props = mergeProps({
    inactiveClass: "inactive",
    activeClass: "active"
  }, props);
  const [, rest] = splitProps(props, ["href", "state", "class", "activeClass", "inactiveClass", "end"]);
  const to = useResolvedPath(() => props.href);
  const href = useHref(to);
  const location = useLocation$1();
  const isActive = createMemo(() => {
    const to_ = to();
    if (to_ === undefined) return false;
    const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
    const loc = normalizePath(location.pathname).toLowerCase();
    return props.end ? path === loc : loc.startsWith(path);
  });
  return ssrElement("a", mergeProps({
    link: true
  }, rest, {
    get href() {
      return href() || props.href;
    },
    get state() {
      return JSON.stringify(props.state);
    },
    get classList() {
      return {
        ...(props.class && {
          [props.class]: true
        }),
        [props.inactiveClass]: !isActive(),
        [props.activeClass]: isActive(),
        ...rest.classList
      };
    },
    get ["aria-current"]() {
      return isActive() ? "page" : undefined;
    }
  }), undefined, true);
}

class ServerError extends Error {
  constructor(message, {
    status,
    stack
  } = {}) {
    super(message);
    this.name = "ServerError";
    this.status = status || 400;
    if (stack) {
      this.stack = stack;
    }
  }
}
class FormError extends ServerError {
  constructor(message, {
    fieldErrors = {},
    form,
    fields,
    stack
  } = {}) {
    super(message, {
      stack
    });
    this.formError = message;
    this.name = "FormError";
    this.fields = fields || Object.fromEntries(typeof form !== "undefined" ? form.entries() : []) || {};
    this.fieldErrors = fieldErrors;
  }
}

const ServerContext = createContext({});

const A = A$1;
const Routes = Routes$1;
const useLocation = useLocation$1;

const server$ = (_fn) => {
  throw new Error("Should be compiled away");
};
async function parseRequest(event) {
  let request = event.request;
  let contentType = request.headers.get(ContentTypeHeader);
  let name = new URL(request.url).pathname, args = [];
  if (contentType) {
    if (contentType === JSONResponseType) {
      let text = await request.text();
      try {
        args = JSON.parse(text, (key, value) => {
          if (!value) {
            return value;
          }
          if (value.$type === "headers") {
            let headers = new Headers();
            request.headers.forEach((value2, key2) => headers.set(key2, value2));
            value.values.forEach(([key2, value2]) => headers.set(key2, value2));
            return headers;
          }
          if (value.$type === "request") {
            return new Request(value.url, {
              method: value.method,
              headers: value.headers
            });
          }
          return value;
        });
      } catch (e) {
        throw new Error(`Error parsing request body: ${text}`);
      }
    } else if (contentType.includes("form")) {
      let formData = await request.clone().formData();
      args = [formData, event];
    }
  }
  return [name, args];
}
function respondWith(request, data, responseType) {
  if (data instanceof ResponseError) {
    data = data.clone();
  }
  if (data instanceof Response) {
    if (isRedirectResponse(data) && request.headers.get(XSolidStartOrigin) === "client") {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartLocationHeader, data.headers.get(LocationHeader));
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(null, {
        status: 204,
        statusText: "Redirected",
        headers
      });
    } else if (data.status === 101) {
      return data;
    } else {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(data.body, {
        status: data.status,
        statusText: data.statusText,
        headers
      });
    }
  } else if (data instanceof FormError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: "",
          formError: data.formError,
          fields: data.fields,
          fieldErrors: data.fieldErrors
        }
      }),
      {
        status: 400,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "form-error"
        }
      }
    );
  } else if (data instanceof ServerError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: ""
        }
      }),
      {
        status: data.status,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "server-error"
        }
      }
    );
  } else if (data instanceof Error) {
    console.error(data);
    return new Response(
      JSON.stringify({
        error: {
          message: "Internal Server Error",
          stack: "",
          status: data.status
        }
      }),
      {
        status: data.status || 500,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "error"
        }
      }
    );
  } else if (typeof data === "object" || typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        [ContentTypeHeader]: "application/json",
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "json"
      }
    });
  }
  return new Response("null", {
    status: 200,
    headers: {
      [ContentTypeHeader]: "application/json",
      [XSolidStartContentTypeHeader]: "json",
      [XSolidStartResponseTypeHeader]: responseType
    }
  });
}
async function handleServerRequest(event) {
  const url = new URL(event.request.url);
  if (server$.hasHandler(url.pathname)) {
    try {
      let [name, args] = await parseRequest(event);
      let handler = server$.getHandler(name);
      if (!handler) {
        throw {
          status: 404,
          message: "Handler Not Found for " + name
        };
      }
      const data = await handler.call(event, ...Array.isArray(args) ? args : [args]);
      return respondWith(event.request, data, "return");
    } catch (error) {
      return respondWith(event.request, error, "throw");
    }
  }
  return null;
}
const handlers = /* @__PURE__ */ new Map();
server$.createHandler = (_fn, hash, serverResource) => {
  let fn = function(...args) {
    let ctx;
    if (typeof this === "object") {
      ctx = this;
    } else if (sharedConfig.context && sharedConfig.context.requestContext) {
      ctx = sharedConfig.context.requestContext;
    } else {
      ctx = {
        request: new URL(hash, "http://localhost:3000").href,
        responseHeaders: new Headers()
      };
    }
    const execute = async () => {
      try {
        return serverResource ? _fn.call(ctx, args[0], ctx) : _fn.call(ctx, ...args);
      } catch (e) {
        if (e instanceof Error && /[A-Za-z]+ is not defined/.test(e.message)) {
          const error = new Error(
            e.message + "\n You probably are using a variable defined in a closure in your server function."
          );
          error.stack = e.stack;
          throw error;
        }
        throw e;
      }
    };
    return execute();
  };
  fn.url = hash;
  fn.action = function(...args) {
    return fn.call(this, ...args);
  };
  return fn;
};
server$.registerHandler = function(route, handler) {
  handlers.set(route, handler);
};
server$.getHandler = function(route) {
  return handlers.get(route);
};
server$.hasHandler = function(route) {
  return handlers.has(route);
};
server$.fetch = internalFetch;

const inlineServerFunctions = ({ forward }) => {
  return async (event) => {
    const url = new URL(event.request.url);
    if (server$.hasHandler(url.pathname)) {
      let contentType = event.request.headers.get(ContentTypeHeader);
      let origin = event.request.headers.get(XSolidStartOrigin);
      let formRequestBody;
      if (contentType != null && contentType.includes("form") && !(origin != null && origin.includes("client"))) {
        let [read1, read2] = event.request.body.tee();
        formRequestBody = new Request(event.request.url, {
          body: read2,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
        event.request = new Request(event.request.url, {
          body: read1,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
      }
      let serverFunctionEvent = Object.freeze({
        request: event.request,
        clientAddress: event.clientAddress,
        locals: event.locals,
        fetch: internalFetch,
        $type: FETCH_EVENT,
        env: event.env
      });
      const serverResponse = await handleServerRequest(serverFunctionEvent);
      let responseContentType = serverResponse.headers.get(XSolidStartContentTypeHeader);
      if (formRequestBody && responseContentType !== null && responseContentType.includes("error")) {
        const formData = await formRequestBody.formData();
        let entries = [...formData.entries()];
        return new Response(null, {
          status: 302,
          headers: {
            Location: new URL(event.request.headers.get("referer") || "").pathname + "?form=" + encodeURIComponent(
              JSON.stringify({
                url: url.pathname,
                entries,
                ...await serverResponse.json()
              })
            )
          }
        });
      }
      return serverResponse;
    }
    const response = await forward(event);
    return response;
  };
};

function renderAsync(fn, options) {
  return () => apiRoutes({
    forward: inlineServerFunctions({
      async forward(event) {
        let pageEvent = createPageEvent(event);
        let markup = await renderToStringAsync(() => fn(pageEvent), options);
        if (pageEvent.routerContext && pageEvent.routerContext.url) {
          return redirect(pageEvent.routerContext.url, {
            headers: pageEvent.responseHeaders
          });
        }
        markup = handleIslandsRouting(pageEvent, markup);
        return new Response(markup, {
          status: pageEvent.getStatusCode(),
          headers: pageEvent.responseHeaders
        });
      }
    })
  });
}
function createPageEvent(event) {
  let responseHeaders = new Headers({
    "Content-Type": "text/html"
  });
  const prevPath = event.request.headers.get("x-solid-referrer");
  let statusCode = 200;
  function setStatusCode(code) {
    statusCode = code;
  }
  function getStatusCode() {
    return statusCode;
  }
  const pageEvent = Object.freeze({
    request: event.request,
    prevUrl: prevPath || "",
    routerContext: {},
    tags: [],
    env: event.env,
    clientAddress: event.clientAddress,
    locals: event.locals,
    $type: FETCH_EVENT,
    responseHeaders,
    setStatusCode,
    getStatusCode,
    fetch: internalFetch
  });
  return pageEvent;
}
function handleIslandsRouting(pageEvent, markup) {
  return markup;
}

const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const getTagType = tag => tag.tag + (tag.name ? `.${tag.name}"` : "");
const MetaProvider = props => {
  const cascadedTagInstances = new Map();
  const actions = {
    addClientTag: tag => {
      let tagType = getTagType(tag);
      if (cascadingTags.indexOf(tag.tag) !== -1) {
        //  only cascading tags need to be kept as singletons
        if (!cascadedTagInstances.has(tagType)) {
          cascadedTagInstances.set(tagType, []);
        }
        let instances = cascadedTagInstances.get(tagType);
        let index = instances.length;
        instances = [...instances, tag];
        // track indices synchronously
        cascadedTagInstances.set(tagType, instances);
        return index;
      }
      return -1;
    },
    removeClientTag: (tag, index) => {
      const tagName = getTagType(tag);
      if (tag.ref) {
        const t = cascadedTagInstances.get(tagName);
        if (t) {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
            for (let i = index - 1; i >= 0; i--) {
              if (t[i] != null) {
                document.head.appendChild(t[i].ref);
              }
            }
          }
          t[index] = null;
          cascadedTagInstances.set(tagName, t);
        } else {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
          }
        }
      }
    }
  };
  {
    actions.addServerTag = tagDesc => {
      const {
        tags = []
      } = props;
      // tweak only cascading tags
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const index = tags.findIndex(prev => {
          const prevName = prev.props.name || prev.props.property;
          const nextName = tagDesc.props.name || tagDesc.props.property;
          return prev.tag === tagDesc.tag && prevName === nextName;
        });
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
    };
    if (Array.isArray(props.tags) === false) {
      throw Error("tags array should be passed to <MetaProvider /> in node");
    }
  }
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props) => {
  const id = createUniqueId();
  const c = useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  useHead({
    tag,
    props,
    id,
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const {
    addClientTag,
    removeClientTag,
    addServerTag
  } = useContext(MetaContext);
  createRenderEffect(() => {
    if (!isServer) ;
  });
  {
    addServerTag(tagDesc);
    return null;
  }
}
function renderTags(tags) {
  return tags.map(tag => {
    const keys = Object.keys(tag.props);
    const props = keys.map(k => k === "children" ? "" : ` ${k}="${tag.props[k]}"`).join("");
    return tag.props.children ? `<${tag.tag} data-sm="${tag.id}"${props}>${
    // Tags might contain multiple text children:
    //   <Title>example - {myCompany}</Title>
    Array.isArray(tag.props.children) ? tag.props.children.join("") : tag.props.children}</${tag.tag}>` : `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = props => MetaTag("title", props);
const Meta$1 = props => MetaTag("meta", props);

const _tmpl$$6 = ["<div", " style=\"", "\"><div style=\"", "\"><p style=\"", "\" id=\"error-message\">", "</p><button id=\"reset-errors\" style=\"", "\">Clear errors and retry</button><pre style=\"", "\">", "</pre></div></div>"];
function ErrorBoundary(props) {
  return createComponent(ErrorBoundary$1, {
    fallback: (e, reset) => {
      return createComponent(Show, {
        get when() {
          return !props.fallback;
        },
        get fallback() {
          return props.fallback && props.fallback(e, reset);
        },
        get children() {
          return createComponent(ErrorMessage, {
            error: e
          });
        }
      });
    },
    get children() {
      return props.children;
    }
  });
}
function ErrorMessage(props) {
  return ssr(_tmpl$$6, ssrHydrationKey(), "padding:" + "16px", "background-color:" + "rgba(252, 165, 165)" + (";color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";overflow:" + "scroll") + (";padding:" + "16px") + (";margin-bottom:" + "8px"), "font-weight:" + "bold", escape(props.error.message), "color:" + "rgba(252, 165, 165)" + (";background-color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";padding:" + "4px 8px"), "margin-top:" + "8px" + (";width:" + "100%"), escape(props.error.stack));
}

const routeLayouts = {
  "/*404": {
    "id": "/*404",
    "layouts": []
  },
  "/": {
    "id": "/",
    "layouts": []
  }
};

const _tmpl$$5 = ["<link", " rel=\"stylesheet\"", ">"],
  _tmpl$2$1 = ["<link", " rel=\"modulepreload\"", ">"];
function flattenIslands(match, manifest) {
  let result = [...match];
  match.forEach(m => {
    if (m.type !== "island") return;
    const islandManifest = manifest[m.href];
    if (islandManifest) {
      const res = flattenIslands(islandManifest.assets, manifest);
      result.push(...res);
    }
  });
  return result;
}
function getAssetsFromManifest(manifest, routerContext) {
  let match = routerContext.matches ? routerContext.matches.reduce((memo, m) => {
    if (m.length) {
      const fullPath = m.reduce((previous, match) => previous + match.originalPath, "");
      const route = routeLayouts[fullPath];
      if (route) {
        memo.push(...(manifest[route.id] || []));
        const layoutsManifestEntries = route.layouts.flatMap(manifestKey => manifest[manifestKey] || []);
        memo.push(...layoutsManifestEntries);
      }
    }
    return memo;
  }, []) : [];
  match.push(...(manifest["entry-client"] || []));
  match = manifest ? flattenIslands(match, manifest) : [];
  const links = match.reduce((r, src) => {
    r[src.href] = src.type === "style" ? ssr(_tmpl$$5, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : src.type === "script" ? ssr(_tmpl$2$1, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : undefined;
    return r;
  }, {});
  return Object.values(links);
}

/**
 * Links are used to load assets for the server rendered HTML
 * @returns {JSXElement}
 */
function Links() {
  const context = useContext(ServerContext);
  useAssets(() => getAssetsFromManifest(context.env.manifest, context.routerContext));
  return null;
}

function Meta() {
  const context = useContext(ServerContext);
  // @ts-expect-error The ssr() types do not match the Assets child types
  useAssets(() => ssr(renderTags(context.tags)));
  return null;
}

const _tmpl$$4 = "<!---->",
  _tmpl$5 = ["<script", " type=\"module\" async", "></script>"];
const isDev = "production" === "development";
const isIslands = false;
function Scripts() {
  const context = useContext(ServerContext);
  return [createComponent(HydrationScript, {}), ssr(_tmpl$$4), isIslands , createComponent(NoHydration, {
    get children() {
      return (      ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("src", escape(context.env.manifest["entry-client"][0].href, true), false)) );
    }
  }), isDev ];
}

function Html(props) {
  {
    return ssrElement("html", props, undefined, false);
  }
}
function Head(props) {
  {
    return ssrElement("head", props, () => [props.children, createComponent(Meta, {}), createComponent(Links, {})], false);
  }
}
function Body(props) {
  {
    return ssrElement("body", props, () => props.children , false);
  }
}

const _tmpl$$3 = ["<main", " class=\"text-center mx-auto text-gray-700 p-4\"><h1 class=\"max-6-xs text-6xl text-sky-700 font-thin uppercase my-16\">Not Found</h1><p class=\"mt-8\">Visit <a href=\"https://solidjs.com\" target=\"_blank\" class=\"text-sky-600 hover:underline\">solidjs.com</a> to learn how to build Solid apps.</p><p class=\"my-4\"><!--#-->", "<!--/--> - <!--#-->", "<!--/--></p></main>"];
function NotFound() {
  return ssr(_tmpl$$3, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })), escape(createComponent(A, {
    href: "/about",
    "class": "text-sky-600 hover:underline",
    children: "About Page"
  })));
}

const _tmpl$$2 = ["<select", " class=\"select select-primary max-w-xs rounded-full\"><option disabled selected> <!--#-->", "<!--/--> </option><!--#-->", "<!--/--></select>"],
  _tmpl$2 = ["<option", ">", "</option>"],
  _tmpl$3 = ["<div", " class=\"mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center\"><div class=\"text-center opacity-80 rounded-lg\"><h1 class=\"text-4xl font-bold tracking-tight text-green-800 sm:text-6xl\">Rental Price Predictions</h1><div class=\"relative mt-4 rounded-md shadow-sm\"><textarea class=\"w-full rounded-3xl h-8 textarea-primary textarea textarea-bordered\" placeholder=\"Start by entering your address\"></textarea></div><div class=\"flex gap-6 justify-center\">", "</div><div class=\"mt-10 flex items-center justify-center gap-x-6\"><button class=\"flex items-center gap-1 rounded-full btn btn-primary\">Predict Now<!--#-->", "<!--/--></button></div></div></div>"];
const Search = props => {
  const maxSelectValue = 10;
  const roomOptions = ["Bedroom", "Bathroom", "Den"];
  const roomOptionDiv = Array.from(roomOptions, (_, i) => ssr(_tmpl$$2, ssrHydrationKey(), escape(_), escape(Array.from({
    length: maxSelectValue + 1
  }, (_, i) => i).map(value => ssr(_tmpl$2, ssrHydrationKey() + ssrAttribute("value", escape(value, true), false), escape(value))))));
  return ssr(_tmpl$3, ssrHydrationKey(), escape(roomOptionDiv), escape(createComponent(vsExports.VsArrowRight, {})));
};

const _tmpl$$1 = ["<div", " class=\"mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center\"><div class=\"text-center opacity-80 rounded-lg\"><p class=\"text-xl tracking-tight text-green-800 sm:text-3xl\">The Predicted Price is:</p><div class=\"flex items-center gap-1\"><h1 class=\"text-4xl font-bold tracking-tight text-green-800 sm:text-6xl\">", "</h1><p class=\"text-xl font-bold tracking-tight text-green-800 sm:text-4xl\"> (per month)</p></div><div class=\"mt-10 flex items-center justify-center gap-x-6\"><button class=\"flex items-center gap-1 rounded-full btn btn-primary\">Try Again<!--#-->", "<!--/--></button><button class=\"btn btn-active btn-link\">Learn more</button></div></div></div>"];
const Result = props => {
  return ssr(_tmpl$$1, ssrHydrationKey(), `$${escape(props.price)}`, escape(createComponent(vsExports.VsRefresh, {})));
};

const _tmpl$ = ["<div", " class=\"h-screen relative\"><img class=\"absolute inset-0 w-full h-full opacity-40 object-cover\"", "><main class=\"relative backdrop-blur h-full\">", "</main></div>"];
const Landing = () => {
  const [searched, setSearched] = createSignal(false);
  const [price, setPrice] = createSignal(0);
  const background = {
    path: "../../assets/image/toronto-background.jpeg",
    alt: "toronto-background"
  };
  const handleSearchChange = newState => {
    setSearched(newState);
  };
  const handlePriceChange = newPrice => {
    setPrice(newPrice);
  };
  return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("src", escape(background.path, true), false) + ssrAttribute("alt", escape(background.alt, true), false), !searched() ? escape(createComponent(Search, {
    onSearchChange: handleSearchChange,
    onPriceChange: handlePriceChange
  })) : escape(createComponent(Result, {
    onSearchChange: handleSearchChange,
    get price() {
      return price();
    }
  })));
};

/// <reference path="../server/types.tsx" />
const fileRoutes = [{
  component: NotFound,
  path: "/*404"
}, {
  component: Landing,
  path: "/"
}];

/**
 * Routes are the file system based routes, used by Solid App Router to show the current page according to the URL.
 */

const FileRoutes = () => {
  return fileRoutes;
};

function Root() {
  useLocation();
  return createComponent(Html, {
    lang: "en",
    get children() {
      return [createComponent(Head, {
        get children() {
          return [createComponent(Title, {
            children: "SolidStart - With TailwindCSS"
          }), createComponent(Meta$1, {
            charset: "utf-8"
          }), createComponent(Meta$1, {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          })];
        }
      }), createComponent(Body, {
        get children() {
          return [createComponent(Suspense, {
            get children() {
              return createComponent(ErrorBoundary, {
                get children() {
                  return createComponent(Routes, {
                    get children() {
                      return createComponent(FileRoutes, {});
                    }
                  });
                }
              });
            }
          }), createComponent(Scripts, {})];
        }
      })];
    }
  });
}

const rootData = Object.values(/* #__PURE__ */ Object.assign({

}))[0];
const dataFn = rootData ? rootData.default : undefined;

/** Function responsible for listening for streamed [operations]{@link Operation}. */

/** This composes an array of Exchanges into a single ExchangeIO function */
const composeMiddleware = exchanges => ({
  forward
}) => exchanges.reduceRight((forward, exchange) => exchange({
  forward
}), forward);
function createHandler(...exchanges) {
  const exchange = composeMiddleware(exchanges);
  return async event => {
    return await exchange({
      forward: async op => {
        return new Response(null, {
          status: 404
        });
      }
    })(event);
  };
}
function StartRouter(props) {
  return createComponent(Router, props);
}
const docType = ssr("<!DOCTYPE html>");
function StartServer({
  event
}) {
  const parsed = new URL(event.request.url);
  const path = parsed.pathname + parsed.search;

  // @ts-ignore
  sharedConfig.context.requestContext = event;
  return createComponent(ServerContext.Provider, {
    value: event,
    get children() {
      return createComponent(MetaProvider, {
        get tags() {
          return event.tags;
        },
        get children() {
          return createComponent(StartRouter, {
            url: path,
            get out() {
              return event.routerContext;
            },
            location: path,
            get prevLocation() {
              return event.prevUrl;
            },
            data: dataFn,
            routes: fileRoutes,
            get children() {
              return [docType, createComponent(Root, {})];
            }
          });
        }
      });
    }
  });
}

const entryServer = createHandler(renderAsync(event => createComponent(StartServer, {
  event: event
})));

const { PORT = 3000 } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));
const paths = {
  assets: join(__dirname, "/public")
};

const server = createServer({
  paths,
  handler: entryServer,
  env: { manifest },
});

server.listen(PORT, err => {
  if (err) {
    console.log("error", err);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
