const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// إعداد الاتصال بقاعدة البيانات MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '946729', // ضع هنا كلمة المرور الخاصة بك
  database: 'zinino_shop'
});

db.connect((err) => {
  if (err) {
    console.error('خطأ في الاتصال بقاعدة البيانات: ' + err.stack);
    return;
  }
  console.log('تم الاتصال بقاعدة البيانات MySQL');
});

// Middleware لتحليل البيانات القادمة من الطلبات
app.use(bodyParser.json());

// API لجلب عدد الإعجابات باستخدام معرّف المنتج
app.get('/likes/:productId', (req, res) => {
  const productId = req.params.productId;
  db.query('SELECT likes_count FROM product_likes WHERE product_id = ?', [productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'خطأ في استرجاع البيانات' });
      return;
    }
    if (results.length > 0) {
      res.json({ likes_count: results[0].likes_count });
    } else {
      // إذا لم يكن هناك بيانات للإعجاب، إرجاع 0
      res.json({ likes_count: 0 });
    }
  });
});

// API لتحديث عدد الإعجابات باستخدام معرّف المنتج
app.post('/like', (req, res) => {
  const { productId } = req.body;
  db.query('SELECT likes_count FROM product_likes WHERE product_id = ?', [productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'خطأ في استرجاع البيانات' });
      return;
    }
    let newLikesCount = 1; // إذا لم يكن هناك بيانات للإعجاب، نبدأ من 1
    if (results.length > 0) {
      newLikesCount = results[0].likes_count + 1; // زيادة الإعجاب
    }
    db.query('INSERT INTO product_likes (product_id, likes_count) VALUES (?, ?) ON DUPLICATE KEY UPDATE likes_count = ?', 
      [productId, newLikesCount, newLikesCount], (err) => {
        if (err) {
          res.status(500).json({ error: 'خطأ في تحديث البيانات' });
          return;
        }
        res.json({ likes_count: newLikesCount });
      });
  });
});

app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});
