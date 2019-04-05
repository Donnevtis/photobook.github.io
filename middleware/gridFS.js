const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const config = require('../config/database');
const streamifier = require('streamifier');

//gridFS middleware
class GridFS {
    constructor() {
        this.client = new mongodb.MongoClient(config.uri, { useNewUrlParser: true });
        this.FILES_COLL = 'photos.files';
        this.client.connect((error) => {
            this.db = this.client.db();
            this.bucket = new mongodb.GridFSBucket(this.db, {
                bucketName: 'photos'
            });
            this.collection = this.db.collection(this.FILES_COLL)
        })

    }

    sendFile(name, file, data) {
        this.uploadStream = this.bucket.openUploadStream(name, {
            metadata: data
        })
        this.id = this.uploadStream.id;


        return new Promise(resolve => {
            streamifier.createReadStream(file).
            pipe(this.uploadStream).
            on('error', function(error) {
                assert.ifError(error);
            }).
            on('finish', function() {
                console.log('done!');
                resolve(this.id)
            });
        });
    }

    findFiles(album) {
        const result = this.db.collection(this.FILES_COLL).find({
            'metadata.album': album._id,
            'metadata.min': 'true'
        })
        return result;
    }

    download(id) {
        return this.bucket.openDownloadStream(ObjectId(id))
    }
    closeConnect() {
        this.client.close();
    }

}


module.exports = new GridFS;