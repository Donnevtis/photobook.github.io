const assert = require('assert');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const streamifier = require('streamifier');

//gridFS middleware
class GridFS {
    constructor() {
        console.log('check');
        this.client = new mongodb.MongoClient(process.env.URI, { useNewUrlParser: true });
        this.FILES_COLL = 'photos.files';
        this.client.connect((error) => {
            this.db = this.client.db();
            this.bucket = new mongodb.GridFSBucket(this.db, {
                bucketName: 'photos'
            });
            this.collection = this.db.collection(this.FILES_COLL)
        })
    }

    async sendFile(name, file, data) {
        this.t = Date.now();
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
            on('finish', () => {
                console.log('done!', (Date.now() - this.t));
                resolve(this.id)

            });
        });
    }

    findFiles(album) {
        const result = this.db.collection(this.FILES_COLL).find({
            'metadata.album': album._id,
            'metadata.min': 'true'
        }, {
            sort: [
                ['uploadDate', -1]
            ]
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

function send(name, file, data) {
    return new Promise(resolve => {
        console.log('checks');
        const client = new mongodb.MongoClient(process.env.URI, { useNewUrlParser: true });
        const FILES_COLL = 'photos.files';
        client.connect((error) => {
            const db = client.db();
            const bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'photos'
            });
            const collection = db.collection(FILES_COLL)
            let t = Date.now();
            const uploadStream = bucket.openUploadStream(name, {
                metadata: data
            })
            const id = uploadStream.id;

            streamifier.createReadStream(file).
            pipe(uploadStream).
            on('error', function(error) {
                assert.ifError(error);
            }).
            on('finish', () => {
                console.log('done!', (Date.now() - t));
                resolve(id)
            });
        });
        client.close()
    });
}




module.exports = new GridFS;
module.exports.send = send;