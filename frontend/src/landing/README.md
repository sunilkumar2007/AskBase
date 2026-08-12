# Standalone Auth, Login & 3D Animated Landing Module (`ddiff`)

This extracted folder contains the complete, reusable **3D Animated Landing Page**, **Login Screen**, and **Authentication System** from AskBase ready to be copied directly into any React, Vite, or Next.js project.

## 📁 Directory Structure
```
ddiff/
├── 3d/
│   ├── Scene.tsx             # WebGL 3D Canvas environment
│   ├── IntelligenceCore.tsx  # 3D Database cylinder & torus ring mesh
│   └── SchemaWorld.tsx       # 3D Table node graph & pulse connections
├── LandingPage.tsx           # Full 3D animated landing page
├── HeroIntelligenceCore.tsx  # Interactive central orb & word particles
├── FloatingUI.tsx            # Floating hero title & stage cards
├── AnimationStates.tsx       # SQL overlays & data cards
├── LoginPage.tsx             # Full-page standalone login screen
├── AuthModal.tsx             # Modal login & signup dialog
├── AskBaseLogo.tsx           # Brand logo component
├── authService.ts            # Auth API service adapter
├── useAuthStore.ts           # Zustand local auth state store
├── index.ts                  # Unified exports
└── README.md                 # Usage instructions
```

## 🚀 Required Dependencies
When moving this module to a new project, ensure the following npm packages are installed:
```bash
npm install three @react-three/fiber @react-three/drei framer-motion zustand lucide-react
npm install --save-dev @types/three
```

## 💡 How to Use in Another Project

### 1. Import Full 3D Animated Landing Page Component
```tsx
import { LandingPage } from './ddiff';

export default function App() {
  return (
    <LandingPage
      onLoginSuccess={() => console.log('Logged in successfully!')}
    />
  );
}
```

### 2. Import Full-Page Login Component
```tsx
import { LoginPage } from './ddiff';

export default function LoginRoute() {
  return (
    <LoginPage
      onSuccess={() => console.log('Successfully logged in!')}
      onSignUpClick={() => console.log('Navigate to sign up')}
    />
  );
}
```

### 3. Check Auth State Anywhere
```tsx
import { useAuthStore } from './ddiff';

function UserProfile() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```
