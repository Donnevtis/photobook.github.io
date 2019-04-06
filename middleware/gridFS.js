const assert = require('assert');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const streamifier = require('streamifier');

//gridFS middleware
class GridFS {
    constructor() {
        this.FILES_COLL = 'photos.files';
        this.BUCKET_NAME = 'photos';
        this.client = new mongodb.MongoClient(process.env.URI, { useNewUrlParser: true });
    }
    connect() {
        return new Promise(resolve => {
            this.client.connect((error) => {
                assert.ifError(error);
                resolve(this.db = this.client.db());
            })
        })
    }
    getCursor(album) {
        return new Promise(resolve => {
            this.connect().then(db => resolve(db.collection(this.FILES_COLL).find({
                'metadata.album': album._id,
                'metadata.min': 'true'
            }, {
                sort: [
                    ['uploadDate', -1]
                ]
            })))
        })

    }

    download(id) {
        return new Promise(resolve => {
            this.connect().then(db => new mongodb.GridFSBucket(db, {
                bucketName: 'photos'
            })).then(bucket => {
                resolve(bucket.openDownloadStream(ObjectId(id)))
            })
            this.close();
        })
    }
    close() {
        this.client.close();
    }


}

// function getCursor(album) {
//     return new Promise(resolve => {
//         const client = new mongodb.MongoClient(process.env.URI, { useNewUrlParser: true });
//         client.connect(function(error) {
//             assert.ifError(error);
//             const db = client.db();
//             resolve(db.collection('photos.files').find({
//                 'metadata.album': album._id,
//                 'metadata.min': 'true'
//             }, {
//                 sort: [
//                     ['uploadDate', -1]
//                 ]
//             }))
//         });
//         client.close()
//     })

// }

function send(name, file, data) {
    return new Promise(resolve => {
        console.log('checks');
        const client = new mongodb.MongoClient(process.env.URI, { useNewUrlParser: true });
        client.connect((error) => {
            const db = client.db();
            const bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'photos'
            });
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




module.exports = GridFS;
module.exports.send = send;