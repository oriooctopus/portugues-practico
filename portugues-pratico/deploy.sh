#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Commit any changes
echo "💾 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌍 Your site will be available at: https://oriooctopus.github.io/portugues-practico"
