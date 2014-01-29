/**
 * ContentType enum uses the file extension to loosely map the available content type based on common media types:
 * http://en.wikipedia.org/wiki/Internet_media_type
 */
ContentTypeEnum = {
	CSS: 'text/css',
	GIF: 'image/gif',
    HTM: 'text/html',
    HTML: 'text/html',
    ICO: 'image/gif',
    JPG: 'image/jpeg',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    TXT: 'text/plain',
    XML: 'text/xml',
    OCTET_STREAM: 'application/octet-stream',
    NO_CONTENT: 'inexistent',

    /**
     * Gets content type based on filename. It's not the job of this
     * function to test for file existence. 
     * @param filename The file name.
     * @returns the correspondent ContentTypeEnum value 
     */
    getContentType : function(filename) {
    	var aux = filename.split('.');
    	if (aux.length < 2)
    		return ContentTypeEnum.OCTET_STREAM;
    	
    	var extension = aux[aux.length - 1].toUpperCase();
    	for (var attr in ContentTypeEnum) {
    		if (extension == attr && attr != 'OCTET_STREAM' &&
    				attr != 'NO_CONTENT') {
    			return ContentTypeEnum[attr];
    		}
    	}
    	return ContentTypeEnum.OCTET_STREAM;
    }
};

/**
 * Exports.
 */
module.exports = ContentTypeEnum;