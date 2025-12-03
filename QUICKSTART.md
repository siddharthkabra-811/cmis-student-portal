# Quick Start Guide - CMIS Student Portal

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

---

## 🔑 Login Credentials

Use these credentials to access the portal:

```
Email: john.smith@tamu.edu
Password: password123
```

---

## 📱 What to Explore

### 1. **Login Page** (/)
- Enter the demo credentials above
- Click "Sign In"

### 2. **Dashboard** (/dashboard)
- View the registration banner (user is already registered)
- Browse the event carousel
- Click on quick links

### 3. **Events** (/events)
- See upcoming and past events
- Click "Register" on any event
- Click "Details" to see full event information

### 4. **Profile** (/profile)
- View complete student profile
- See mentor information
- Check activity log
- Click "Edit Profile" to make changes

### 5. **Notifications** (/notifications)
- Filter notifications by type
- Mark notifications as read
- Click action buttons to navigate to related content

### 6. **Registration** (/register)
- Fill out the comprehensive registration form
- Test the multi-select fields
- Submit to see success notification

---

## 🎯 Key Features to Test

### Navigation
- ✅ Click between pages using the top navigation
- ✅ Notice unread notification count badge
- ✅ Use the user menu dropdown

### Carousel
- ✅ Auto-plays every 5 seconds
- ✅ Click left/right arrows to navigate
- ✅ Click dots to jump to specific slides
- ✅ Swipe on mobile devices

### Event Registration
1. Go to Events page
2. Click "Register" on any upcoming event
3. Check Notifications - new confirmation appears
4. Return to Events - button shows "✓ Registered"

### Notifications
1. Go to Notifications page
2. Try different filter options
3. Click notification card to expand
4. Mark as read/unread
5. Delete notifications

### Profile Editing
1. Go to Profile page
2. Click "Edit Profile"
3. Update bio or other fields
4. Click "Save Changes"

### Logout & Re-login
1. Click user menu (top right)
2. Click "Sign Out"
3. You'll be redirected to login page
4. Log back in with demo credentials

---

## 🎨 Responsive Design

Test the responsive layout:

### Desktop (1280px+)
- 3-column event grid
- 2-column dashboard layout
- Full navigation with links

### Tablet (768px - 1279px)
- 2-column event grid
- Single column dashboard
- Collapsed navigation

### Mobile (< 768px)
- Single column layout
- Mobile navigation menu
- Swipeable carousel

---

## 💡 Pro Tips

1. **Notifications Badge**: The red badge on the bell icon shows unread count
2. **Registration Banner**: Only shows when user is NOT registered
3. **Past Events**: Marked with "Past Event" badge and can't be registered for
4. **Profile Status**: Shows "✓ Registered" or "Not Registered" in profile sidebar
5. **Activity Log**: Automatically updates when you register for events

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will suggest an alternative:
```bash
# Manually specify a different port
npm run dev -- -p 3001
```

### Clear Browser Cache
If you see stale data:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Reset Demo Data
To reset all data (logout, clear notifications, etc.):
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Local Storage"
4. Click "Clear All"
5. Refresh the page

---

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

Production build will be optimized and ready to deploy!

---

## 🎓 Next Steps

After exploring the portal:

1. Review the code structure in `app/` folder
2. Check out the dummy data in `lib/data.ts`
3. Explore the authentication context in `lib/auth-context.tsx`
4. Customize Tailwind colors in `tailwind.config.ts`
5. Read the full README.md for detailed documentation

---

## 📞 Need Help?

- Check the full README.md for comprehensive documentation
- Review Next.js 14 documentation: https://nextjs.org/docs
- Tailwind CSS docs: https://tailwindcss.com/docs

---

**Happy exploring! 🎉**

*Gig 'em! 👍*
