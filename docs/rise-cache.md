[Table of Contents](../README.md)

---

# Rise Cache
[Rise Cache](https://github.com/Rise-Vision/rise-cache-v2) stores images and videos used in a Presentation to disk. We do this to prevent files from being downloaded repeatedly from the Server they are hosted on (e.g., Rise Storage), and make those files available offline.

There is no need to manually install Rise Cache as it is bundled with the Rise Vision Installer and auto starts with Rise Player.

If you run into a problem using Rise Cache [log a new issue](https://github.com/Rise-Vision/rise-cache-v2/issues/new).

## Where does Rise Cache save files?
A file in the process of being downloaded will be stored in `/rvplayer/RiseCache/download`. Once the download is finished the file is moved to `/rvplayer/RiseCache/cache`

_Note: File names are base encoded to prevent issues that could occur where two files (from different Servers) have the same name._

## How often are files updated?
Rise Cache will check for new file versions once every 20 minutes.

Rise Cache uses `etag` to determine if a newer file version by comparing the value of `etag` for the file it holds against the `etag` value the Server holds.

If the `etag` values are different Rise Cache will download the file again. If the `etag` values are the same, Rise Cache will not download the file and continue serving the version it already has.

If `etag` is not available, Rise Cache will follow the same process using `last-modified`.

If for whatever reason neiter `etag` or `last-modified` is available - Rise Cache will never download the file again unless it is deleted from disk.

## How can I see the `etag` or `last-modified` of a file?
Open Chrome Dev Tools and select the Network tab. Find the request for the file. One or both values will be shown in the Response Headers.

## How often are inactive files removed?
On startup a clean up job is ran to identify all files that have not been used in the last 7 days. Files matching the criteria are deleted.

## What type of request does Rise Cache support?
Request Type  | URL    
--            |---
Get Version   | `http://localhost:9494/`
Get File      | `http://localhost:9494/files?url=`
Get Metadata  | `http://localhost:9494/metadata?url=`

_Note: URL's above will fail if Rise Cache is not running on the machine the request is made from._



### Get Version Overview
The Get Version URL will can be used to confirm Rise Cache is running and the version of Rise Cache running. A response similar to the below will be provided

```
{"name":"rise-cache-v2","version":"1.0.0"}
```

If you do not get this response, Rise Cache is not running.



### Get File Overview
To request a file from Rise Cache append the url of the file you want to the the `Get File` url.

Rise Cache will respond with a 202 until the file is fully downloaded.



### Get Metadata Overview
To get the metadata of a file or folder on Rise Storage append the character encoded URL to the `Get Metadata` URL

Character encoded URL for a Folder: `https://storage-dot-rvaserver2.appspot.com/_ah/api/storage/v0.01/files?companyId={company_id}%26folder={folder_name}`

Character encoded URL for a File: `https://storage-dot-rvaserver2.appspot.com/_ah/api/storage/v0.01/files?companyId={company_id}%26file={file_name}`

### How does Rise Cache update to a new version?
Rise Cache is bundled with Rise Vision Installer. The version of Rise Cache included with the installer is determined by the version number specified in the package.json file of [rise-launcher-electron](https://github.com/Rise-Vision/rise-launcher-electron)

1. Merge a new version of rise cache to Master
2. Create a new branch called staging/my-feature-name from the this installer branch rise-cache-test
3. Changed the rise-cache-v2 version on the package.json
4. Commit and push.
5. Wait the build finishes on CCI and check what is the version(date and time)
6. Get the installer from cloud storage. A folder with the version of the built installer will be there.
