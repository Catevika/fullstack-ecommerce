import bcrypt from "bcryptjs";
import { eq } from 'drizzle-orm';
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from '../../db/index.js';
import { createUserSchema, loginSchema, usersTable } from '../../db/schema/usersSchema.js';
import { validateData } from '../../middlewares/validationMiddleware.js';

const router = Router();

const generateUserToken = (user: any) => {
  return jwt.sign({ userId: user.id, role: user.role }, 'your-secret', {
    expiresIn: '30d',
  });
};

router.post("/register", validateData(createUserSchema), async (req, res) => {
  try {
    const data = req.cleanBody;
    data.password = bcrypt.hashSync(data.password, 10);
    const [user] = await db.insert(usersTable).values(data).returning();
    const { password, ...userWithoutPassword } = user;
    const token = generateUserToken(user);
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).send("Something went wrong");
  };
});

router.post("/login", validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.cleanBody;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!user) {
      res.status(401).send("Authentication failed");
      return;
    }

    const matched = bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(401).send("Login failed");
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "30d" });

    const userWithoutPassword = { ...user, password: undefined };

    res.status(200).json({ token: token, user: userWithoutPassword });

  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

export default router;