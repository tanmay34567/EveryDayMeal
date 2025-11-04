# 🍽️ EveryDayMeal

A modern web platform connecting students with local mess vendors for seamless menu browsing and ordering.

## 📖 About The Project

EveryDayMeal is a full-stack web application designed to simplify the interaction between students and mess vendors. The platform allows students to discover available vendors, browse daily menus with specific meal timings, and share their dining experiences through reviews. Vendors can efficiently manage their menus, set meal schedules, and receive valuable feedback from their customers.

## ✨ Features

### For Students
- **Secure Authentication** - Email-based OTP login system for secure access
- **Browse Vendors** - View all available mess vendors with ratings and location details
- **Daily Menus** - Check breakfast, lunch, and dinner menus with start and end timings
- **Rate & Review** - Share feedback and help other students make informed dining choices
- **Vendor Information** - Access vendor contact details, addresses, and business information

### For Vendors
- **Menu Management** - Create, update, and delete daily menus with ease
- **Meal Scheduling** - Set specific dates and days for menu availability
- **Meal Timings** - Define start and end times for breakfast, lunch, and dinner
- **Customer Feedback** - View ratings and reviews from students
- **Business Profile** - Display mess name, location, contact number, and address
- **Review Dashboard** - Track average ratings and total review count

### For Administrators
- **Vendor Application Management** - Review and approve/reject vendor applications
- **Application Dashboard** - View pending, approved, and rejected applications
- **Vendor Verification** - Verify business documents and GSTIN information

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Context API** - State management across components

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)** - Secure authentication mechanism
- **bcryptjs** - Password hashing for security
- **Nodemailer** - Email service for OTP delivery
- **Cloudinary** - Cloud-based image storage for vendor documents

## 🎯 Key Functionalities

### Authentication System
- Email-based OTP authentication for both students and vendors
- 6-digit OTP with 5-minute expiration time
- Automatic account creation on first login
- Secure JWT token-based session management
- HTTP-only cookies and Authorization headers for cross-domain support

### Menu Management
- Day and date validation to ensure accuracy
- Separate sections for breakfast, lunch, and dinner
- Time slot management for each meal type
- Edit and delete functionality for vendors
- Real-time menu updates visible to students

### Review & Rating System
- 5-star rating system for vendor feedback
- Optional comment section for detailed reviews
- One review per student per vendor policy
- Automatic average rating calculation
- Review count tracking for transparency
- Students can update or delete their own reviews

### Vendor Application Process
- Comprehensive application form with business details
- GSTIN number or restaurant image upload options
- Document verification through Cloudinary
- Admin approval workflow
- Automatic vendor account creation upon approval

### User Experience Features
- Navigation guards to prevent accidental back button exits
- Responsive design for mobile and desktop devices
- Loading states and error handling
- Smooth page transitions
- Real-time data updates

## 📱 User Workflows

### Student Journey
1. Login using email OTP
2. Browse available vendors on dashboard
3. Click on a vendor to view their menu
4. Check meal items and timings
5. Leave a rating and review
6. Update profile information if needed

### Vendor Journey
1. Apply for vendor account with business details
2. Wait for admin approval
3. Login using email OTP after approval
4. Create daily menu with meal timings
5. View customer reviews and ratings
6. Update or delete menus as needed

### Admin Journey
1. Login with admin credentials
2. View pending vendor applications
3. Review business details and documents
4. Approve or reject applications
5. Monitor vendor and student activity

## 🔐 Security Features

- Password hashing using bcryptjs
- JWT token authentication
- HTTP-only cookies for token storage
- Authorization header support for cross-domain requests
- OTP expiration for enhanced security
- Protected API routes with authentication middleware
- Input validation and sanitization

## 🌟 Project Highlights

- **Scalable Architecture** - Modular design for easy feature additions
- **RESTful API** - Well-structured API endpoints
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Updates** - Dynamic content loading
- **User-Friendly Interface** - Intuitive navigation and clean UI
- **Efficient Database Design** - Optimized MongoDB schemas
- **Error Handling** - Comprehensive error management
- **Code Organization** - Clean and maintainable codebase

## 📊 Database Models

### Student Model
- Name, Email, Contact Number
- Authentication details
- Profile information

### Vendor Model
- Personal details (Name, Email, Contact)
- Business details (Mess Name, Address, City, Pincode)
- GSTIN information
- Approval status

### Menu Model
- Vendor reference
- Date and day
- Meal details (Breakfast, Lunch, Dinner)
- Start and end times for each meal

### Review Model
- Student reference
- Vendor email
- Rating (1-5 stars)
- Comment
- Timestamp

### Vendor Application Model
- Applicant details
- Business information
- GSTIN or restaurant images
- Application status (Pending/Approved/Rejected)

## 🎨 Design Philosophy

The application follows modern web design principles with a focus on:
- **Simplicity** - Clean and uncluttered interface
- **Accessibility** - Easy to use for all users
- **Consistency** - Uniform design across all pages
- **Responsiveness** - Adapts to different screen sizes
- **Performance** - Fast loading times and smooth interactions

## 💡 Future Enhancements

- Order placement and payment integration
- Real-time notifications for menu updates
- Advanced search and filter options
- Vendor analytics dashboard
- Student meal preferences and recommendations
- Mobile application (iOS and Android)
- Multi-language support
- Subscription plans for vendors

---

**Developed by Tanmay Wagh**  
A project aimed at improving the student dining experience through technology.
