// firebase-services.js
// This file contains all your backend service functions

// Initialize Firestore
const db = firebase.firestore();

// User Profile Service
const UserService = {
    // Create user profile after signup
    async createUserProfile(userId, userData) {
        try {
            await db.collection('users').doc(userId).set({
                email: userData.email,
                displayName: userData.displayName || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                streak: 0,
                totalDays: 0,
                settings: {
                    theme: 'dark',
                    notifications: true
                }
            });
            console.log('User profile created');
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    },

    // Update user profile
    async updateUserProfile(userId, updates) {
        try {
            await db.collection('users').doc(userId).update({
                ...updates,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting profile:', error);
            return null;
        }
    }
};

// Streak Tracking Service
const StreakService = {
    // Update daily streak
    async updateStreak(userId) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) return;
            
            const userData = userDoc.data();
            const today = new Date().toDateString();
            const lastLogin = userData.lastLogin ? new Date(userData.lastLogin.toDate()).toDateString() : null;
            
            let newStreak = userData.streak || 0;
            
            if (lastLogin !== today) {
                // Check if consecutive day
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastLogin === yesterday.toDateString()) {
                    newStreak += 1;
                } else {
                    newStreak = 1; // Reset streak
                }
                
                // Update streak and total days
                await userRef.update({
                    streak: newStreak,
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    totalDays: firebase.firestore.FieldValue.increment(1)
                });
            }
            
            return newStreak;
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    },

    // Get user streak
    async getStreak(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            return userDoc.exists ? userDoc.data().streak || 0 : 0;
        } catch (error) {
            console.error('Error getting streak:', error);
            return 0;
        }
    }
};

// Learning Progress Service
const ProgressService = {
    // Add learning record
    async addProgress(userId, data) {
        try {
            await db.collection('progress').add({
                userId: userId,
                date: firebase.firestore.FieldValue.serverTimestamp(),
                topic: data.topic,
                hours: data.hours,
                notes: data.notes,
                completed: data.completed || false
            });
        } catch (error) {
            console.error('Error adding progress:', error);
        }
    },

    // Get user's learning history
    async getProgressHistory(userId, limit = 30) {
        try {
            const snapshot = await db.collection('progress')
                .where('userId', '==', userId)
                .orderBy('date', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting progress:', error);
            return [];
        }
    }
};

// Export services (if using modules)
// For now, they're globally available