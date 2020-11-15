'use strict'
const { ObjectID } = require('mongodb')
const connectDb = require('./db')
const errorHandler = require('./errorHandler')

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: '',
      topic: '',
      level: ''
    }

    const newCourse = Object.assign(defaults, input)
    let db
    let course
    try {
      db = await connectDb()
      course = await db.collection('courses').insertOne(newCourse)
      newCourse._id = course.insertedId
    } catch (error) {
      errorHandler(error)
    }

    return newCourse
  },
  createPerson: async (root, { input }) => {

    let db
    let student
    try {
      db = await connectDb()
      student = await db.collection('students').insertOne(input)
      input._id = student.insertedId
    } catch (error) {
      errorHandler(error)
    }

    return input
  },
  editCourse: async (root, { _id, input }) => {
    let db
    let course
    try {
      db = await connectDb()
      await db.collection('courses').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      course = await db.collection('courses').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error)
    }

    return course
  },

  deleteCourse: async (root, { _id }) => {
    let db
    let deleteCourse
    try {
      db = await connectDb()

      deleteCourse = await db.collection('courses').deleteOne({ _id: ObjectID(_id) })
    } catch (error) {
      errorHandler(error)
    }

    return deleteCourse.deletedCount = 1 ? 'Deleted' : 'Not deleted'
  },
  editPerson: async (root, { _id, input }) => {
    let db
    let students
    try {
      db = await connectDb()
      await db.collection('students').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      students = await db.collection('students').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error)
    }

    return students
  },
  deletePerson: async (root, { _id }) => {
    let db
    let deleteStudent
    try {
      db = await connectDb()

      deleteStudent = await db.collection('students').deleteOne({ _id: ObjectID(_id) })
    } catch (error) {
      errorHandler(error)
    }

    return deleteStudent.deletedCount = 1 ? 'Deleted' : 'Not deleted'
  },
  addPeople: async (root, { courseID, personID }) => {
    let db
    let person
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').findOne(
        { _id: ObjectID(courseID) }
      )

      person = await db.collection('students').findOne(
        { _id: ObjectID(personID) }
      )

      if (!course || !person) throw new Error('The person or course no existe')
      await db.collection('courses').updateOne(
        { _id: ObjectID(courseID) },
        { $addToSet: { people: ObjectID(personID) } }
      )
    } catch (error) {
      errorHandler(error)
    }

    return course
  }
}