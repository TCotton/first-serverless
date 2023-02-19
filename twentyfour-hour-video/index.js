'use strict'

const AWS = require('aws-sdk')
const convertMedia = new AWS.MediaConvert({
    endpoint: process.env.MEDIA_CONVERT_ENDPOINT,
})
const outputBucketName = process.env.TRANSCODED_VIDEO_BUCKET

exports.default = async (event, context) => {
    const key = event.Records[0].s3.object.key
    const sourceKey = decodeURIComponent(key.replace(/\+/g, ' '))
    const outputKey = sourceKey.split('.')[0]
    const input = 's3://' + event.Records[0].s3.bucket.name + '/' + event.Records[0].s3.object.key
    const output = 's3://' + outputBucketName + '/' + outputKey + '/'

    try {
        const job = {
            "Role": process.env.MEDIA_CONVERT_ROLE,
            "Settings": {
                "Inputs": [
                    {
                        "FileInput": input,
                        "AudioSelectors": {
                            "Audio Selector 1": {
                                "SelectorType": "TRACK",
                                "Tracks": [
                                    1
                                ]
                            }
                        }
                    }
                ],
                "OutputGroups": [
                    {
                        "Name": "File Group",
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                "Destination": output
                            }
                        }
                    }
                ]
            }

        }
    } catch (error) {
        console.log(error)
    }
}