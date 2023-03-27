import { S3, Endpoint } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export class FileUploadService {
  constructor(private readonly s3: S3) {}
  async upload(file) {
    const { originalname } = file;
    const bucketS3 = 'newspaperbucket';
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }
  async createBucket(bucket: string) {
    await this.s3.createBucket(
      {
        Bucket: bucket,
      },
      (err, data) => {
        if (err) {
          Logger.error(err);
        }
        Logger.log('Bucket created: ', bucket);
      },
    );
  }

  async uploadS3(file, bucket, name) {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          writeFileSync('tempout/errlog.txt', Buffer.from(err.message));
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async deleteFormS3(bucket, key) {
    await this.s3.deleteObject(
      { Bucket: bucket, Key: key },
      function (err, data) {
        if (err) Logger.error(err); // error
        else Logger.log(bucket, 'Succesfully deleted', key); // deleted
      },
    );
  }
}
