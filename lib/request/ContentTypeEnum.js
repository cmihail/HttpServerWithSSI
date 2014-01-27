/**
 * ContentType enum uses the file extension to loosely map the available content type based on common media types:
 * http://en.wikipedia.org/wiki/Internet_media_type
 */
ContentTypeEnum = {
	CSS: "text/css",
	GIF: "image/gif",
    HTM: "text/html",
    HTML: "text/html",
    ICO: "image/gif",
    JPG: "image/jpeg",
    JPEG: "image/jpeg",
    PNG: "image/png",
    TXT: "text/plain",
    XML: "text/xml",
    OCTET_STREAM: "application/octet-stream",
    NO_CONTENT: "inexistent"
};

/**
 * Exports.
 */
module.exports = ContentTypeEnum;