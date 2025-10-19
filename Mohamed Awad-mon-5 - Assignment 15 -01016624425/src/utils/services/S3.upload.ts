import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream, ReadStream } from "fs";

interface putCommand extends PutObjectCommandInput {
  Body: string | Buffer | ReadStream;
}

export class s3_services {
  private s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  private key_folder = process.env.AWS_FOLDER as string;

  async getSignedUrl(key: string) {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
    });
    return await getSignedUrl(this.s3Client, getCommand, { expiresIn: 40 });
  }
  async upload_file(file: Express.Multer.File, key: string) {
    const key_name = `${this.key_folder}/${key}/${Date.now()}_${
      file.originalname
    }`;
    const params: putCommand = {
      Key: key_name,
      Bucket: process.env.AWS_S3_BUCKET as string,
      Body: createReadStream(file.path),
      ContentType: file.mimetype,
    };
    const putCommand = new PutObjectCommand(params);
    await this.s3Client.send(putCommand);
    return {
      Key: key_name,
    };
  }
  async upload_files(files: Express.Multer.File[], key: string) {
    let Urls: string[] = [];
    await Promise.all(
      files.map(async (file) => {
        const { Key } = await this.upload_file(file, key);
        Urls.push(Key);
      })
    );
    return Urls;
  }
  async deleteFile(key: string) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
    });
    return await this.s3Client.send(deleteCommand);
  }
  async deleteBUlk(keys: string[]) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });
    return await this.s3Client.send(deleteCommand);
  }
  async listderictory(path: string) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Prefix: `${this.key_folder}/${path}/`,
    });
    return await this.s3Client.send(command);
  }

  async deleteListderictory(path: string) {
    const files = await this.listderictory(path);
    const keys = files.Contents?.map((file) => file.Key as string) || [];
    return await this.deleteBUlk(keys);
  }
}
