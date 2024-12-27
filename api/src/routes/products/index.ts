import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Product Listed');
});
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send('Product id is ' + id);
});
router.post('/', (req, res) => {
  res.send('Product created');
});

export default router;