import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [];
const port = 3000;

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

app.post("/users", (req: Request, res: Response) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.get("/users/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

app.put("/users/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  user.name = req.body.name;
  user.email = req.body.email;
  res.json(user);
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  users.splice(users.indexOf(user), 1);
  res.json(user);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
