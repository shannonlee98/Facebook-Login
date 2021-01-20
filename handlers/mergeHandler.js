

function mergeAccountHandler(req, res) {
  if (localStorage.existing == 'facebook') {
    res.render('merge', { accountType: 'facebook' })
  } else if (localStorage.existing == 'local') {
    res.render('merge', { accountType: 'local' })
  } else {
    res.send('wrong merge')
  }
}

module.exports = {
  mergeAccountHandler
}