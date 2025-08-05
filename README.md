# Strik - Football Trivia Game

A modern, engaging football/soccer trivia game built with Next.js 14, featuring streak-based gameplay, smooth animations, and mobile-first design.

## 🎯 Features

- **Streak-Based Gameplay**: Build the longest streak of correct answers possible
- **Timed Questions**: Each question has a 30-second time limit with visual countdown
- **Smart Answer System**: Fuzzy matching with autocomplete suggestions
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Football-Themed**: Custom color palette and design inspired by football/soccer
- **Accessibility**: WCAG compliant with screen reader support
- **Leaderboard**: Track your best streaks and compete with others
- **Progressive Difficulty**: Questions adapt to your performance level

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd strik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom football-themed design system
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Next.js built-in bundler

## 📱 Game Modes

### Streak Mode (Primary)
- Answer questions correctly to build your streak
- Each wrong answer or timeout ends the game
- Progressive difficulty increases every 10 questions
- Milestone celebrations at 5, 10, 20, and 50+ streaks

### Practice Mode (Future)
- No pressure gameplay for learning
- Unlimited attempts per question
- Detailed explanations for answers

## 🎮 How to Play

1. **Start Game**: Click "Start Game" on the home screen
2. **Read Question**: Each question asks about football players, teams, or history
3. **Type Answer**: Use the autocomplete suggestions to help with spelling
4. **Submit**: Hit Enter or click "Submit Answer"
5. **Build Streak**: Correct answers increase your streak counter
6. **Stay Alert**: You have 30 seconds per question
7. **Game Over**: One wrong answer ends your streak
8. **Compete**: Try to beat your personal best and climb the leaderboard

## 🏗 Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
│   ├── game/           # Game page
│   ├── leaderboard/    # Leaderboard page
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── game/          # Game-specific components
│   └── ui/            # Reusable UI components
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
├── lib/               # Utility functions
└── data/              # Sample data and questions
```

## 🎨 Design System

### Colors
- **Field Green**: Primary brand color inspired by football pitches
- **Pitch Gray**: Secondary colors for backgrounds and text
- **Status Colors**: Green for correct, red for incorrect, orange for warnings

### Typography
- **Font**: Inter for modern, readable text
- **Sizes**: Responsive typography scale from mobile to desktop

### Components
- **Question Cards**: Clean, focused layout with difficulty indicators
- **Timer**: Circular progress indicator with warning states
- **Streak Counter**: Animated counter with milestone celebrations
- **Buttons**: Touch-friendly with hover and active states

## 🌐 Accessibility Features

- **WCAG 2.1 AA Compliant**: Proper contrast ratios and focus indicators
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Clear visual hierarchy and readable text

## 📊 Performance

- **Core Web Vitals**: Optimized for excellent performance scores
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Size**: Minimal bundle size with tree-shaking
- **Caching**: Efficient caching strategies for static assets

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t strik .
docker run -p 3000:3000 strik
```

### Static Export
```bash
npm run build
npm run export
```

## 🎯 Future Enhancements

- **Multiplayer Mode**: Real-time 1v1 competitions
- **Tournament System**: Bracket-style competitions
- **User Accounts**: Registration and persistent profiles
- **Social Features**: Friend challenges and sharing
- **More Question Types**: Images, multiple choice, true/false
- **League-Specific Modes**: Premier League, La Liga, etc.
- **Mobile App**: React Native version for app stores
- **Voice Answers**: Speech recognition for hands-free play

## 🏆 Game Statistics

Track your progress with detailed statistics:
- **Best Streak**: Your highest consecutive correct answers
- **Total Games**: Number of games played
- **Accuracy Rate**: Percentage of questions answered correctly
- **Average Answer Time**: How quickly you respond
- **Categories Mastered**: Your strongest knowledge areas

## 📱 Mobile Experience

Strik is designed mobile-first with:
- **One-handed play**: Easy thumb navigation
- **Touch-friendly controls**: Large, accessible buttons
- **Responsive typography**: Optimal reading on any screen size
- **Smooth animations**: 60fps performance on mobile devices
- **Battery optimized**: Efficient rendering and minimal background activity

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables
Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📈 Analytics & Monitoring

Future integration planned for:
- **User Analytics**: Track engagement and retention
- **Performance Monitoring**: Real-time performance metrics
- **Error Tracking**: Automatic error reporting and debugging
- **A/B Testing**: Optimize user experience through testing

## 💡 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏅 Acknowledgments

- Football data and trivia questions curated from public sources
- Icons from Lucide React
- Design inspiration from modern sports applications
- Performance optimizations from Next.js best practices

---

**Ready to test your football knowledge? Start your streak now!** ⚽🏆