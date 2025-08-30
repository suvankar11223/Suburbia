# 🛼 Suburbia Skateboards

A modern, interactive e-commerce platform for custom skateboard design and purchase. Built with cutting-edge web technologies including Next.js 15, React 19, and Three.js for an immersive 3D customization experience.

![Suburbia Skateboards](https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Suburbia+Skateboards)

## ✨ Features

### 🎨 **3D Skateboard Customization**
- **Interactive 3D Models**: Real-time skateboard visualization using Three.js and React Three Fiber
- **Custom Components**: Choose from multiple deck designs, wheel patterns, truck colors, and bolt finishes
- **Live Preview**: See changes instantly as you customize your board
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔐 **Authentication & Security**
- **NextAuth.js Integration**: Secure user authentication with multiple providers
- **Protected Routes**: Middleware-based route protection for sensitive pages
- **Session Management**: JWT-based session handling with automatic refresh
- **User Registration**: Complete signup/login flow with validation

### 💳 **Payment Integration**
- **Razorpay Gateway**: Secure payment processing with INR/USD currency support
- **Order Management**: Complete order lifecycle from creation to verification
- **Transaction Security**: PCI-compliant payment handling
- **Order Confirmation**: Automated order success notifications

### 🛒 **E-commerce Features**
- **Shopping Cart**: Persistent cart with local storage and context management
- **Product Catalog**: Dynamic product display with Prismic CMS integration
- **Order History**: User order tracking and management
- **Inventory Management**: Real-time stock updates

### 🎯 **Modern Tech Stack**
- **Next.js 15**: Latest App Router with Server Components
- **React 19**: Cutting-edge React features with improved performance
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Prismic CMS**: Headless CMS for content management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB database
- Razorpay account for payments
- Prismic CMS account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/suburbia-skateboards.git
   cd suburbia-skateboards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/suburbia

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret

   # Prismic CMS
   PRISMIC_ENDPOINT=your-prismic-endpoint
   PRISMIC_ACCESS_TOKEN=your-prismic-access-token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
suburbia-skateboards/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── build/             # Customization page
│   │   ├── checkout/          # Payment page
│   │   ├── login/             # Authentication
│   │   └── signup/            # User registration
│   ├── components/            # Reusable components
│   │   ├── AuthButton.tsx     # Authentication button
│   │   ├── Skateboard.tsx     # 3D skateboard component
│   │   └── Header.tsx         # Navigation header
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Authentication config
│   │   └── cart-context.tsx   # Shopping cart context
│   └── slices/                # Prismic CMS slices
│       ├── Hero/              # Landing page hero
│       ├── ProductGrid/       # Product display
│       └── TeamGrid/          # Team showcase
├── public/                    # Static assets
│   ├── images/                # Product images
│   ├── skateboard/            # 3D model textures
│   └── hdr/                   # Environment maps
├── middleware.ts              # Route protection
└── tailwind.config.ts         # Styling configuration
```

## 🎮 Usage

### For Customers
1. **Browse Products**: Explore the skateboard catalog
2. **Customize**: Use the 3D customization tool to design your board
3. **Add to Cart**: Save your custom design to cart
4. **Checkout**: Secure payment with Razorpay
5. **Track Orders**: View order history and status

### For Developers
1. **Authentication**: Login required for customization features
2. **Route Protection**: Middleware protects sensitive routes
3. **CMS Integration**: Content managed through Prismic
4. **Payment Processing**: Integrated with Razorpay for secure transactions

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js

### Backend & Infrastructure
- **NextAuth.js** - Authentication library
- **MongoDB** - NoSQL database
- **Prismic CMS** - Headless content management
- **Razorpay** - Payment gateway
- **Vercel** - Deployment platform

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Git** - Version control

## 🔧 Configuration

### Environment Variables
See `.env.local.example` for all required environment variables.

### Prismic Setup
1. Create a Prismic repository
2. Import the custom types from `customtypes/`
3. Configure your content models
4. Set up the API endpoint in your environment

### Razorpay Setup
1. Create a Razorpay account
2. Generate API keys
3. Configure webhook endpoints for order verification
4. Set up test/live mode credentials

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For the amazing 3D graphics library
- **React Team** - For the incredible React ecosystem
- **Vercel** - For the outstanding deployment platform
- **Prismic** - For the flexible CMS solution
- **Razorpay** - For the reliable payment processing

## 📞 Support

For support, email support@suburbiaskateboards.com or join our Discord community.

---

**Made with ❤️ for skateboard enthusiasts worldwide**
