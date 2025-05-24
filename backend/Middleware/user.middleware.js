import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import BlacklistToken from '../models/blacklistTokens.js';

async function authMiddleware(req, res, next) {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Remove 'Bearer ' prefix and get the token
            token = authHeader.split(' ')[1];
        } else {
            // Try to get token from cookies as fallback
            token = req.cookies?.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Check if token is blacklisted
        const blacklistedToken = await BlacklistToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({
            message: 'Invalid token',
            error: error.message
        });
    }
}

export default authMiddleware;

