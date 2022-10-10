import { Readable, ReadableOptions } from 'stream'
import { S3 } from 'aws-sdk'

export class SmartStream extends Readable {
  _currentCursorPosition = 0 // Holds the current starting position for our range queries
  _s3DataRange = 1024 * 1024 * 2 // Amount of bytes to grab
  _maxContentLength: number // Total number of bites in the file
  _s3: S3
  _s3StreamParams: S3.GetObjectRequest // Parameters passed into s3.getObject method

  constructor(parameters: S3.GetObjectRequest, s3: S3, maxLength: number, nodeReadableStreamOptions?: ReadableOptions) {
    super(nodeReadableStreamOptions)
    this._maxContentLength = maxLength
    this._s3 = s3
    this._s3StreamParams = parameters
  }

  _read(): void {
    if (this._currentCursorPosition > this._maxContentLength) {
      this.push(null)
    } else {
      const range = this._currentCursorPosition + this._s3DataRange
      const adjustedRange = range < this._maxContentLength ? range : this._maxContentLength

      // Set the Range property on our s3 stream parameters
      this._s3StreamParams.Range = `bytes=${this._currentCursorPosition}-${adjustedRange}`

      // Update the current range beginning for the next go
      this._currentCursorPosition = adjustedRange + 1

      // Grab the range of bytes from the file
      this._s3.getObject(this._s3StreamParams, (error, data) => {
        if (error) {
          // If we encounter an error grabbing the bytes
          // We destroy the stream, NodeJS ReadableStream will emit the 'error' event
          this.destroy(error)
        } else {
          // We push the data into the stream buffer
          this.push(data.Body)
        }
      })
    }
  }
}
