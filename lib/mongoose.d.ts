import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Mongoose> | null
  } | undefined
}

export {}
