const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.showSignupForm = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/signup.html'));
}

exports.showLoginForm = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const [users] = await User.findAll({ where: { email } });
    if (!users[0]) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Renvoyer les informations de l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const [users] = await User.findAll({ where: { email } });
    if (users[0]) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const [newUser] = await User.create({
      nom,
      email,
      password: hashedPassword
    });

    // Créer un token JWT
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Renvoyer les informations de l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  // Le token JWT est invalide après la fermeture de session
  res.json({ message: 'Déconnecté' });
};