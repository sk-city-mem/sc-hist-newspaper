import { S3, Endpoint } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export class FileUploadService {
  async upload(file) {
    const { originalname } = file;
    const bucketS3 = 'newspaperbucket';
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    await s3.createBucket(
      {
        Bucket: bucket,
      },
      (err, data) => {
        if (err) {
          Logger.error(err);
        }
      },
    );
    await s3.deleteObject(
      { Bucket: bucket, Key: '26 Haziran 1997 Perşembe Textless.pdf' },
      function (err, data) {
        if (err) console.log(err, err.stack); // error
        else console.log('succerss'); // deleted
      },
    );
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          writeFileSync('tempout/errlog.txt', Buffer.from(err.message));
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      region: 'eu-west-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: new Endpoint('http://localhost:4566/'),
      s3ForcePathStyle: true,
    });
  }
}
