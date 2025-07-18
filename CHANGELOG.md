# Changelog

All notable changes to the Zylla Chat project will be documented in this file.

## [Unreleased]

### Added
- Firebase integration for authentication and data storage
- Environment variables configuration with .env file
- User authentication flow (sign in, sign up, sign out)
- Google Sign-in integration
- Password reset functionality
- Protected routes for authenticated pages
- Real-time chat functionality with Firebase Firestore
- Chat conversations management with ability to create new conversations
- User profile management with display name support

### Changed
- SignIn component with Firebase authentication integration
- SignUp component with Firebase authentication and profile creation
- Chat component with Firebase Firestore for message storage
- Error handling with toast notifications for better user experience

### Security
- Implemented secure authentication with Firebase Auth
- Added email/password and Google authentication
- Environment variables for sensitive Firebase configuration
- Protected routes requiring authentication
- Password reset flow with email verification

## [0.1.0] - 2025-07-09

### Initial Release
- Basic UI components using shadcn/ui
- React Router setup for navigation
- Basic chat interface implementation
- Landing page design
- About page implementation
- Help page with FAQs
- Profile management page setup
- Responsive design for mobile and desktop

### Dependencies
- Added Firebase for authentication and database
- Added dotenv for environment variable management
- React Router for navigation
- shadcn/ui for UI components
- Tailwind CSS for styling

### Infrastructure
- Vite.js setup for development
- TypeScript configuration
- ESLint setup for code quality
- Project structure organization

## Planned Features
- User profile image upload
- Real-time typing indicators
- Message read receipts
- File sharing capabilities
- User presence indicators
- Chat search functionality