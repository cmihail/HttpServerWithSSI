/**
 * ContentType enum uses the file extension to loosely map the available content type based on common media types:
 * http://en.wikipedia.org/wiki/Internet_media_type
 */
ContentTypeEnum = {
	CSS: {
		type: 'text/css',
	},
	GIF: {
		type:'image/gif',
	},
    HTM: {
    	type: 'text/html',
    },
    HTML: {
    	type: 'text/html',
    },
    SHTML: {
    	type: 'text/html',
    },
    ICO: {
    	type: 'image/gif',
    },
    JPG: {
    	type: 'image/jpeg',
    },
    JPEG: {
    	type: 'image/jpeg',
    },
    PNG: {
    	type: 'image/png',
    },
    TXT: {
    	type: 'text/plain',
    },
    XML: {
    	type: 'text/xml',
    },
    OCTET_STREAM: {
    	type: 'application/octet-stream',
    },
    NO_CONTENT: {
    	type: 'inexistent',
    },

    /**
     * Gets content type based on filename. It's not the job of this
     * function to test for file existence. 
     * @param filename The filename.
     * @returns the correspondent ContentTypeEnum value 
     */
    getContentType : function(filename) {
    	var aux = filename.split('.');
    	if (aux.length < 2)
    		return ContentTypeEnum.OCTET_STREAM;
    	
    	var extension = aux[aux.length - 1].toUpperCase();
    	for (var attr in ContentTypeEnum) {
    		if (extension == attr && attr != 'getContentType' &&
    				attr != 'OCTET_STREAM' && attr != 'NO_CONTENT') {
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
