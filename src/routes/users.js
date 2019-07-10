const express = require('express')
const router = express.Router()

const User = require('../models/User')
const passport = require('passport')

router.get('/ingresar', (req, res) => {
  res.render('users/login')
})

router.post('/ingresar', passport.authenticate('local', {
  successRedirect: '/notas',
  failureRedirect: '/ingresar',
  failureFlash: true
}))

router.get('/registrar', (req, res) => {
  res.render('users/register')
})

router.post('/registrar', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (name.length <= 0) {
    errors.push({ text: 'Ingresa un nombre' })
  }
  if (email.length <= 0) {
    errors.push({ text: 'Ingresa un correo electrónico' })
  }
  if (password !== confirmPassword | password.length <= 0 | confirmPassword.length <= 0) {
    errors.push({ text: 'Las contraseñas no coinciden' })
  }
  if (password.length > 4) {
    errors.push({ text: 'La contraseña tiene menos de 4 carácteres' })
  }
  if (errors.length > 0) {
    res.render('users/register', { errors, name, email, password, confirmPassword })
  } else {
    const emailUser = await User.findOne({ email: email })
    if (emailUser) {
      req.flash('error_msg', 'El correo ya está registrado')
      res.redirect('/ingresar')
    }
    const newUser = new User({ name, email, password })
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save()
    req.flash('success_msg', 'El usuario se ha registrado')
    res.redirect('/ingresar')
  }
})

router.get('/salir', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
