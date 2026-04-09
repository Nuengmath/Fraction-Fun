# Fraction Fun 🐾

An interactive and colorful math game for kids to practice fraction operations with real-time feedback and scoring.

## 🚀 Deployment Instructions

### 1. GitHub Sync
To sync this project with GitHub:
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local directory as a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Link to your GitHub repository:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### 2. Netlify Deployment
To deploy this app to [Netlify](https://www.netlify.com/):
1. Log in to your Netlify account.
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select **GitHub** and authorize Netlify to access your repository.
4. Select the `fraction-fun` repository.
5. Configure the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **Important:** Go to **Site settings** -> **Environment variables** and add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
7. Click **"Deploy site"**.

## 🛠 Tech Stack
- **React 19** + **Vite**
- **Tailwind CSS** (Styling)
- **Motion** (Animations)
- **Lucide React** (Icons)
- **TypeScript**

## 📝 Features
- Dynamic fraction problem generation.
- Automatic fraction simplification logic.
- Mascot-themed UI with animated backgrounds.
- High score and lives system.
