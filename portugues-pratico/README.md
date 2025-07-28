# Português Prático: Conjugation Trainer

A Progressive Web App (PWA) designed to help users master Portuguese verb conjugations through interactive quizzes.

## Features

### Core Functionality

- **Interactive Quiz System**: Practice Portuguese verb conjugations by completing verb endings
- **Customizable Practice**: Select specific pronouns, tenses, and verb types to focus your learning
- **Real-time Feedback**: Get immediate feedback on your answers with correct solutions
- **Progress Tracking**: Monitor your score and accuracy as you practice
- **Offline Support**: Works offline thanks to PWA capabilities

### Quiz Customization

- **Pronouns**: Choose from eu, tu, você, nós, vós, vocês
- **Tenses & Moods**:
  - Indicative: Present, Preterite, Imperfect, Future, Conditional
  - Subjunctive: Present, Imperfect, Future
  - Imperative
- **Verb Regularity**: Practice with all verbs, regular verbs only, or irregular verbs only

### PWA Features

- **Installable**: Add to your home screen for easy access
- **Offline Functionality**: Continue practicing without internet connection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React Context API
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin
- **Development**: Hot Module Replacement (HMR)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd portugues-pratico
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── QuizView.tsx    # Main quiz interface
│   ├── QuestionCard.tsx # Question display component
│   ├── Scoreboard.tsx  # Score tracking component
│   ├── Feedback.tsx    # Answer feedback component
│   ├── SettingsView.tsx # Settings interface
│   ├── PronounSelector.tsx # Pronoun selection
│   ├── TenseSelector.tsx # Tense/mood selection
│   └── RegularitySelector.tsx # Verb regularity selection
├── context/            # React Context providers
│   ├── SettingsProvider.tsx # Quiz settings state
│   ├── QuizProvider.tsx # Quiz state management
│   ├── useSettings.ts  # Settings hook
│   └── useQuiz.ts      # Quiz hook
├── data/               # Static data
│   └── verbs.json      # Portuguese verb database
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── utils/              # Utility functions
│   └── quizUtils.ts    # Quiz generation logic
└── App.tsx             # Main application component
```

## Verb Data Structure

The app includes a comprehensive database of Portuguese verbs with their conjugations:

```typescript
interface Verb {
  verb: string; // Infinitive form
  infinitive: string; // Infinitive form
  translation: string; // English translation
  regularity: "regular" | "irregular";
  irregular_category?: string[];
  conjugations: {
    [tense: string]: {
      [pronoun: string]: string;
    };
  };
}
```

## Available Verbs

The app includes both regular and irregular verbs:

### Regular Verbs

- **falar** (to speak) - -ar conjugation
- **comer** (to eat) - -er conjugation
- **partir** (to leave) - -ir conjugation

### Irregular Verbs

- **ser** (to be) - Highly irregular
- **ter** (to have) - Highly irregular
- **ir** (to go) - Highly irregular
- **estar** (to be) - Stem-changing
- **fazer** (to do/make) - Highly irregular
- **dizer** (to say) - Highly irregular
- **ver** (to see) - Highly irregular

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- **Audio Pronunciation**: Text-to-speech for verb pronunciations
- **User Accounts**: Save progress and settings
- **Spaced Repetition**: Algorithm to show difficult verbs more frequently
- **Gamification**: Achievements, streaks, and leaderboards
- **More Content**: Additional verbs and complex tenses
- **Example Sentences**: Contextual usage examples

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Portuguese language experts for verb conjugation data
- React and Vite communities for excellent tooling
- PWA community for progressive web app standards
