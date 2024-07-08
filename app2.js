const express = require('express');
const { User } = require('./models');
const excelJS = require("exceljs");
const app = express();
const port = 3000;

app.use(express.json());

// Route to create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.get('/downloadUsers', async (req, res) => {
  try {
    const users = await User.findAll();
    const workbook = new excelJS.Workbook(); 
    const worksheet = workbook.addWorksheet("User");

    // Define columns in the worksheet 
    worksheet.columns = [ 
        { header: "Name", key: "name", width: 15 }, 
        { header: "Email", key: "email", width: 25 }, 
    ];

    // Add data to the worksheet 
    users.forEach(user => { worksheet.addRow(user); });

    // Set up the response headers 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "users.xlsx");

    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route to get a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { name, email } = req.body;
      user.name = name;
      user.email = email;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
