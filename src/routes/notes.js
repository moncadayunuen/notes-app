const express = require('express')
const router = express.Router()

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/nueva-nota', isAuthenticated, (req, res) => {
  res.render('notes/new-note')
})

router.post('/nueva-nota', isAuthenticated, async (req, res) => {
  const { title, description } = req.body
  const errors = []

  if (!title) {
    errors.push({ text: 'Por favor, escribe un titulo para la nota' })
  }
  if (!description) {
    errors.push({ text: 'Por favor, describe algo sobre tu nota' })
  }
  if (errors.length > 0) {
    res.render('notes/new-note')
  } else {
    const newNote = new Note({ title, description })
    newNote.user = req.user.id
    await newNote.save()
    req.flash('success_msg', 'Nota creada')
    res.redirect('/notas')
  }
})

router.get('/notas', isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' })
  res.render('notes/notes', { notes })
})

router.get('/editar-nota/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit-note', { note })
})

router.put('/editar-nota/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body
  await Note.findByIdAndUpdate(req.params.id, { title, description })
  req.flash('success_msg', 'Nota modificada')
  res.redirect('/notas')
})

router.delete('/eliminar-nota/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body
  await Note.findByIdAndDelete(req.params.id, { title, description })
  req.flash('success_msg', 'Nota eliminada')
  res.redirect('/notas')
})

module.exports = router
