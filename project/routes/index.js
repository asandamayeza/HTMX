const express = require('express');

const router = express.Router();

const verses = [
  { id: 1, emotion: 'Depressed', scripture: 'Psalm 27' },
  { id: 2, emotion: 'Lonely', scripture: 'Psalm 23' },
  { id: 3, emotion: 'Discouraged', scripture: 'Joshua 1' },
  { id: 4, emotion: 'Weak', scripture: 'Psalm 18:1-29' },
  { id: 5, emotion: 'Need Direction', scripture: 'Psalm 73: 21-26' },
  { id: 6, emotion: 'Anxious', scripture: 'Philippians 4:4-9' },
  { id: 7, emotion: 'Struggling with Loss', scripture: 'Luke 15' },
  { id: 8, emotion: 'Lack of Faith', scripture: 'Exodus 14'},
  { id: 9, emotion: 'Sinned', scripture: 'Psalm 51' },
  { id: 10, emotion: 'Seeking Peace', scripture: 'Matthew 11:25-30' },
];

// GET /verses
router.get('/verses', (req, res) => {
  res.render('index', { action: '', verses, verse: {} });
});

// GET /verses/new
router.get('/verses/new', (req, res) => {
  if (req.headers['hx-request']) {
    res.render('form', { verse: {} });
  } else {
    res.render('index', { action: 'new', verses, verse: {} });
  }
});

// GET /verses/1
router.get('/verses/:id', (req, res) => {
  const { id } = req.params;
  const verse = verses.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('verse', { verse });
  } else {
    res.render('index', { action: 'show', verses, verse });
  }
});

// GET /contacts/1/edit
router.get('/verses/:id/edit', (req, res) => {
  const { id } = req.params;
  const verse = verses.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('form', { verse });
  } else {
    res.render('index', { action: 'edit', verses, verse});
  }
});

// POST /verses
router.post('/verses', (req, res) => {
  const newverse = {
    id: verses.length + 1,
    emotion: req.body.emotion,
    scripture: req.body.scripture,
  };

  verses.push(newverse);

  if (req.headers['hx-request']) {
    res.render('sidebar', { verses }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="afterbegin">
          <p class="flash">Verse was successfully added!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.render('index', { action: 'new', verses, verse: {} });
  }
});

// PUT /contacts/1
router.put('/update/:id', (req, res) => {
  const { id } = req.params;

  const newverse = {
    id: Number(id),
    emotion: req.body.emotion,
    scripture: req.body.scripture,
  };

  const index = verses.findIndex((c) => c.id === Number(id));

  if (index !== -1) verses[index] = newverse;

  if (req.headers['hx-request']) {
    res.render('sidebar', { verses }, (err, sidebarHtml) => {
      res.render('verse', { verse: verses[index] }, (err, verseHTML) => {
        const html = `
          ${sidebarHtml}
          <main id="content" hx-swap-oob="true">
            <p class="flash">Verse was successfully updated!</p>
            ${verseHTML}
          </main>
        `;

        res.send(html);
      });
    });
  } else {
    res.redirect(`/verses/${index + 1}`);
  }
});

// DELETE /contacts/1
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const index = verses.findIndex((c) => c.id === Number(id));

  if (index !== -1) verses.splice(index, 1);
  if (req.headers['hx-request']) {
    res.render('sidebar', { verses }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="true">
          <p class="flash">Emotion was successfully deleted!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.redirect('/verses');
  }
});

module.exports = router;