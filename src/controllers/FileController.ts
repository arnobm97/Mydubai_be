import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, EmbededUser } from "../core/IUserProvider";
import multiparty from "multiparty"
import { v4 } from 'uuid';
import AWS from 'aws-sdk';
import fs from "fs";
import { IFolderProvider, IFolder, IFolderPage } from "../core/IFolderProvider";
import { IFileProvider, IFile } from "../core/IFileProvider";
import  FileModel  from "../models/FileModel";

export class FileController extends Controller {

    private config = require(`../../${(process.env.NODE_ENV || 'development') === 'production' ? "config.prod.json" : "config.dev.json"}`);
    private FolderProvider: IFolderProvider;
    private FileProvider: IFileProvider;

    public onRegister(): void {
        this.onGet("/file-drive", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/file-drive/new-folder", this.newFolder, [Role.Admin, Role.Moderator]);
        this.onGet("/file-drive/explore/:folderId", this.exploreFolder, [Role.Admin, Role.Moderator]);
        this.onPost("/file-drive/new-folder", this.newFolder, [Role.Admin, Role.Moderator]);
        this.onPost("/file-drive/upload/:folderId", this.uploadFile, [Role.Admin, Role.Moderator]);
        this.onGet("/file-drive/delete/:file/:fileId/:folderId", this.deleteFile, [Role.Admin, Role.Moderator]);
        this.onGet("/files/:folderId", this.files, [Role.Admin, Role.Moderator]);

        AWS.config.update({
            accessKeyId: this.config.awsS3.accessKeyId,
            secretAccessKey: this.config.awsS3.secretAccessKey,
            region: this.config.awsS3.region
        });
    }

    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        // const createBy = { id: req.user.id, fullName: req.user.name };
        // await this.FolderProvider.create('Elegent Fire', 'Test Remarks', createBy);
        res.bag.pageTitle = this.config.appTitle+" | Folders";
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 18;
        const folderPage: IFolderPage  = await this.FolderProvider.list( page, size );
        // return res.send(folderPage);
        res.bag.folderPage = folderPage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('folder/index');
    }

    public async newFolder(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | New Folder";
        if(req.method === "GET"){
            res.view('folder/create');
        }else if(req.method === "POST"){
            const folderName = req.body.folderName;
            const remarks = req.body.remarks;
            if (!folderName) {
                res.bag.errorMessage = "Property folder name is required";
                return res.view('file-drive/new-folder')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.FolderProvider.create(folderName, remarks, user);
                req.flash('flashMessage', 'New folder created successfully.');
                res.redirect('/file-drive');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('folder/create');
        }
    }

    public async exploreFolder(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Explore Folder";
        const folder = await this.FolderProvider.get(req.params.folderId);

        try {
            const files = await this.FileProvider.getByFolderId(req.params.folderId);
            if (folder) {
                res.bag.folder = folder;
                res.bag.files = files;
                res.view('folder/explore');
            } else {
                res.bag.flashMessage = "Unable to find folder";
                res.view('folder/index');
            }
        } catch(e) {
            console.log('err: ', e);
        }
    }

    public async uploadFile(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        console.log('Uploading file...');
        const bucket = this.config.awsS3.bucket;
        const form = new multiparty.Form();
        console.log('folderId: ', req.params.folderId);

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error('Error parsing form:', err.message);
                req.flash('flashMessage', err.message);
                return res.redirect('/file-drive');
            }

            const file = files.file[0];
            console.log(`File received: ${file.originalFilename}, size: ${file.size} bytes`);

            const buffer = fs.readFileSync(file.path);
            const key = `${v4()}-${file.originalFilename}`;
            const params = { Bucket: bucket, Key: key, Body: buffer, ContentType: file.headers['content-type'] };
            const s3 = new AWS.S3();

            console.log(`Uploading file to S3 with key: ${key}`);

            s3.upload(params, function (error: any, data: any) {
                if (error) {
                    console.error('S3 upload error:', error.message);
                    req.flash('flashMessage', error.message);
                    return res.redirect('/file-drive');
                }

                console.log(`File uploaded successfully. S3 Location: ${data.Location}`);

                const folderId = req.params.folderId;
                if (folderId && data) {
                    console.log(`Saving file metadata to database for folderId: ${folderId}`);

                    const user: EmbededUser = { id: req.user.id, fullName: req.user.name };
                    const newFile: IFile = new FileModel();
                    newFile.folderId = folderId;
                    newFile.location = data.Location;
                    newFile.fileName = data.key;
                    newFile.createBy = user;

                    newFile.save()
                        .then(() => {
                            console.log('File metadata saved successfully.');
                            req.flash('flashMessage', "File uploaded into cloud successfully.");
                            console.log('redirect: ', '/file-drive/explore/' + folderId);
                            res.redirect('/file-drive/explore/' + folderId);
                        })
                        .catch((saveError) => {
                            console.error('Error saving file to database:', saveError.message);
                            req.flash('flashMessage', "Error saving file to database: " + saveError.message);
                            res.redirect('/file-drive');
                        });
                } else {
                    console.error('Folder ID is missing or S3 upload failed.');
                    req.flash('flashMessage', "File uploading failed.");
                    res.redirect('/file-drive');
                }
            });
        });
    }

    public async deleteFile(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const filePath = req.params.file;
        const fileId = req.params.fileId;
        const folderId = req.params.folderId;
        const bucket = this.config.awsS3.bucket;
        const params = {
            Bucket: bucket,
            Key: filePath,
        };
        const s3 = new AWS.S3();
        s3.deleteObject(params, async (err: any, data: any) => {
            if (err) {
                req.flash('flashMessage',"`Error deleting file: ${err}`");
                res.redirect('/file-drive/explore'+folderId);
            } else {
                await this.FileProvider.delete(fileId);
                req.flash('flashMessage',"File deleted successfully");
                res.redirect('/file-drive/explore/'+folderId);
            }
        });
    }

    public async files(req: HttpRequest, res: HttpResponse, next: NextFunc) {
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

            fileList.forEach(async element => {
                const fileName = element.name;
                const location = 'https://propertyseeker.s3.me-central-1.amazonaws.com/'+element.name
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.FileProvider.create(req.params.folderId,location,fileName,user);
            });

            res.bag.flashMessage = req.flash('flashMessage');
            res.view('file/index');
        } catch (err) {
            console.log(err);
            res.bag.flashMessage = err;
            res.view('file/index');
        }
    }
}