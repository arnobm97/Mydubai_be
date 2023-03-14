import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, EmbededUser } from "../core/IUserProvider";
import multiparty from "multiparty"
import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import fs from "fs";



export class FileController extends Controller {

    private config = require("../../config.json");


    public onRegister(): void {
        this.onGet("/file-drive", this.index, [Role.Admin, Role.Moderator]);
        this.onPost("/file-drive/upload", this.uploadFile, [Role.Admin, Role.Moderator]);
        this.onGet("/file-drive/delete/:file", this.deleteFile, [Role.Admin, Role.Moderator]);

        AWS.config.update({
            accessKeyId: this.config.awsS3.accessKeyId,
            secretAccessKey: this.config.awsS3.secretAccessKey,
            region: this.config.awsS3.region
        });
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Files";
        const s3 = new AWS.S3();
        const listParams: AWS.S3.ListObjectsV2Request = { Bucket: this.config.awsS3.bucket };
        try {
            const data = await s3.listObjectsV2(listParams).promise();
            const fileList = data.Contents.map(obj => ({
                name: obj.Key,
                size: obj.Size,
                LastModified: obj.LastModified
            }));
            res.bag.fileList = fileList;

            // return res.send(fileList);

            res.bag.flashMessage = req.flash('flashMessage');
            res.view('file/index');
        } catch (err) {
            res.bag.flashMessage = err;
            res.view('file/index');
        }

        
    }


    public async uploadFile(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const bucket = this.config.awsS3.bucket;
        const form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            if (err) {
                req.flash('flashMessage', err.message );
                res.redirect('/file-drive');
            }
            const file = files.file[0];
            const buffer = fs.readFileSync(files.file[0].path);
            const key = `${uuid()}-${file.originalFilename}`;
            const params = { Bucket: bucket, Key: key, Body: buffer, ContentType: file.headers['content-type'] };
            const s3 = new AWS.S3();
            s3.upload(params, function (error: any, data: any) {
                if (error) {
                    req.flash('flashMessage', error.message );
                    res.redirect('/file-drive');
                }
                req.flash('flashMessage',"File uploaded into cloud successfully.");
                res.redirect('/file-drive');
            });
        });
    }



    public async deleteFile(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const filePath = req.params.file;
        const bucket = this.config.awsS3.bucket;
        const params = {
            Bucket: bucket,
            Key: filePath,
        };
        const s3 = new AWS.S3();
        s3.deleteObject(params, (err: any, data: any) => {
            if (err) {
                req.flash('flashMessage',"`Error deleting file: ${err}`");
                res.redirect('/file-drive');
            } else {
                req.flash('flashMessage',"File deleted successfully");
                res.redirect('/file-drive');
            }
        });
    }




}