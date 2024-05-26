const express = require('express');
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

let users = []; // In-memory array to store users

// Define the schema for user validation
const userSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required()
});

// Define the schema for partial user update validation
const userUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email()
});

// Create a new user
app.post('/users', (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    users.push(value);
    res.status(201).send(value);
});

// Get all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    console.log('users::', users)
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('User not found => ' + userId);
    }
});

// Route to handle PATCH request to update user partially
app.patch('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { error, value } = userUpdateSchema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }

    // Update only the fields that are provided
    users[userIndex] = { ...users[userIndex], ...value };

    res.status(200).send(users[userIndex]);
});

// Route to handle PUT request to update or create user
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { error, value } = userSchema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        // If user does not exist, create a new user
        users.push(value);
        return res.status(201).send(value);
    }

    // Update the existing user
    users[userIndex] = value;
    res.status(200).send(users[userIndex]);
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        res.status(200).json(deletedUser);
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
